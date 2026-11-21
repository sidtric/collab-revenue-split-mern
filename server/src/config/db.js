import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../lib/logger.js";

export async function connectDatabase() {
  if (!env.mongoUri) {
    logger.warn("MongoDB URI not configured, using in-memory demo store.");
    return false;
  }

  await mongoose.connect(env.mongoUri);
  logger.info("MongoDB connected");
  return true;
}
