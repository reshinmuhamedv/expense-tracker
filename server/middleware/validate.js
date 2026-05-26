const VALID_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
];

// Strict YYYY-MM-DD format (also validates day ranges roughly)
const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/**
 * Middleware — validates the request body for creating / updating an expense.
 */
function validateExpense(req, res, next) {
  const errors = [];
  const { title, amount, category, date, note } = req.body;

  // ── title ──────────────────────────────────────────────
  if (title === undefined || title === null) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (typeof title !== "string") {
    errors.push({ field: "title", message: "Title must be a string" });
  } else if (title.trim().length === 0) {
    errors.push({ field: "title", message: "Title cannot be empty" });
  } else if (title.trim().length > 255) {
    errors.push({
      field: "title",
      message: "Title must be at most 255 characters",
    });
  } else {
    // Sanitise: store the trimmed value
    req.body.title = title.trim();
  }

  // ── amount ─────────────────────────────────────────────
  if (amount === undefined || amount === null) {
    errors.push({ field: "amount", message: "Amount is required" });
  } else {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || !isFinite(numAmount)) {
      errors.push({ field: "amount", message: "Amount must be a valid number" });
    } else if (numAmount <= 0) {
      errors.push({
        field: "amount",
        message: "Amount must be a positive number",
      });
    } else {
      req.body.amount = numAmount;
    }
  }

  // ── category ───────────────────────────────────────────
  if (category === undefined || category === null) {
    errors.push({ field: "category", message: "Category is required" });
  } else if (!VALID_CATEGORIES.includes(category)) {
    errors.push({
      field: "category",
      message: `Category must be one of: ${VALID_CATEGORIES.join(", ")}`,
    });
  }

  // ── date (optional) ────────────────────────────────────
  if (date !== undefined && date !== null && date !== "") {
    if (!DATE_REGEX.test(date)) {
      errors.push({
        field: "date",
        message: "Date must be in YYYY-MM-DD format",
      });
    } else {
      // Extra guard: ensure Date.parse actually considers it valid
      const parsed = new Date(date + "T00:00:00Z");
      if (isNaN(parsed.getTime())) {
        errors.push({
          field: "date",
          message: "Date is not a valid calendar date",
        });
      }
    }
  }

  // ── note (optional) ────────────────────────────────────
  if (note !== undefined && note !== null) {
    if (typeof note !== "string") {
      errors.push({ field: "note", message: "Note must be a string" });
    } else if (note.length > 1000) {
      errors.push({
        field: "note",
        message: "Note must be at most 1000 characters",
      });
    }
  }

  // ── respond or continue ────────────────────────────────
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

/**
 * Middleware — validates that req.params.id is a positive integer.
 */
function validateId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      errors: [{ field: "id", message: "ID must be a positive integer" }],
    });
  }

  // Store the parsed integer so downstream code doesn't re-parse
  req.params.id = id;
  next();
}

module.exports = { validateExpense, validateId };
