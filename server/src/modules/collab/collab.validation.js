import { z } from "zod";

export const createCollabSchema = z.object({
  creatorAName: z.string().trim().min(1),
});

export const joinCollabSchema = z.object({
  code: z.string().trim().min(4),
  creatorBName: z.string().trim().min(1),
});

export const collabPayloadSchema = z.object({
  code: z.string().trim().min(4).optional(),
  productName: z.string().trim().min(1),
  price: z.number().nonnegative(),
  platformFeePercent: z.number().min(0).max(100),
  creatorAName: z.string().trim().min(1),
  creatorBName: z.string().trim().min(1),
  creatorASplit: z.number().min(0).max(100),
  settled: z.boolean().optional().default(false),
});
