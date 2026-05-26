const express = require("express");
const router = express.Router();

const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
} = require("../controllers/expenseController");

const { validateExpense, validateId } = require("../middleware/validate");

// ── Summary (must be registered BEFORE the /:id route) ──
router.get("/summary/monthly", getMonthlySummary);

// ── CRUD ─────────────────────────────────────────────────
router.get("/",    getAllExpenses);
router.get("/:id", validateId, getExpenseById);
router.post("/",   validateExpense, createExpense);
router.put("/:id", validateId, validateExpense, updateExpense);
router.delete("/:id", validateId, deleteExpense);

module.exports = router;
