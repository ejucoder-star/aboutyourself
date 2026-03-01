import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// tRPC API routes
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// OAuth callback
app.get("/api/oauth/callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code || !state) {
      return res.status(400).json({ error: "Missing code or state" });
    }

    // Forward to your OAuth handler
    // This is handled by the tRPC router
    res.redirect("/");
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).json({ error: "OAuth callback failed" });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
