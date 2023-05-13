import { config } from "dotenv";

config();

export const DB = process.env.DB;
export const SECRET = process.env.SECRET;
export const PORT = process.env.PORT || 5000;
export const DOMAIN = process.env.APP_DOMAIN;
