const ExpenseModel = require("../models/expenseModel");

/**
 * GET /api/expenses
 * Query params: category, dateFrom, dateTo, title
 */
async function getAllExpenses(req, res) {
  try {
    const { category, dateFrom, dateTo, title } = req.query;
    const expenses = await ExpenseModel.getAll({
      category,
      dateFrom,
      dateTo,
      title,
    });
    return res.json({ data: expenses });
  } catch (err) {
    console.error("getAllExpenses error:", err);
    return res.status(500).json({ error: "Failed to fetch expenses" });
  }
}

/**
 * GET /api/expenses/:id
 */
async function getExpenseById(req, res) {
  try {
    const expense = await ExpenseModel.getById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    return res.json({ data: expense });
  } catch (err) {
    console.error("getExpenseById error:", err);
    return res.status(500).json({ error: "Failed to fetch expense" });
  }
}

/**
 * POST /api/expenses
 */
async function createExpense(req, res) {
  try {
    const { title, amount, category, date, note } = req.body;
    const expense = await ExpenseModel.create({
      title,
      amount,
      category,
      date,
      note,
    });
    return res.status(201).json({ data: expense });
  } catch (err) {
    console.error("createExpense error:", err);
    return res.status(500).json({ error: "Failed to create expense" });
  }
}

/**
 * PUT /api/expenses/:id
 */
async function updateExpense(req, res) {
  try {
    const { title, amount, category, date, note } = req.body;
    const expense = await ExpenseModel.update(req.params.id, {
      title,
      amount,
      category,
      date,
      note,
    });
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    return res.json({ data: expense });
  } catch (err) {
    console.error("updateExpense error:", err);
    return res.status(500).json({ error: "Failed to update expense" });
  }
}

/**
 * DELETE /api/expenses/:id
 */
async function deleteExpense(req, res) {
  try {
    const expense = await ExpenseModel.delete(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    return res.json({ message: "Expense deleted", data: expense });
  } catch (err) {
    console.error("deleteExpense error:", err);
    return res.status(500).json({ error: "Failed to delete expense" });
  }
}

/**
 * GET /api/expenses/summary/monthly
 * Query params: year (default current), month (default current)
 */
async function getMonthlySummary(req, res) {
  try {
    const now = new Date();
    let year = parseInt(req.query.year, 10);
    let month = parseInt(req.query.month, 10);

    // Default to the current year / month when not provided or invalid
    if (isNaN(year) || year < 1900 || year > 2100) {
      year = now.getFullYear();
    }
    if (isNaN(month) || month < 1 || month > 12) {
      month = now.getMonth() + 1; // JS months are 0-indexed
    }

    const summary = await ExpenseModel.getMonthlySummary(year, month);

    return res.json({
      data: {
        year,
        month,
        total: summary.total,
        breakdown: summary.breakdown,
      },
    });
  } catch (err) {
    console.error("getMonthlySummary error:", err);
    return res.status(500).json({ error: "Failed to fetch monthly summary" });
  }
}

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
};
