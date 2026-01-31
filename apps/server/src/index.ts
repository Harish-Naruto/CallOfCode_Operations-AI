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
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

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

// Worker routes (authenticated)
app.use("/api", workerRoutes);

// Owner routes (admin only)
app.use("/api/owner", ownerRoutes);

// Inventory routes
app.use("/api/inventory", inventoryRoutes);

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
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("\n📍 Available Routes:");
  console.log("  - GET  /");
  console.log("  - GET  /health");
  console.log("\n👥 Customer Routes:");
  console.log("  - POST /api/webhooks/whatsapp");
  console.log("  - POST /api/requests");
  console.log("  - GET  /api/requests/:requestId/status");
  console.log("\n👷 Worker Routes:");
  console.log("  - GET  /api/tasks");
  console.log("  - POST /api/tasks/:taskId/accept");
  console.log("  - POST /api/tasks/:taskId/update");
  console.log("  - POST /api/tasks/:taskId/complete");
  console.log("  - POST /api/workers/:workerId/availability");
  console.log("\n👔 Owner Routes:");
  console.log("  - GET  /api/owner/requests");
  console.log("  - GET  /api/owner/requests/:requestId");
  console.log("  - POST /api/owner/requests/:requestId/force-assign");
  console.log("  - PUT  /api/owner/config/decision-rules");
  console.log("  - GET  /api/owner/audit");
  console.log("\n📦 Inventory Routes:");
  console.log("  - POST /api/inventory/update");
  console.log("  - POST /api/webhooks/supplier");
  console.log("\n🤖 Internal Agent Routes:");
  console.log("  - POST /internal/agent/enqueue");
  console.log("  - POST /internal/agent/re-evaluate/:requestId");
  console.log("  - POST /internal/agent/simulate");
  console.log("\n✅ All routes registered successfully!");
});
