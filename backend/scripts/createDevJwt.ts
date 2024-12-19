import { generateKeyPair } from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import path from "path";
import { mkdir, writeFile } from "fs";
import config from "@/config";

const saveFile = async (filename: string, content: string) => {
  const _mkdir = promisify(mkdir);
  const _writeFile = promisify(writeFile);

  const fileDir = path.resolve(__dirname, "../../.token");
  const filePath = path.join(fileDir, filename);

  await _mkdir(fileDir, { recursive: true });
  await _writeFile(filePath, content, "utf-8");
};

(async () => {
  const _generateKeyPair = promisify(generateKeyPair);
  const { publicKey, privateKey } = await _generateKeyPair("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  const token = jwt.sign({ username: config.DEV_USER_ID }, privateKey, {
    algorithm: "RS256",
    keyid: "taskosaurus-dev-token",
  });

  saveFile(".jwt", token);
  saveFile(".public-key", publicKey);
})();
3;
