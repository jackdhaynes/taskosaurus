import { NextFunction, Request, Response, RequestHandler } from "express";
import jwksClient, { SigningKey } from "jwks-rsa";
import jwt, { JwtHeader } from "jsonwebtoken";
import { z } from "zod";
import config from "@/config";
import { UserIdentity } from "@/application/types";

export interface AuthenticatedRequest extends Request {
  userIdentity: UserIdentity;
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

export const authenticateRequest = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  if (config.USE_DEV_AUTH) {
    (request as AuthenticatedRequest).userIdentity = {
      userId: config.DEV_USER_ID,
    };

    return next();
  }

  const token = getRequestToken(request);

  if (!token) {
    response.status(403).json({ error: "Must provide authorization token" });
    return;
  }

  jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      response.status(401).json({ message: "Not authorized" });
      return;
    }

    const payload = accessTokenSchema.parse(decoded);
    (request as AuthenticatedRequest).userIdentity = {
      userId: config.DEV_USER_ID,
    };

    return next();
  });
};
