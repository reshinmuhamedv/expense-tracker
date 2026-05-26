const { query } = require("../config/db");

const ExpenseModel = {
  /**
   * Retrieve all expenses with optional filters.
   * @param {Object}  filters
   * @param {string}  [filters.category]  - Exact category match
   * @param {string}  [filters.dateFrom]  - Inclusive start date (YYYY-MM-DD)
   * @param {string}  [filters.dateTo]    - Inclusive end date   (YYYY-MM-DD)
   * @param {string}  [filters.title]     - Partial, case-insensitive title match
   */
  async getAll(filters = {}) {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (filters.category) {
      conditions.push(`category = $${paramIndex++}`);
      values.push(filters.category);
    }

    if (filters.dateFrom) {
      conditions.push(`date >= $${paramIndex++}`);
      values.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      conditions.push(`date <= $${paramIndex++}`);
      values.push(filters.dateTo);
    }

    if (filters.title) {
      conditions.push(`title ILIKE $${paramIndex++}`);
      values.push(`%${filters.title}%`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const sql = `SELECT * FROM expenses ${whereClause} ORDER BY date DESC, created_at DESC`;
    const result = await query(sql, values);
    return result.rows;
  },

  /**
   * Retrieve a single expense by its id.
   * @param {number} id
   */
  async getById(id) {
    const sql = "SELECT * FROM expenses WHERE id = $1";
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  /**
   * Create a new expense.
   * @param {Object}  data
   * @param {string}  data.title
   * @param {number}  data.amount
   * @param {string}  data.category
   * @param {string}  [data.date]
   * @param {string}  [data.note]
   */
  async create({ title, amount, category, date, note }) {
    const sql = `
      INSERT INTO expenses (title, amount, category, date, note)
      VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE), $5)
      RETURNING *
    `;
    const values = [title, amount, category, date || null, note || null];
    const result = await query(sql, values);
    return result.rows[0];
  },

  /**
   * Update an existing expense by id.
   * @param {number} id
   * @param {Object} data - Fields to update (title, amount, category, date, note)
   */
  async update(id, { title, amount, category, date, note }) {
    const sql = `
      UPDATE expenses
      SET title      = $1,
          amount     = $2,
          category   = $3,
          date       = COALESCE($4, date),
          note       = $5,
          updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;
    const values = [title, amount, category, date || null, note || null, id];
    const result = await query(sql, values);
    return result.rows[0] || null;
  },

  /**
   * Delete an expense by id.
   * @param {number} id
   */
  async delete(id) {
    const sql = "DELETE FROM expenses WHERE id = $1 RETURNING *";
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  /**
   * Get a monthly spending summary: overall total + per-category breakdown.
   * @param {number} year  - Four-digit year
   * @param {number} month - 1–12
   * @returns {{ total: string, breakdown: { category: string, total: string }[] }}
   */
  async getMonthlySummary(year, month) {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;

    // Total for the month
    const totalSql = `
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM expenses
      WHERE date >= $1::date
        AND date < ($1::date + INTERVAL '1 month')
    `;
    const totalResult = await query(totalSql, [startDate]);

    // Breakdown by category
    const breakdownSql = `
      SELECT category, COALESCE(SUM(amount), 0) AS total
      FROM expenses
      WHERE date >= $1::date
        AND date < ($1::date + INTERVAL '1 month')
      GROUP BY category
      ORDER BY total DESC
    `;
    const breakdownResult = await query(breakdownSql, [startDate]);

    return {
      total: totalResult.rows[0].total,
      breakdown: breakdownResult.rows,
    };
  },
};

module.exports = ExpenseModel;
