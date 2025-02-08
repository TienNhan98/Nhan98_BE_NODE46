import "dotenv/config";

export const DATABASE_URL = process.env.DATABASE_URL;
export const ACCESS_TOKEN_SERECT = process.env.ACCESS_TOKEN_SERECT;
export const ACCESS_TOKEN_EXPIRED = process.env.ACCESS_TOKEN_EXPIRED;

export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const REFRESH_TOKEN_EXPIRED = process.env.REFRESH_TOKEN_EXPIRED;

export const REGEX_EMAIL =
  /(?=^[a-z0-9.]+@[a-z0-9.-]+\.[a-zA-Z]{2,6}$)(?=^.{1,40}$)/i;

console.log("📢[app.constant.js:1]: DATABASE_URL: ", DATABASE_URL);
// console.log({ env: process.env.DATABASE_URL });

console.log({
  DATABASE_URL,
  ACCESS_TOKEN_SERECT,
  ACCESS_TOKEN_EXPIRED,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRED,
});
