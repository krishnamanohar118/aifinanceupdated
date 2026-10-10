import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  PiggyBank,
  Plus,
  Trash2,
} from "lucide-react";

import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Money from "../components/Money";
import Modal from "../components/Modal";
import { EmptyState, ErrorState, Loading } from "../components/States";
import { formatDate } from "../utils/finance";

export default function GoalsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/goals");
      setItems(response.data?.items || []);
    } catch (err) {
      console.error("Goals load error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load savings goals.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();

    try {
      setError("");
      const data = Object.fromEntries(new FormData(e.target));
      await api.post("/goals", data);
      setShow(false);
      await load();
    } catch (err) {
      console.error("Create goal error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create goal.",
      );
    }
  };

  const addSavings = async (goal) => {
    const amount = window.prompt(`How much would you like to deposit into "${goal.name}"?`);

    if (!amount || Number(amount) <= 0) {
      return;
    }

    try {
      setError("");
      await api.put(`/goals/${goal._id}`, {
        currentAmount: Number(goal.currentAmount || 0) + Number(amount),
      });
      await load();
    } catch (err) {
      console.error("Add savings error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to add savings.",
      );
    }
  };

  const deleteGoal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this savings goal?")) {
      return;
    }

    try {
      setError("");
      await api.delete(`/goals/${id}`);
      await load();
    } catch (err) {
      console.error("Delete goal error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete goal.",
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !items.length) {
    return <ErrorState message={error} />;
  }

  return (
    <>
      <PageHeader
        title="Savings Goals"
        description="Targeted capital accumulation milestones with automated monthly pace tracking."
      >
        <button
          type="button"
          className="button button-primary"
          onClick={() => setShow(true)}
        >
          <Plus size={16} />
          <span>New Goal</span>
        </button>
      </PageHeader>

      {error && <div className="form-error" style={{ marginBottom: "16px" }}>{error}</div>}

      {!items.length ? (
        <EmptyState message="No savings goals established yet. Create your first goal to track progress toward major financial milestones." />
      ) : (
        <div className="goal-grid">
          {items.map((goal) => {
            const progress = Math.max(
              0,
              Math.min(100, Number(goal.progress) || 0),
            );
            const isCompleted = progress >= 100;

            return (
              <article className="card goal" key={goal._id}>
                <button
                  type="button"
                  className="icon-button danger float"
                  onClick={() => deleteGoal(goal._id)}
                  aria-label={`Delete ${goal.name}`}
                  title={`Delete ${goal.name}`}
                >
                  <Trash2 size={15} />
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingRight: "40px" }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "8px",
                      backgroundColor: isCompleted ? "var(--income-soft)" : "var(--brand-tint)",
                      color: isCompleted ? "var(--income)" : "var(--brand)",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={18} /> : <PiggyBank size={18} />}
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1.1rem", margin: 0 }}>{goal.name}</h2>
                    {goal.targetDate && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: "0.75rem",
                          color: "var(--ink-muted)",
                          marginTop: "2px",
                        }}
                      >
                        <Calendar size={12} /> Target: {formatDate(goal.targetDate)}
                      </span>
                    )}
                  </div>
                </div>

                {goal.description && (
                  <p style={{ fontSize: "0.82rem", color: "var(--ink-secondary)", margin: "4px 0 0" }}>
                    {goal.description}
                  </p>
                )}

                <div style={{ marginTop: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--ink-muted)" }}>Accumulated</span>
                    <b style={{ color: "var(--ink)", fontSize: "0.95rem" }}>
                      {progress}%
                    </b>
                  </div>
                  <div className="progress">
                    <i
                      style={{
                        width: `${progress}%`,
                        background: isCompleted
                          ? "var(--income)"
                          : "linear-gradient(90deg, var(--brand), var(--brand-light))",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    backgroundColor: "var(--surface-subtle)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                    fontSize: "0.85rem",
                  }}
                >
                  <div>
                    <span style={{ display: "block", fontSize: "0.72rem", color: "var(--ink-muted)", textTransform: "uppercase" }}>
                      Current
                    </span>
                    <strong style={{ color: "var(--ink)" }}>
                      <Money value={Number(goal.currentAmount) || 0} />
                    </strong>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ display: "block", fontSize: "0.72rem", color: "var(--ink-muted)", textTransform: "uppercase" }}>
                      Target
                    </span>
                    <strong style={{ color: "var(--ink)" }}>
                      <Money value={Number(goal.targetAmount) || 0} />
                    </strong>
                  </div>
                </div>

                <small style={{ color: "var(--ink-muted)", display: "block", fontSize: "0.78rem" }}>
                  {isCompleted ? (
                    <span style={{ color: "var(--income)", fontWeight: 600 }}>
                      🎉 Goal accomplished!
                    </span>
                  ) : (
                    <>
                      <Money value={Number(goal.remaining) || 0} /> needed ·{" "}
                      <Money value={Number(goal.requiredMonthlySaving) || 0} /> / month pace
                    </>
                  )}
                </small>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => addSavings(goal)}
                >
                  <Plus size={15} />
                  <span>Deposit Funds</span>
                </button>
              </article>
            );
          })}
        </div>
      )}

      {show && (
        <Modal title="Create Savings Goal" onClose={() => setShow(false)}>
          <form onSubmit={save}>
            <div className="form-grid">
              <label className="wide">
                Goal Name
                <input
                  name="name"
                  required
                  placeholder="e.g. Emergency Fund, Home Downpayment, Vacation"
                  autoFocus
                />
              </label>

              <label>
                Target Amount
                <input
                  name="targetAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  placeholder="0.00"
                />
              </label>

              <label>
                Target Date
                <input name="targetDate" type="date" required />
              </label>

              <label className="wide">
                Initial Deposit Amount
                <input
                  name="currentAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue="0"
                />
              </label>

              <label className="wide">
                Description (Optional)
                <input
                  name="description"
                  placeholder="Why is this milestone important?"
                />
              </label>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setShow(false)}
              >
                Cancel
              </button>

              <button type="submit" className="button button-primary">
                Save Goal
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
