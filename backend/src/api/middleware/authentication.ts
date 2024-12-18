import { NextFunction, Request, Response, RequestHandler } from "express";
import jwksClient, { SigningKey } from "jwks-rsa";
import jwt, { JwtHeader } from "jsonwebtoken";
import { z } from "zod";
import config from "@/config";

const DEV_USER_ID = "db22f766-5b91-4ffd-868d-2d1c5169ce8b";

export interface AuthenticatedRequest extends Request {
  userId: string;
}

const accessTokenSchema = z.object({
  username: z.string(),
});

const client = jwksClient({
  jwksUri: config.OIDC_JWKS_URI,
});

type GetKeyCallback = (err: Error | null, key?: string) => void;

const getKey = (header: JwtHeader, callback: GetKeyCallback): void => {
  client.getSigningKey(
    header.kid || "",
    (err: Error | null, key?: SigningKey) => {
      if (err || !key) {
        return callback(err || new Error("Signing key not found"));
      }

      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  );
};

const getRequestToken = (request: Request): string => {
  return request.headers.authorization?.split(" ")[1]!;
};

export const authenticateRequest = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (config.USE_DEV_TOKEN) {
      (req as AuthenticatedRequest).userId = DEV_USER_ID;
      next();
      return;
    }

    const token = getRequestToken(req);

    if (!token) {
      res.status(403).send({ message: "Must provide token" });
      return;
    }

    jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) {
        res.status(401).send({ message: "Not authorized" });
        return;
      }

      const payload = accessTokenSchema.parse(decoded);
      (req as AuthenticatedRequest).userId = payload.username;

      next();
      return;
    });
  };
};
