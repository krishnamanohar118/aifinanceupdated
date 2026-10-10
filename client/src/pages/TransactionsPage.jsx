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
      title={item ? "Edit Transaction" : "New Transaction"}
      onClose={onClose}
    >
      <form onSubmit={submit}>
        {/* Type Toggle Tabs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginBottom: "18px",
            padding: "4px",
            backgroundColor: "var(--surface-subtle)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)",
          }}
        >
          <button
            type="button"
            onClick={() => set("type", "Expense")}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.85rem",
              backgroundColor:
                form.type === "Expense" ? "var(--surface)" : "transparent",
              color:
                form.type === "Expense" ? "var(--expense)" : "var(--ink-secondary)",
              boxShadow:
                form.type === "Expense" ? "var(--shadow-xs)" : "none",
              border: form.type === "Expense" ? "1px solid var(--border)" : "1px solid transparent",
              transition: "all 0.15s ease",
            }}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => set("type", "Income")}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.85rem",
              backgroundColor:
                form.type === "Income" ? "var(--surface)" : "transparent",
              color:
                form.type === "Income" ? "var(--income)" : "var(--ink-secondary)",
              boxShadow:
                form.type === "Income" ? "var(--shadow-xs)" : "none",
              border: form.type === "Income" ? "1px solid var(--border)" : "1px solid transparent",
              transition: "all 0.15s ease",
            }}
          >
            Income
          </button>
        </div>

        <div className="form-grid">
          <label>
            Amount
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              autoFocus
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
              placeholder="0.00"
            />
          </label>

          <label>
            Date
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </label>

          <label>
            Category
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
            Payment Method
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
            Description
            <input
              required
              maxLength="140"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="e.g. Grocery shopping, Client invoice, Dinner"
            />
          </label>

          <label className="wide">
            Notes (Optional)
            <input
              value={form.notes || ""}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Add any extra details or reference IDs"
            />
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}

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
            {busy ? "Saving…" : item ? "Update Transaction" : "Save Transaction"}
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
        title="Transactions"
        description="Comprehensive audit of all financial inflows and outflows."
      >
        <button className="button button-primary" onClick={openAdd} type="button">
          <Plus size={16} />
          <span>New Transaction</span>
        </button>
      </PageHeader>

      {/* Summary KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div className="card" style={{ padding: "16px 20px" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ink-muted)", textTransform: "uppercase" }}>
            Total Inflow
          </span>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--income)", marginTop: "4px" }}>
            +<Money value={summary.income} />
          </div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ink-muted)", textTransform: "uppercase" }}>
            Total Outflow
          </span>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--ink)", marginTop: "4px" }}>
            −<Money value={summary.expenses} />
          </div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ink-muted)", textTransform: "uppercase" }}>
            Net Cashflow
          </span>
          <div
            style={{
              fontSize: "1.45rem",
              fontWeight: 800,
              color: summary.balance >= 0 ? "var(--brand)" : "var(--expense)",
              marginTop: "4px",
            }}
          >
            <Money value={summary.balance} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filters">
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--ink-muted)",
            }}
          />
          <input
            style={{ paddingLeft: "36px", width: "100%" }}
            placeholder="Search description or category…"
            value={filters.search}
            onChange={(e) =>
              setFilters((current) => ({
                ...current,
                search: e.target.value,
              }))
            }
          />
        </div>

        <select
          value={filters.type}
          onChange={(e) =>
            setFilters((current) => ({
              ...current,
              type: e.target.value,
            }))
          }
        >
          <option value="">All Types</option>
          <option value="Income">Income only</option>
          <option value="Expense">Expense only</option>
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
            className="button button-secondary"
            onClick={clearFilters}
            style={{ height: "40px", padding: "0 12px", fontSize: "0.82rem" }}
          >
            <X size={14} /> Clear filters
          </button>
        )}
      </div>

      {error && data && <div className="form-error" style={{ marginBottom: "16px" }}>{error}</div>}

      {!items.length ? (
        <EmptyState
          message={
            hasActiveFilters
              ? "No transactions match your search filters."
              : "No transactions recorded yet. Click 'New Transaction' to begin."
          }
        />
      ) : (
        <div className="card transaction-list">
          {items.map((item) => {
            const isIncome = item.type === "Income";

            return (
              <article className="transaction" key={item._id}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "8px",
                      backgroundColor: isIncome
                        ? "var(--income-soft)"
                        : "var(--surface-subtle)",
                      color: isIncome ? "var(--income)" : "var(--ink-secondary)",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isIncome ? (
                      <ArrowDownLeft size={18} />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                  </div>

                  <div>
                    <b>{item.description}</b>
                    <small>
                      {formatDate(item.date)} ·{" "}
                      <span
                        style={{
                          backgroundColor: "var(--surface-subtle)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontWeight: 500,
                        }}
                      >
                        {item.category}
                      </span>{" "}
                      · {item.paymentMethod}
                      {item.notes ? ` · "${item.notes}"` : ""}
                    </small>
                  </div>
                </div>

                <span
                  className={`amount ${isIncome ? "income" : "expense"}`}
                >
                  {isIncome ? "+" : "−"}
                  <Money value={item.amount} />
                </span>

                <div className="row-actions">
                  <button
                    className="icon-button"
                    onClick={() => openEdit(item)}
                    aria-label="Edit transaction"
                    title="Edit transaction"
                    type="button"
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    className="icon-button danger"
                    onClick={() => deleteItem(item._id)}
                    aria-label="Delete transaction"
                    title="Delete transaction"
                    type="button"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            );
          })}
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
