import { NextFunction, Request, Response, RequestHandler } from "express";
import jwksClient, { SigningKey } from "jwks-rsa";
import jwt, { JwtHeader } from "jsonwebtoken";
import { z } from "zod";
import config from "@/config";
import { UserIdentity } from "@/application/types";
import path from "path";
import { promisify } from "util";
import { readFile } from "fs";

const DEV_KEY_PATH = "../../../../.token/.public-key";

let cachedPublicKey: string;

export interface AuthenticatedRequest extends Request {
  userIdentity: UserIdentity;
}

const accessTokenSchema = z.object({
  username: z.coerce.string(),
});

const client = jwksClient({
  jwksUri: config.OIDC_JWKS_URI,
});

type GetKeyCallback = (err: Error | null, key?: string) => void;

const getRemoteKey = (header: JwtHeader, callback: GetKeyCallback): void => {
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

const getDevKey = async (
  header: JwtHeader,
  callback: GetKeyCallback
): Promise<void> => {
  if (!cachedPublicKey) {
    const keyPath = path.resolve(__dirname, DEV_KEY_PATH);
    const _readFile = promisify(readFile);

    cachedPublicKey = await _readFile(keyPath, "utf-8");
  }

  callback(null, cachedPublicKey);
};

const getRequestToken = (request: Request): string => {
  return request.headers.authorization?.split(" ")[1]!;
};

export const authenticateRequest = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const token = getRequestToken(request);

  if (!token) {
    response.status(403).json({ error: "Must provide authorization token" });
    return;
  }

  const publicKey = config.USE_DEV_TOKEN ? getDevKey : getRemoteKey;

  jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
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
