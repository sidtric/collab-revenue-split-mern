import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5050),
  CLIENT_ORIGIN: z.string().default("http://localhost:4173"),
  MONGODB_URI: z.string().optional().default(""),
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  port: parsedEnv.PORT,
  clientOrigin: parsedEnv.CLIENT_ORIGIN,
  mongoUri: parsedEnv.MONGODB_URI,
};
