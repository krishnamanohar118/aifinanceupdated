import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Edit3,
  Filter,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import Money from "../components/Money";
import { EmptyState, ErrorState, Loading } from "../components/States";
import {
  expenseCategories,
  formatDate,
  incomeCategories,
  methods,
} from "../utils/finance";

const blank = {
  type: "Expense",
  amount: "",
  category: "Food",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: "UPI",
  notes: "",
};

function TransactionForm({ item, onClose, onSaved }) {
  const [form, setForm] = useState(
    item
      ? {
          ...item,
          date: item.date
            ? new Date(item.date).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        }
      : { ...blank },
  );

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const categories =
    form.type === "Income" ? incomeCategories : expenseCategories;

  const set = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "type"
        ? {
            category:
              value === "Income"
                ? incomeCategories[0] || "Salary"
                : expenseCategories[0] || "Food",
          }
        : {}),
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (busy) return;

    setBusy(true);
    setError("");

    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      if (item) {
        await api.put(`/transactions/${item._id}`, payload);
      } else {
        await api.post("/transactions", payload);
      }

      onSaved();
    } catch (err) {
      console.error("Transaction save failed:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save transaction.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={item ? "Edit Transaction Record" : "Create New Transaction"}
      onClose={onClose}
    >
      <form onSubmit={submit} className="transaction-form">
        {/* Type Toggle Tabs */}
        <div className="segmented-type-toggle">
          <button
            type="button"
            className={`type-segment-btn expense ${form.type === "Expense" ? "active" : ""}`}
            onClick={() => set("type", "Expense")}
          >
            <ArrowUpRight size={16} />
            <span>Expense (Outflow)</span>
          </button>
          <button
            type="button"
            className={`type-segment-btn income ${form.type === "Income" ? "active" : ""}`}
            onClick={() => set("type", "Income")}
          >
            <ArrowDownLeft size={16} />
            <span>Income (Inflow)</span>
          </button>
        </div>

        <div className="form-grid">
          <label>
            <span className="form-label-text">Amount</span>
            <div className="input-with-affix">
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                autoFocus
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder="0.00"
                className="input-amount"
              />
            </div>
          </label>

          <label>
            <span className="form-label-text">Transaction Date</span>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </label>

          <label>
            <span className="form-label-text">Category Classification</span>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="form-label-text">Payment Channel</span>
            <select
              value={form.paymentMethod}
              onChange={(e) => set("paymentMethod", e.target.value)}
            >
              {methods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </label>

          <label className="wide">
            <span className="form-label-text">Description / Payee</span>
            <input
              required
              maxLength="140"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="e.g. AWS Cloud Services, Grocery Supermarket, Client Invoice"
            />
          </label>

          <label className="wide">
            <span className="form-label-text">Audit Notes & Memo (Optional)</span>
            <input
              value={form.notes || ""}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Add reference numbers, tax code, or reconciliation details"
            />
          </label>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="modal-actions">
          <button
            type="button"
            className="button button-secondary"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="button button-primary"
            disabled={busy}
          >
            {busy ? "Saving Entry…" : item ? "Update Record" : "Save Transaction"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function TransactionsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
  });

  const load = async () => {
    try {
      setError("");

      const response = await api.get("/transactions", {
        params: filters,
      });

      setData(response.data);
    } catch (err) {
      console.error("Failed to load transactions:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load transactions.",
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [filters.search, filters.type, filters.category]);

  const deleteItem = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction? This cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setError("");
      await api.delete(`/transactions/${id}`);
      await load();
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete transaction.",
      );
    }
  };

  const openAdd = () => {
    setEdit(null);
    setShow(true);
  };

  const openEdit = (item) => {
    setEdit(item);
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
    setEdit(null);
  };

  const handleSaved = async () => {
    closeModal();
    await load();
  };

  const clearFilters = () => {
    setFilters({ search: "", type: "", category: "" });
  };

  if (!data && !error) {
    return <Loading />;
  }

  if (error && !data) {
    return <ErrorState message={error} />;
  }

  const summary = data?.summary || {
    income: 0,
    expenses: 0,
    balance: 0,
  };

  const items = Array.isArray(data?.items) ? data.items : [];
  const hasActiveFilters = Boolean(
    filters.search || filters.type || filters.category,
  );

  return (
    <>
      <PageHeader
        title="Transaction Ledger"
        description="Audited double-entry record of all capital inflows, expenditures, and transfers."
      >
        <button className="button button-primary" onClick={openAdd} type="button">
          <Plus size={16} />
          <span>New Transaction</span>
        </button>
      </PageHeader>

      {/* Summary KPI Ribbon */}
      <div className="ledger-kpi-grid">
        <div className="card ledger-kpi-card">
          <div className="ledger-kpi-header">
            <span className="ledger-kpi-label">Total Inflow</span>
            <div className="kpi-mini-icon income">
              <ArrowDownLeft size={14} />
            </div>
          </div>
          <div className="ledger-kpi-value income">
            +<Money value={summary.income} />
          </div>
          <span className="ledger-kpi-sub">Total credited funds</span>
        </div>

        <div className="card ledger-kpi-card">
          <div className="ledger-kpi-header">
            <span className="ledger-kpi-label">Total Outflow</span>
            <div className="kpi-mini-icon expense">
              <ArrowUpRight size={14} />
            </div>
          </div>
          <div className="ledger-kpi-value expense">
            −<Money value={summary.expenses} />
          </div>
          <span className="ledger-kpi-sub">Total debited expenses</span>
        </div>

        <div className="card ledger-kpi-card">
          <div className="ledger-kpi-header">
            <span className="ledger-kpi-label">Net Operating Cashflow</span>
            <div className="kpi-mini-icon brand">
              <Filter size={14} />
            </div>
          </div>
          <div
            className={`ledger-kpi-value ${
              summary.balance >= 0 ? "brand" : "expense"
            }`}
          >
            <Money value={summary.balance} />
          </div>
          <span className="ledger-kpi-sub">
            {summary.balance >= 0 ? "Positive cash surplus" : "Net operating deficit"}
          </span>
        </div>

        <div className="card ledger-kpi-card">
          <div className="ledger-kpi-header">
            <span className="ledger-kpi-label">Total Records</span>
            <span className="count-pill">{items.length}</span>
          </div>
          <div className="ledger-kpi-value">
            {items.length} <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--ink-muted)" }}>entries</span>
          </div>
          <span className="ledger-kpi-sub">
            {hasActiveFilters ? "Filtered results subset" : "Complete timeline set"}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="ledger-filters-bar">
        <div className="search-field-wrapper">
          <Search size={16} className="search-icon" />
          <input
            className="search-input"
            placeholder="Search description, payee, category, or note…"
            value={filters.search}
            onChange={(e) =>
              setFilters((current) => ({
                ...current,
                search: e.target.value,
              }))
            }
          />
          {filters.search && (
            <button
              className="search-clear-btn"
              onClick={() => setFilters((c) => ({ ...c, search: "" }))}
              type="button"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-selects-group">
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters((current) => ({
                ...current,
                type: e.target.value,
              }))
            }
          >
            <option value="">All Flow Types</option>
            <option value="Income">Income (Inflow)</option>
            <option value="Expense">Expense (Outflow)</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((current) => ({
                ...current,
                category: e.target.value,
              }))
            }
          >
            <option value="">All Categories</option>
            {[...incomeCategories, ...expenseCategories]
              .filter((category, index, array) => array.indexOf(category) === index)
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              className="button button-secondary clear-filters-btn"
              onClick={clearFilters}
            >
              <X size={14} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {error && data && <div className="form-error" style={{ marginBottom: "16px" }}>{error}</div>}

      {!items.length ? (
        <EmptyState
          message={
            hasActiveFilters
              ? "No transactions match your current search filters. Try adjusting the query."
              : "No transactions recorded yet in this workspace. Click 'New Transaction' to begin."
          }
        />
      ) : (
        <div className="card table-container">
          <table className="dense-financial-table">
            <thead>
              <tr>
                <th style={{ width: "110px" }}>Date</th>
                <th>Description / Payee</th>
                <th style={{ width: "140px" }}>Category</th>
                <th style={{ width: "120px" }}>Method</th>
                <th style={{ width: "100px" }}>Type</th>
                <th style={{ width: "130px", textAlign: "right" }}>Amount</th>
                <th style={{ width: "80px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isIncome = item.type === "Income";

                return (
                  <tr key={item._id} className="table-row">
                    <td className="table-date-cell">
                      {formatDate(item.date)}
                    </td>
                    <td className="table-desc-cell">
                      <div className="desc-text">{item.description}</div>
                      {item.notes && (
                        <div className="notes-memo">“{item.notes}”</div>
                      )}
                    </td>
                    <td>
                      <span className="category-pill-tag">
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <span className="method-pill-tag">
                        {item.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <span className={`flow-badge ${isIncome ? "income" : "expense"}`}>
                        {isIncome ? "Inflow" : "Outflow"}
                      </span>
                    </td>
                    <td className="table-amount-cell">
                      <span className={`tabular-amount ${isIncome ? "income" : "expense"}`}>
                        {isIncome ? "+" : "−"}
                        <Money value={item.amount} />
                      </span>
                    </td>
                    <td className="table-actions-cell">
                      <div className="row-actions-group">
                        <button
                          className="action-icon-btn edit"
                          onClick={() => openEdit(item)}
                          aria-label="Edit transaction"
                          title="Edit transaction"
                          type="button"
                        >
                          <Edit3 size={14} />
                        </button>

                        <button
                          className="action-icon-btn delete"
                          onClick={() => deleteItem(item._id)}
                          aria-label="Delete transaction"
                          title="Delete transaction"
                          type="button"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {show && (
        <TransactionForm
          item={edit}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
