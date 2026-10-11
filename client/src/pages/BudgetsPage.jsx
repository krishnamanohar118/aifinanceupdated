import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Wallet,
} from "lucide-react";
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
  const [busy, setBusy] = useState(false);

  const now = new Date();
  const currentMonthLabel = now.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const load = async () => {
    try {
      setError("");
      const response = await api.get("/api/budgets");
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
      setBusy(true);
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
    } finally {
      setBusy(false);
    }
  };

  const del = async (id, category) => {
    if (!window.confirm(`Delete the budget allocation for "${category}"?`)) {
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
    return error ? <ErrorState message={error} /> : <Loading label="Loading spending guardrails…" />;
  }

  const totalBudget = items.reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
  const totalSpent = items.reduce((acc, x) => acc + (Number(x.spent) || 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

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
          <span>New Budget Limit</span>
        </button>
      </PageHeader>

      {/* Month Indicator & Aggregate Progress Banner */}
      <div className="card budget-month-banner">
        <div className="budget-banner-left">
          <div className="month-chip">
            <Calendar size={15} />
            <span>Active Accounting Cycle: <b>{currentMonthLabel}</b></span>
          </div>
          <div className="budget-aggregate-stats">
            <div className="stat-unit">
              <span className="unit-label">Total Allocated</span>
              <strong className="unit-value"><Money value={totalBudget} /></strong>
            </div>
            <div className="stat-divider" />
            <div className="stat-unit">
              <span className="unit-label">Current Disbursed</span>
              <strong className="unit-value expense"><Money value={totalSpent} /></strong>
            </div>
            <div className="stat-divider" />
            <div className="stat-unit">
              <span className="unit-label">Net Unallocated</span>
              <strong className={`unit-value ${totalRemaining >= 0 ? "income" : "expense"}`}>
                <Money value={totalRemaining} />
              </strong>
            </div>
          </div>
        </div>

        <div className="budget-banner-right">
          <div className="budget-overall-badge">
            <span className="overall-pct">{overallPercentage}%</span>
            <span className="overall-label">Cap Utilized</span>
          </div>
        </div>
      </div>

      {error && <div className="form-error" style={{ marginBottom: "20px" }}>{error}</div>}

      {!items.length ? (
        <EmptyState message="No budget limits defined yet. Set spending limits by category to avoid overspending." />
      ) : (
        <div className="budget-cards-grid">
          {items.map((x) => {
            const percentage = Number(x.percentage) || 0;
            const spent = Number(x.spent) || 0;
            const amount = Number(x.amount) || 0;
            const remaining = Number(x.remaining) || 0;
            const isExceeded = percentage >= 100;
            const isWarning = percentage >= 80 && !isExceeded;

            const statusClass = isExceeded ? "exceeded" : isWarning ? "warning" : "healthy";

            return (
              <article className={`card budget-card-item ${statusClass}`} key={x._id}>
                <div className="budget-card-header">
                  <div className="category-meta-group">
                    <div className={`budget-category-icon ${statusClass}`}>
                      {isExceeded ? (
                        <ShieldAlert size={18} />
                      ) : isWarning ? (
                        <AlertTriangle size={18} />
                      ) : (
                        <ShieldCheck size={18} />
                      )}
                    </div>
                    <div>
                      <h3 className="budget-category-name">{x.category}</h3>
                      <span className="budget-limit-sub">
                        Limit: <Money value={amount} />
                      </span>
                    </div>
                  </div>

                  <div className="budget-actions-wrapper">
                    <span className={`progress-pill-badge ${statusClass}`}>
                      {percentage}%
                    </span>
                    <button
                      type="button"
                      className="icon-button danger budget-del-btn"
                      onClick={() => del(x._id, x.category)}
                      aria-label={`Delete ${x.category} budget`}
                      title={`Delete ${x.category} budget`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="budget-bar-wrapper">
                  <div className="progress progress-budget">
                    <i
                      className={`progress-fill ${statusClass}`}
                      style={{
                        width: `${Math.min(100, Math.max(0, percentage))}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="budget-card-footer">
                  <div className="budget-spent-group">
                    <span className="footer-label">Expended</span>
                    <strong className="footer-val"><Money value={spent} /></strong>
                  </div>

                  <div className="budget-remaining-group">
                    <span className="footer-label">
                      {remaining < 0 ? "Deficit" : "Remaining Buffer"}
                    </span>
                    <strong className={`footer-val ${remaining < 0 ? "expense" : "income"}`}>
                      {remaining < 0 ? "−" : ""}
                      <Money value={Math.abs(remaining)} />
                    </strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {show && (
        <Modal title="Set Category Budget Limit" onClose={() => setShow(false)}>
          <form onSubmit={add} className="budget-form">
            <div className="form-grid">
              <label className="wide">
                <span className="form-label-text">Category</span>
                <select name="category" required defaultValue={expenseCategories[0]}>
                  {expenseCategories.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </label>

              <label className="wide">
                <span className="form-label-text">Monthly Spending Limit</span>
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
                disabled={busy}
              >
                Cancel
              </button>
              <button type="submit" className="button button-primary" disabled={busy}>
                {busy ? "Saving Limit…" : "Save Budget"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
