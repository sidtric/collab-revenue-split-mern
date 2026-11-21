import { HTTP_STATUS } from "../../constants/http-status.js";
import { asyncHandler } from "../../lib/async-handler.js";
import { sendSuccess } from "../../lib/api-response.js";
import {
  collabPayloadSchema,
  createCollabSchema,
  joinCollabSchema,
} from "./collab.validation.js";

export function createCollabController({ service }) {
  return {
    createInvite: asyncHandler(async (request, response) => {
      const payload = createCollabSchema.parse(request.body);
      const data = await service.createCollabInvite(payload);

      return sendSuccess(response, {
        statusCode: HTTP_STATUS.CREATED,
        message: "Collab invite created",
        data,
      });
    }),

    joinInvite: asyncHandler(async (request, response) => {
      const payload = joinCollabSchema.parse(request.body);
      const data = await service.joinCollab(payload);

      return sendSuccess(response, {
        statusCode: HTTP_STATUS.OK,
        message: "Creator joined collab",
        data,
      });
    }),

    getByCode: asyncHandler(async (request, response) => {
      const data = await service.getCollabByCode(request.params.code);

      return sendSuccess(response, {
        statusCode: HTTP_STATUS.OK,
        message: "Collab fetched successfully",
        data,
      });
    }),

    configure: asyncHandler(async (request, response) => {
      const payload = collabPayloadSchema.parse(request.body);
      const data = await service.configureCollab(payload);

      return sendSuccess(response, {
        statusCode: HTTP_STATUS.OK,
        message: "Collab configured successfully",
        data,
      });
    }),

    preview: asyncHandler(async (request, response) => {
      const payload = collabPayloadSchema.parse(request.body);
      const data = await service.getSplitPreview(payload);

      return sendSuccess(response, {
        statusCode: HTTP_STATUS.OK,
        message: "Split preview generated",
        data,
      });
    }),

    createOrder: asyncHandler(async (request, response) => {
      const payload = collabPayloadSchema.parse(request.body);
      const data = await service.createOrder(payload);

      return sendSuccess(response, {
        statusCode: HTTP_STATUS.CREATED,
        message: "Collaborative order created",
        data,
      });
    }),

    seedOrders: asyncHandler(async (request, response) => {
      const data = await service.seedDemoOrders(request.body.code);

      return sendSuccess(response, {
        statusCode: HTTP_STATUS.CREATED,
        message: "Demo buyers created successfully",
        data,
      });
    }),

    listOrders: asyncHandler(async (_request, response) => {
      const data = await service.listOrders(_request.query.code);

      return sendSuccess(response, {
        statusCode: HTTP_STATUS.OK,
        message: "Orders fetched successfully",
        data,
      });
    }),

    walletSummary: asyncHandler(async (request, response) => {
      const data = await service.getWalletSummary(request.query.code);

      return sendSuccess(response, {
        statusCode: HTTP_STATUS.OK,
        message: "Wallet summary fetched successfully",
        data,
      });
    }),

    settle: asyncHandler(async (request, response) => {
      const data = await service.settleCollab(request.body.code);

      return sendSuccess(response, {
        statusCode: HTTP_STATUS.OK,
        message: "Pending wallet entries settled successfully",
        data,
      });
    }),
  };
}
