require("dotenv").config();

const express = require("express");
const cors = require("cors");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

// ── Global Middleware ────────────────────────────────────
app.use(cors()); // Allow all origins in development
app.use(express.json({ limit: "10kb" }));

// ── API Routes ───────────────────────────────────────────
app.use("/api/expenses", expenseRoutes);

// ── Health Check ─────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Expense Tracker API is running 🚀" });
});

// ── 404 Handler ──────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global Error Handler ─────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// ── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅  Expense Tracker API listening on http://localhost:${PORT}`);
  console.log(`📡  Endpoints available at http://localhost:${PORT}/api/expenses`);
});
