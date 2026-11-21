import { Router } from "express";
import { createCollabController } from "./collab.controller.js";
import { createCollabRepository } from "./collab.repository.js";
import { createCollabService } from "./collab.service.js";

export function createCollabRouter({ mongoEnabled }) {
  const repository = createCollabRepository({ mongoEnabled });
  const service = createCollabService({ repository });
  const controller = createCollabController({ service });
  const router = Router();

  router.post("/invite", controller.createInvite);
  router.post("/join", controller.joinInvite);
  router.post("/configure", controller.configure);
  router.post("/preview", controller.preview);
  router.get("/orders", controller.listOrders);
  router.post("/orders", controller.createOrder);
  router.post("/orders/seed", controller.seedOrders);
  router.get("/wallets", controller.walletSummary);
  router.post("/settle", controller.settle);
  router.get("/session/:code", controller.getByCode);

  return router;
}
