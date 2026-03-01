import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// tRPC routes
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Catch-all for unmatched routes
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default async (req: VercelRequest, res: VercelResponse) => {
  return new Promise((resolve) => {
    app(req as any, res as any, () => {
      resolve(undefined);
    });
  });
};
