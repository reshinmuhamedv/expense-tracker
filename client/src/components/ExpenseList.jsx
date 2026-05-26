import ExpenseItem from './ExpenseItem';
import EmptyState from './EmptyState';

function SkeletonRow() {
  return (
    <tr className="skeleton-row">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i}>
          <div className="skeleton-block" />
        </td>
      ))}
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="expense-card glass-card skeleton-card">
      <div className="skeleton-block skeleton-block--badge" />
      <div className="skeleton-block skeleton-block--title" />
      <div className="skeleton-block skeleton-block--line" />
    </div>
  );
}

export default function ExpenseList({ expenses, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="expense-list">
        {/* Desktop skeleton */}
        <table className="expense-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>

        {/* Mobile skeleton */}
        <div className="expense-cards-skeleton">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <EmptyState
        icon="💸"
        message="No expenses found. Start tracking your spending!"
      />
    );
  }

  return (
    <div className="expense-list">
      {/* Desktop table */}
      <table className="expense-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp, idx) => (
            <ExpenseItem
              key={exp.id || idx}
              expense={exp}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="expense-cards">
        {expenses.map((exp, idx) => (
          <ExpenseItem
            key={exp.id || idx}
            expense={exp}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
