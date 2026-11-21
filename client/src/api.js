const API_BASE = "http://localhost:5050/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    method: options.method || "GET",
    body:
      options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
  });

  const text = await response.text();
  let payload = {};

  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { message: text };
  }

  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload.data;
}

export const api = {
  createInvite(payload) {
    return request("/collab/invite", {
      method: "POST",
      body: payload,
    });
  },
  joinCollab(payload) {
    return request("/collab/join", {
      method: "POST",
      body: payload,
    });
  },
  getCollab(code) {
    return request(`/collab/session/${encodeURIComponent(code)}`);
  },
  configureCollab(payload) {
    return request("/collab/configure", {
      method: "POST",
      body: payload,
    });
  },
  previewSplit(payload) {
    return request("/collab/preview", {
      method: "POST",
      body: payload,
    });
  },
  createOrder(payload) {
    return request("/collab/orders", {
      method: "POST",
      body: payload,
    });
  },
  seedOrders(code) {
    return request("/collab/orders/seed", {
      method: "POST",
      body: { code },
    });
  },
  listOrders(code) {
    const suffix = code ? `?code=${encodeURIComponent(code)}` : "";
    return request(`/collab/orders${suffix}`);
  },
  listWallets(code) {
    const suffix = code ? `?code=${encodeURIComponent(code)}` : "";
    return request(`/collab/wallets${suffix}`);
  },
  settleCollab(code) {
    return request("/collab/settle", {
      method: "POST",
      body: { code },
    });
  },
};
