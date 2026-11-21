export const ROUTES = {
  overview: "overview",
  collab: "collab",
  ledger: "ledger",
  wallets: "wallets",
};

export const NAV_ITEMS = [
  { id: ROUTES.overview, label: "Overview" },
  { id: ROUTES.collab, label: "Collab" },
  { id: ROUTES.ledger, label: "Ledger" },
  { id: ROUTES.wallets, label: "Wallets" },
];

export function getCurrentRoute() {
  const hash = window.location.hash.replace("#", "");
  return Object.values(ROUTES).includes(hash) ? hash : ROUTES.overview;
}
