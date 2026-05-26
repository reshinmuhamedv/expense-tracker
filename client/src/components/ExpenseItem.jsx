import { useState } from 'react';
import { formatCurrency, formatDate, getCategoryColor, getCategoryEmoji } from '../utils/helpers';

export default function ExpenseItem({ expense, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const color = getCategoryColor(expense.category);
  const emoji = getCategoryEmoji(expense.category);

  const handleDelete = () => {
    if (confirming) {
      onDelete(expense.id);
      setConfirming(false);
    } else {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
    }
  };

  const truncatedNote =
    expense.note && expense.note.length > 40
      ? expense.note.slice(0, 40) + '…'
      : expense.note || '—';

  return (
    <>
      {/* Desktop table row */}
      <tr className="expense-row">
        <td>
          <span
            className="category-badge"
            style={{
              '--cat-color': color,
              backgroundColor: `${color}18`,
              color: color,
              borderColor: `${color}40`,
            }}
          >
            <span className="category-badge__emoji">{emoji}</span>
            {expense.category}
          </span>
        </td>
        <td className="expense-row__title">{expense.title}</td>
        <td className="expense-row__amount">{formatCurrency(expense.amount)}</td>
        <td className="expense-row__date">{formatDate(expense.date)}</td>
        <td className="expense-row__note" title={expense.note}>
          {truncatedNote}
        </td>
        <td className="expense-row__actions">
          <button
            className="btn-icon"
            onClick={() => onEdit(expense)}
            aria-label="Edit expense"
            title="Edit"
          >
            ✏️
          </button>
          <button
            className={`btn-icon btn-icon--danger ${confirming ? 'btn-icon--confirming' : ''}`}
            onClick={handleDelete}
            aria-label={confirming ? 'Click again to confirm delete' : 'Delete expense'}
            title={confirming ? 'Click again to confirm' : 'Delete'}
          >
            {confirming ? '⚠️' : '🗑️'}
          </button>
        </td>
      </tr>

      {/* Mobile card (rendered via CSS display toggling) */}
      <div className="expense-card glass-card">
        <div className="expense-card__header">
          <span
            className="category-badge"
            style={{
              '--cat-color': color,
              backgroundColor: `${color}18`,
              color: color,
              borderColor: `${color}40`,
            }}
          >
            <span className="category-badge__emoji">{emoji}</span>
            {expense.category}
          </span>
          <span className="expense-card__amount">{formatCurrency(expense.amount)}</span>
        </div>
        <div className="expense-card__body">
          <h4 className="expense-card__title">{expense.title}</h4>
          <p className="expense-card__date">{formatDate(expense.date)}</p>
          {expense.note && <p className="expense-card__note">{expense.note}</p>}
        </div>
        <div className="expense-card__footer">
          <button className="btn btn--secondary btn--sm" onClick={() => onEdit(expense)}>
            ✏️ Edit
          </button>
          <button
            className={`btn btn--sm ${confirming ? 'btn--warning' : 'btn--danger'}`}
            onClick={handleDelete}
          >
            {confirming ? '⚠️ Confirm?' : '🗑️ Delete'}
          </button>
        </div>
      </div>
    </>
  );
}
