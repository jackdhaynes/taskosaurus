import { env } from "process";

export default {
  ENV: env.ENVIRONMENT || "dev",
  OIDC_JWKS_URI: env.OIDC_JWKS_URI!,
  USE_DEV_TOKEN: Boolean(env.USE_DEV_TOKEN) || false,
  DEV_USER_ID: Number(env.DEV_USER_ID) || 1,
};
