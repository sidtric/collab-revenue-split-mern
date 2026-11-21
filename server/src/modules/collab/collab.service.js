import { calculateRefundPreview, calculateSplit } from "../../utils/calculate-split.js";

function buildOrderPayload(payload) {
  const split = calculateSplit(payload);
  const settlementCycleDays = Number(payload.settlementCycleDays || 7);
  const settlementDate = new Date();
  settlementDate.setDate(settlementDate.getDate() + settlementCycleDays);

  return {
    buyerName: payload.buyerName || "Demo buyer",
    productName: payload.productName,
    creatorAName: payload.creatorAName,
    creatorBName: payload.creatorBName,
    code: payload.code,
    price: split.gross,
    platformFeeAmount: split.fee,
    netAmount: split.net,
    settlementDate: settlementDate.toISOString(),
    settlementStatus: "pending",
    ledger: split.ledger,
  };
}

export function createCollabService({ repository }) {
  return {
    async createCollabInvite({ creatorAName }) {
      const code = Math.random().toString(36).slice(2, 8).toUpperCase();
      return repository.createSession({
        code,
        creatorAName,
        creatorBName: "",
        productName: "",
        price: 0,
        platformFeePercent: 10,
        creatorASplit: 60,
        creatorBSplit: 40,
        settlementCycleDays: 7,
        status: "invite_created",
        creators: [{ name: creatorAName, splitPercent: 60 }],
      });
    },

    async joinCollab({ code, creatorBName }) {
      const session = await repository.getSessionByCode(code);
      if (!session) {
        throw new Error("Collab code not found");
      }

      return repository.updateSessionByCode(code, {
        creatorBName,
        status: "joined",
        creators: [
          { name: session.creatorAName, splitPercent: session.creatorASplit || 60 },
          { name: creatorBName, splitPercent: session.creatorBSplit || 40 },
        ],
      });
    },

    async getCollabByCode(code) {
      return repository.getSessionByCode(code);
    },

    async configureCollab(payload) {
      const split = calculateSplit(payload);
      return repository.updateSessionByCode(payload.code, {
        productName: payload.productName,
        price: payload.price,
        platformFeePercent: payload.platformFeePercent,
        creatorASplit: payload.creatorASplit,
        creatorBSplit: split.creatorBSplit,
        creatorAName: payload.creatorAName,
        creatorBName: payload.creatorBName,
        settlementCycleDays: 7,
        status: "configured",
        creators: [
          { name: payload.creatorAName, splitPercent: payload.creatorASplit },
          { name: payload.creatorBName, splitPercent: split.creatorBSplit },
        ],
      });
    },

    async getSplitPreview(payload) {
      const split = calculateSplit(payload);

      return {
        ...payload,
        ...split,
        refundPreview: calculateRefundPreview({
          settled: Boolean(payload.settled),
          creatorAName: payload.creatorAName,
          creatorBName: payload.creatorBName,
          creatorAAmount: split.creatorAAmount,
          creatorBAmount: split.creatorBAmount,
        }),
      };
    },

    async createOrder(payload) {
      const session = await repository.getSessionByCode(payload.code);

      return repository.createOrder(
        buildOrderPayload({
          ...payload,
          settlementCycleDays: session?.settlementCycleDays || 7,
        }),
      );
    },

    async seedDemoOrders(code) {
      const session = await repository.getSessionByCode(code);
      if (!session) {
        throw new Error("Collab code not found");
      }

      const buyers = ["Aarav", "Meera", "Kabir", "Siya"];
      const createdOrders = [];

      for (const buyerName of buyers) {
        const order = await repository.createOrder(
          buildOrderPayload({
            code,
            buyerName,
            productName: session.productName || "Creator Playbook",
            price: session.price || 499,
            platformFeePercent: session.platformFeePercent || 10,
            creatorAName: session.creatorAName,
            creatorBName: session.creatorBName,
            creatorASplit: session.creatorASplit || 60,
            settlementCycleDays: session.settlementCycleDays || 7,
          }),
        );
        createdOrders.push(order);
      }

      return createdOrders;
    },

    async listOrders(code) {
      if (code) {
        return repository.listOrdersByCode(code);
      }

      return repository.listOrders();
    },

    async getWalletSummary(code) {
      const orders = code
        ? await repository.listOrdersByCode(code)
        : await repository.listOrders();
      const wallets = {};

      for (const order of orders) {
        for (const entry of order.ledger || []) {
          if (entry.type !== "credit") {
            continue;
          }

          if (!wallets[entry.owner]) {
            wallets[entry.owner] = {
              creatorName: entry.owner,
              pendingBalance: 0,
              settledBalance: 0,
              totalEarned: 0,
              salesCount: 0,
              transactions: [],
            };
          }

          if (order.settlementStatus === "settled") {
            wallets[entry.owner].settledBalance += entry.amount;
          } else {
            wallets[entry.owner].pendingBalance += entry.amount;
          }
          wallets[entry.owner].totalEarned += entry.amount;
          wallets[entry.owner].salesCount += 1;
          wallets[entry.owner].transactions.unshift({
            orderId: order.id,
            productName: order.productName,
            amount: entry.amount,
            status: order.settlementStatus,
            createdAt: order.createdAt,
            settlementDate: order.settlementDate,
          });
        }
      }

      return Object.values(wallets).sort((a, b) => b.totalEarned - a.totalEarned);
    },

    async settleCollab(code) {
      if (!code) {
        throw new Error("Collab code is required");
      }

      return repository.settleOrdersByCode(code);
    },
  };
}
