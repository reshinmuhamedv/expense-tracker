import { useState, useCallback, useRef, useEffect } from 'react';
import { debounce } from '../utils/helpers';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

export default function FilterBar({ filters, onFilterChange, onClear }) {
  const [searchValue, setSearchValue] = useState(filters.title || '');
  const debouncedRef = useRef(null);

  useEffect(() => {
    debouncedRef.current = debounce((val) => {
      onFilterChange({ title: val });
    }, 300);
  }, [onFilterChange]);

  const handleSearchChange = useCallback(
    (e) => {
      const val = e.target.value;
      setSearchValue(val);
      debouncedRef.current?.(val);
    },
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const hasActiveFilters =
    filters.category || filters.dateFrom || filters.dateTo || filters.title;

  const handleClear = () => {
    setSearchValue('');
    onClear();
  };

  return (
    <div className="filter-bar glass-card">
      <div className="filter-bar__group">
        <label className="filter-bar__label" htmlFor="filter-search">
          🔍
        </label>
        <input
          id="filter-search"
          type="text"
          className="form-input filter-bar__input"
          placeholder="Search expenses…"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      <div className="filter-bar__group">
        <select
          name="category"
          className="form-input form-select filter-bar__select"
          value={filters.category || ''}
          onChange={handleChange}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-bar__group">
        <label className="filter-bar__date-label" htmlFor="filter-from">
          From
        </label>
        <input
          id="filter-from"
          name="dateFrom"
          type="date"
          className="form-input filter-bar__date"
          value={filters.dateFrom || ''}
          onChange={handleChange}
        />
      </div>

      <div className="filter-bar__group">
        <label className="filter-bar__date-label" htmlFor="filter-to">
          To
        </label>
        <input
          id="filter-to"
          name="dateTo"
          type="date"
          className="form-input filter-bar__date"
          value={filters.dateTo || ''}
          onChange={handleChange}
        />
      </div>

      {hasActiveFilters && (
        <button className="btn btn--secondary btn--sm filter-bar__clear" onClick={handleClear}>
          ✕ Clear
        </button>
      )}
    </div>
  );
}
