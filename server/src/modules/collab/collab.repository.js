import { CollabSession } from "../../models/collab-session.model.js";
import { Order } from "../../models/order.model.js";
import { inMemoryStore } from "../../store/in-memory-store.js";

function normalizeOrder(order) {
  if (!order) {
    return null;
  }

  if (order._id) {
    return {
      id: String(order._id),
      ...order,
    };
  }

  return order;
}

export function createCollabRepository({ mongoEnabled }) {
  return {
    async createSession(payload) {
      if (mongoEnabled) {
        const session = await CollabSession.create(payload);
        return {
          id: String(session._id),
          ...session.toObject(),
        };
      }

      const session = {
        id: `collab_${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.collabs.unshift(session);
      return session;
    },

    async getSessionByCode(code) {
      if (mongoEnabled) {
        const session = await CollabSession.findOne({ code }).lean();
        return normalizeOrder(session);
      }

      return inMemoryStore.collabs.find((item) => item.code === code) || null;
    },

    async updateSessionByCode(code, updates) {
      if (mongoEnabled) {
        const session = await CollabSession.findOneAndUpdate(
          { code },
          { $set: updates },
          { new: true },
        ).lean();
        return normalizeOrder(session);
      }

      const session = inMemoryStore.collabs.find((item) => item.code === code);
      if (!session) {
        return null;
      }

      Object.assign(session, updates, {
        updatedAt: new Date().toISOString(),
      });
      return session;
    },

    async createOrder(orderPayload) {
      if (mongoEnabled) {
        const order = await Order.create(orderPayload);
        return normalizeOrder(order.toObject());
      }

      const order = {
        id: `order_${Date.now()}`,
        ...orderPayload,
        createdAt: new Date().toISOString(),
      };

      inMemoryStore.orders.unshift(order);
      return order;
    },

    async listOrders() {
      if (mongoEnabled) {
        const orders = await Order.find().sort({ createdAt: -1 }).lean();
        return orders.map(normalizeOrder);
      }

      return inMemoryStore.orders;
    },

    async listOrdersByCode(code) {
      const orders = await this.listOrders();
      return orders.filter((order) => order.code === code);
    },

    async settleOrdersByCode(code) {
      if (mongoEnabled) {
        await Order.updateMany(
          { code, settlementStatus: "pending" },
          { $set: { settlementStatus: "settled" } },
        );

        const orders = await Order.find({ code }).sort({ createdAt: -1 }).lean();
        return orders.map(normalizeOrder);
      }

      for (const order of inMemoryStore.orders) {
        if (order.code === code && order.settlementStatus === "pending") {
          order.settlementStatus = "settled";
        }
      }

      return this.listOrdersByCode(code);
    },
  };
}
