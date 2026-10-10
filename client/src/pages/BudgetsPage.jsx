import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Plus, Trash2 } from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Money from "../components/Money";
import Modal from "../components/Modal";
import { EmptyState, ErrorState, Loading } from "../components/States";
import { expenseCategories } from "../utils/finance";

export default function BudgetsPage() {
  const [items, setItems] = useState(null);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const now = new Date();
  const currentMonthLabel = now.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const load = async () => {
    try {
      setError("");
      const response = await api.get("/budgets");
      setItems(response.data.items || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load budgets.",
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form);

    try {
      setError("");
      await api.post("/budgets", data);
      setShow(false);
      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create budget.",
      );
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this budget limit?")) {
      return;
    }

    try {
      setError("");
      await api.delete(`/budgets/${id}`);
      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete budget.",
      );
    }
  };

  if (items === null) {
    return error ? <ErrorState message={error} /> : <Loading />;
  }

  return (
    <>
      <PageHeader
        title="Category Budgets"
        description={`Active spending limits and guardrails for ${currentMonthLabel}.`}
      >
        <button
          className="button button-primary"
          onClick={() => setShow(true)}
          type="button"
        >
          <Plus size={16} />
          <span>New Budget</span>
        </button>
      </PageHeader>

      {error && <div className="form-error" style={{ marginBottom: "16px" }}>{error}</div>}

      {!items.length ? (
        <EmptyState message="No budget limits defined yet. Set spending limits by category to avoid overspending." />
      ) : (
        <div className="stack">
          {items.map((x) => {
            const percentage = Number(x.percentage) || 0;
            const spent = Number(x.spent) || 0;
            const amount = Number(x.amount) || 0;
            const remaining = Number(x.remaining) || 0;
            const isExceeded = percentage >= 100;
            const isWarning = percentage >= 80 && !isExceeded;

            const statusColor = isExceeded
              ? "var(--expense)"
              : isWarning
              ? "var(--warning)"
              : "var(--income)";

            const statusBg = isExceeded
              ? "var(--expense-soft)"
              : isWarning
              ? "var(--warning-soft)"
              : "var(--income-soft)";

            return (
              <article className="card budget" key={x._id}>
                <div>
                  <h2 style={{ fontSize: "1.08rem", fontWeight: 700, margin: "0 0 4px" }}>
                    {x.category}
                  </h2>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--ink-secondary)" }}>
                    <Money value={spent} /> spent of <Money value={amount} /> limit
                  </p>
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: statusBg,
                    color: statusColor,
                    fontSize: "0.82rem",
                    fontWeight: 700,
                  }}
                >
                  {isExceeded ? (
                    <AlertTriangle size={14} />
                  ) : (
                    <CheckCircle size={14} />
                  )}
                  <span>{percentage}%</span>
                </div>

                <div className="progress">
                  <i
                    style={{
                      width: `${Math.min(100, Math.max(0, percentage))}%`,
                      background: statusColor,
                    }}
                  />
                </div>

                <div>
                  {remaining < 0 ? (
                    <span
                      style={{
                        color: "var(--expense)",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                      }}
                    >
                      Exceeded by <Money value={Math.abs(remaining)} />
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "var(--ink-secondary)",
                        fontWeight: 500,
                        fontSize: "0.85rem",
                      }}
                    >
                      <Money value={remaining} /> remaining
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="icon-button danger"
                  onClick={() => del(x._id)}
                  aria-label={`Delete ${x.category} budget`}
                  title={`Delete ${x.category} budget`}
                >
                  <Trash2 size={15} />
                </button>
              </article>
            );
          })}
        </div>
      )}

      {show && (
        <Modal title="Set Budget Limit" onClose={() => setShow(false)}>
          <form onSubmit={add}>
            <div className="form-grid">
              <label className="wide">
                Category
                <select name="category" required>
                  {expenseCategories.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </label>

              <label className="wide">
                Monthly Spending Limit
                <input
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  placeholder="e.g. 5000"
                  autoFocus
                />
              </label>
            </div>

            <input type="hidden" name="month" value={now.getMonth() + 1} />
            <input type="hidden" name="year" value={now.getFullYear()} />

            <div className="modal-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setShow(false)}
              >
                Cancel
              </button>
              <button type="submit" className="button button-primary">
                Save Budget
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
