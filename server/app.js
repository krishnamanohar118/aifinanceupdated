import cors from "cors";
import express from "express";

import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import transactionsRoutes from "./routes/transactionsRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import budgetsRoutes from "./routes/budgetsRoutes.js";
import goalsRoutes from "./routes/goalsRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";
import notificationsRoutes from "./routes/notificationsRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);

app.use(express.json());

// =========================
// API ROUTES
// =========================

app.use("/api/health", healthRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/transactions", transactionsRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/budgets", budgetsRoutes);

app.use("/api/goals", goalsRoutes);

// Existing chat route
app.use("/api/chat", chatRoutes);

// AI Finance Assistant
app.use("/api/assistant", assistantRoutes);

app.use("/api/notifications", notificationsRoutes);

app.use("/api/reports", reportsRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/dashboard", dashboardRoutes);

// =========================
// ERROR HANDLING
// =========================

app.use(notFound);

app.use(errorHandler);

export default app;
