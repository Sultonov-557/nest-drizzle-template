import { config } from 'dotenv';
import { bool, cleanEnv, num, str } from 'envalid';
config();

export const env = cleanEnv(process.env, {
  PORT: num(),
  ENV: str({ choices: ['dev', 'prod'] }),
  ACCESS_TOKEN_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(),
  DB_HOST: str(),
  DB_PORT: num(),
  DB_USERNAME: str(),
  DB_PASSWORD: str(),
  DB_NAME: str(),
  PASSPHRASE: str(),
  REDIS_HOST: str(),
  REDIS_PORT: num(),
});
