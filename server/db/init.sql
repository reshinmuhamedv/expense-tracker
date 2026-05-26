-- ============================================
-- Expense Tracker — Database Initialization
-- ============================================

-- Create the expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id          SERIAL          PRIMARY KEY,
    title       VARCHAR(255)    NOT NULL,
    amount      NUMERIC(12, 2)  NOT NULL CHECK (amount > 0),
    category    VARCHAR(50)     NOT NULL CHECK (
                    category IN ('Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other')
                ),
    date        DATE            NOT NULL DEFAULT CURRENT_DATE,
    note        TEXT,
    created_at  TIMESTAMPTZ     DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     DEFAULT NOW()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_expenses_date     ON expenses (date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses (category);
