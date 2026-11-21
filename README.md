# Collaborative Revenue Split MERN Prototype

This is a proper app-style prototype for a creator collaboration feature:

- `Express` API
- `React` client with `Vite`
- `Mongoose` models for real Mongo integration
- `Zod` request validation
- in-memory fallback so the feature still runs without MongoDB

## What it demonstrates

- collaborative product setup for two creators
- internal ledger split on successful order
- settlement-first payout approach
- refund-before-settlement and post-settlement behavior preview
- production-style folder structure for later extension

## Structure

- `client/` React app
- `server/src/` Express API

## Environment

Copy `.env.example` to `.env` if you want to override defaults.

## Run

Install dependencies:

```bash
npm install
```

Run the API:

```bash
npm run dev:server
```

Run the client:

```bash
npm run dev:client
```

Client URL:

```text
http://localhost:4173
```

API URL:

```text
http://localhost:5050
```

## Notes

- If `MONGODB_URI` is missing, the API uses an in-memory store for demo data.
- Mongoose schemas are still included so the backend is ready to move to Mongo later.
