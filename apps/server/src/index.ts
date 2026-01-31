import { env } from "@Hackron/env/server";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

// Middleware
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { idempotency } from "./middleware/idempotency.middleware";

// Routes
import authRoutes from "./routes/auth/auth.routes";
import customerRoutes from "./routes/customer/customer.routes";
import workerRoutes from "./routes/worker/worker.routes";
import ownerRoutes from "./routes/owner/owner.routes";
import inventoryRoutes from "./routes/inventory/inventory.routes";
import agentRoutes from "./routes/internal/agent.routes";

const app = express();

// CORS configuration
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Idempotency-Key'],
  exposedHeaders: ['Set-Cookie']
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global middleware
app.use(idempotency);

// Health check
app.get("/", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Decision-Centric AI API",
    version: "1.0.0",
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// API ROUTES
// ============================================================

// Auth routes
app.use("/api/auth", authRoutes);

// Customer routes (public and semi-public)
app.use("/api", customerRoutes);

// Inventory routes (must be before worker routes to avoid auth blocking)
app.use("/api/inventory", inventoryRoutes);

// Worker routes (authenticated)
app.use("/api", workerRoutes);

// Owner routes (admin only)
app.use("/api/owner", ownerRoutes);

// Internal agent routes (protected by agent guard)
app.use("/internal", agentRoutes);

// ============================================================
// ERROR HANDLING
// ============================================================

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// ============================================================
// SERVER
// ============================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});