import { useState, useEffect } from 'react';
import { getTodayString } from '../utils/helpers';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

const initialForm = {
  title: '',
  amount: '',
  category: 'Food',
  date: getTodayString(),
  note: '',
};

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = 'Title is required';
  else if (form.title.trim().length < 2) errors.title = 'Title must be at least 2 characters';

  if (!form.amount) errors.amount = 'Amount is required';
  else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0)
    errors.amount = 'Enter a valid positive amount';

  if (!form.category) errors.category = 'Select a category';
  if (!form.date) errors.date = 'Date is required';

  return errors;
}

export default function ExpenseForm({ expense, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setForm({
        title: expense.title || '',
        amount: expense.amount?.toString() || '',
        category: expense.category || 'Food',
        date: expense.date ? expense.date.slice(0, 10) : getTodayString(),
        note: expense.note || '',
      });
    } else {
      setForm({ ...initialForm, date: getTodayString() });
    }
    setErrors({});
    setTouched({});
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ title: true, amount: true, category: true, date: true });

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        note: form.note.trim(),
      });
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!expense;

  return (
    <form className="expense-form" onSubmit={handleSubmit} noValidate>
      <div className="expense-form__grid">
        {/* Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={`form-input ${touched.title && errors.title ? 'form-input--error' : ''}`}
            placeholder="e.g. Lunch at café"
            value={form.title}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="off"
          />
          {touched.title && errors.title && (
            <span className="form-error">{errors.title}</span>
          )}
        </div>

        {/* Amount */}
        <div className="form-group">
          <label className="form-label" htmlFor="amount">
            Amount (₹)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            className={`form-input ${touched.amount && errors.amount ? 'form-input--error' : ''}`}
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.amount && errors.amount && (
            <span className="form-error">{errors.amount}</span>
          )}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            className={`form-input form-select ${touched.category && errors.category ? 'form-input--error' : ''}`}
            value={form.category}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {touched.category && errors.category && (
            <span className="form-error">{errors.category}</span>
          )}
        </div>

        {/* Date */}
        <div className="form-group">
          <label className="form-label" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            className={`form-input ${touched.date && errors.date ? 'form-input--error' : ''}`}
            value={form.date}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.date && errors.date && (
            <span className="form-error">{errors.date}</span>
          )}
        </div>

        {/* Note */}
        <div className="form-group form-group--full">
          <label className="form-label" htmlFor="note">
            Note <span className="form-label__optional">(optional)</span>
          </label>
          <textarea
            id="note"
            name="note"
            className="form-input form-textarea"
            placeholder="Any additional details…"
            rows="3"
            value={form.note}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="expense-form__actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? (
            <span className="btn__loading">
              <span className="spinner spinner--sm"></span>
              Saving…
            </span>
          ) : isEdit ? (
            '✏️ Update Expense'
          ) : (
            '+ Add Expense'
          )}
        </button>
      </div>
    </form>
  );
}
