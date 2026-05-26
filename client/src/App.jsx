import { useState, useEffect, useCallback } from 'react';
import * as api from './api/expenses';
import MonthlySummary from './components/MonthlySummary';
import FilterBar from './components/FilterBar';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Modal from './components/Modal';
import Toast from './components/Toast';

function getCurrentYearMonth() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

let toastIdCounter = 0;

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total: 0, breakdown: [] });
  const [filters, setFilters] = useState({
    category: '',
    dateFrom: '',
    dateTo: '',
    title: '',
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [toasts, setToasts] = useState([]);

  const { year, month } = getCurrentYearMonth();

  const addToast = useCallback((message, type = 'info') => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch expenses
  const fetchExpenses = useCallback(async (currentFilters) => {
    setLoading(true);
    try {
      const result = await api.getExpenses(currentFilters);
      const data = Array.isArray(result) ? result : result?.data ?? [];
      setExpenses(data);
    } catch (err) {
      addToast(err.message || 'Failed to fetch expenses', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Fetch monthly summary
  const fetchSummary = useCallback(async () => {
    try {
      const result = await api.getMonthlySummary(year, month);
      const data = result?.data ?? result ?? { total: 0, breakdown: [] };
      setSummary(data);
    } catch {
      // silently fail – summary is non-critical
    }
  }, [year, month]);

  // Initial load
  useEffect(() => {
    fetchExpenses(filters);
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    fetchExpenses(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Filter change handler
  const handleFilterChange = useCallback((patch) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      // Auto-swap date range if from > to
      if (next.dateFrom && next.dateTo && next.dateFrom > next.dateTo) {
        const temp = next.dateFrom;
        next.dateFrom = next.dateTo;
        next.dateTo = temp;
      }
      return next;
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ category: '', dateFrom: '', dateTo: '', title: '' });
  }, []);

  // CRUD handlers
  const handleAdd = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingExpense) {
        await api.updateExpense(editingExpense.id, data);
        addToast('Expense updated successfully!', 'success');
      } else {
        await api.createExpense(data);
        addToast('Expense added successfully!', 'success');
      }
      handleCloseForm();
      fetchExpenses(filters);
      fetchSummary();
    } catch (err) {
      addToast(err.message || 'Something went wrong', 'error');
      throw err; // let form know submission failed
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteExpense(id);
      addToast('Expense deleted', 'success');
      fetchExpenses(filters);
      fetchSummary();
    } catch (err) {
      addToast(err.message || 'Failed to delete expense', 'error');
    }
  };

  return (
    <div className="app">
      {/* Toast container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <h1 className="app-header__title gradient-text">Expense Tracker</h1>
            <p className="app-header__subtitle">Manage your finances with clarity</p>
          </div>
          <button className="btn btn--primary btn--glow" onClick={handleAdd}>
            <span className="btn__icon">+</span>
            Add Expense
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="app-main">
        <div className="app-layout">
          {/* Sidebar: Summary */}
          <aside className="app-sidebar">
            <MonthlySummary summary={summary} year={year} month={month} />
          </aside>

          {/* Main area: Filters + List */}
          <section className="app-content">
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
            />
            <ExpenseList
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          </section>
        </div>
      </main>

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
      >
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
        />
      </Modal>
    </div>
  );
}
