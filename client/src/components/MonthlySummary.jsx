import { useEffect, useState } from 'react';
import { formatCurrency, getCategoryColor, getCategoryEmoji } from '../utils/helpers';

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function MonthlySummary({ summary, year, month }) {
  const [animatedBars, setAnimatedBars] = useState(false);

  useEffect(() => {
    setAnimatedBars(false);
    const timer = setTimeout(() => setAnimatedBars(true), 100);
    return () => clearTimeout(timer);
  }, [summary]);

  const total = summary?.total ?? 0;
  const breakdown = summary?.breakdown ?? [];
  const monthName = MONTH_NAMES[month] || '';

  return (
    <div className="monthly-summary glass-card">
      <div className="monthly-summary__header">
        <span className="monthly-summary__label">
          {monthName} {year}
        </span>
        <span className="monthly-summary__sublabel">Monthly Overview</span>
      </div>

      <div className="monthly-summary__total">
        <span className="monthly-summary__total-label">Total Spent</span>
        <span className="monthly-summary__total-amount gradient-text">
          {formatCurrency(total)}
        </span>
      </div>

      {total === 0 ? (
        <div className="monthly-summary__empty">
          <span className="monthly-summary__empty-icon">🌟</span>
          <p>No expenses this month — great start!</p>
        </div>
      ) : (
        <div className="monthly-summary__breakdown">
          <h4 className="monthly-summary__section-title">By Category</h4>
          {breakdown.map((item) => {
            const color = getCategoryColor(item.category);
            const emoji = getCategoryEmoji(item.category);
            const pct = total > 0 ? (item.total / total) * 100 : 0;

            return (
              <div className="breakdown-item" key={item.category}>
                <div className="breakdown-item__header">
                  <span className="breakdown-item__label">
                    <span className="breakdown-item__emoji">{emoji}</span>
                    {item.category}
                  </span>
                  <span className="breakdown-item__amount">
                    {formatCurrency(item.total)}
                  </span>
                </div>
                <div className="breakdown-item__bar-bg">
                  <div
                    className="breakdown-item__bar-fill"
                    style={{
                      width: animatedBars ? `${pct}%` : '0%',
                      backgroundColor: color,
                      boxShadow: `0 0 12px ${color}60`,
                    }}
                  />
                </div>
                <span className="breakdown-item__pct">{pct.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
