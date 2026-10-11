import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  PiggyBank,
  Plus,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
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
  const [depositGoal, setDepositGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositBusy, setDepositBusy] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/api/goals");
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

  const submitDeposit = async (e) => {
    e.preventDefault();
    if (!depositGoal || Number(depositAmount) <= 0) return;

    try {
      setDepositBusy(true);
      setError("");
      await api.put(`/goals/${depositGoal._id}`, {
        currentAmount: Number(depositGoal.currentAmount || 0) + Number(depositAmount),
      });
      setDepositGoal(null);
      setDepositAmount("");
      await load();
    } catch (err) {
      console.error("Add savings error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to deposit savings into goal.",
      );
    } finally {
      setDepositBusy(false);
    }
  };

  const deleteGoal = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the savings goal "${name}"?`)) {
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
    return <Loading label="Calculating savings milestones & velocity…" />;
  }

  if (error && !items.length) {
    return <ErrorState message={error} />;
  }

  const totalTarget = items.reduce((acc, g) => acc + (Number(g.targetAmount) || 0), 0);
  const totalSaved = items.reduce((acc, g) => acc + (Number(g.currentAmount) || 0), 0);
  const totalRemaining = Math.max(0, totalTarget - totalSaved);
  const overallPace = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Savings Goals & Reserves"
        description="Targeted capital accumulation milestones with automated monthly pace calculation."
      >
        <button
          type="button"
          className="button button-primary"
          onClick={() => setShow(true)}
        >
          <Plus size={16} />
          <span>New Savings Goal</span>
        </button>
      </PageHeader>

      {/* Aggregate Milestones Summary Banner */}
      <div className="card goals-summary-banner">
        <div className="goals-banner-col">
          <span className="goals-banner-label">Active Portfolios</span>
          <div className="goals-banner-val">{items.length} <span className="sub-unit">Goals</span></div>
          <span className="goals-banner-sub">Monitored wealth milestones</span>
        </div>

        <div className="goals-banner-divider" />

        <div className="goals-banner-col">
          <span className="goals-banner-label">Total Capital Target</span>
          <div className="goals-banner-val"><Money value={totalTarget} /></div>
          <span className="goals-banner-sub">Target reserve threshold</span>
        </div>

        <div className="goals-banner-divider" />

        <div className="goals-banner-col">
          <span className="goals-banner-label">Current Accumulated</span>
          <div className="goals-banner-val income">+<Money value={totalSaved} /></div>
          <span className="goals-banner-sub">Liquid funds earmarked</span>
        </div>

        <div className="goals-banner-divider" />

        <div className="goals-banner-col">
          <span className="goals-banner-label">Portfolio Completion</span>
          <div className="goals-banner-val brand">{overallPace}%</div>
          <span className="goals-banner-sub">
            <Money value={totalRemaining} /> remaining
          </span>
        </div>
      </div>

      {error && <div className="form-error" style={{ marginBottom: "20px" }}>{error}</div>}

      {!items.length ? (
        <EmptyState message="No savings goals established yet. Create your first milestone to track progress toward major financial goals." />
      ) : (
        <div className="goal-grid-container">
          {items.map((goal) => {
            const progress = Math.max(
              0,
              Math.min(100, Number(goal.progress) || 0),
            );
            const isCompleted = progress >= 100;

            return (
              <article className={`card goal-card-elevated ${isCompleted ? "completed" : ""}`} key={goal._id}>
                <div className="goal-card-top">
                  <div className="goal-title-cluster">
                    <div className={`goal-icon-capsule ${isCompleted ? "completed" : ""}`}>
                      {isCompleted ? <CheckCircle2 size={20} /> : <PiggyBank size={20} />}
                    </div>
                    <div>
                      <h3 className="goal-title-text">{goal.name}</h3>
                      {goal.targetDate && (
                        <div className="goal-deadline-chip">
                          <Calendar size={12} />
                          <span>Target: {formatDate(goal.targetDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="icon-button danger goal-del-btn"
                    onClick={() => deleteGoal(goal._id, goal.name)}
                    aria-label={`Delete ${goal.name}`}
                    title={`Delete ${goal.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {goal.description && (
                  <p className="goal-memo-text">
                    {goal.description}
                  </p>
                )}

                {/* Progress Visual Bar */}
                <div className="goal-progress-section">
                  <div className="goal-progress-header">
                    <span className="goal-progress-label">Milestone Progress</span>
                    <span className={`goal-progress-badge ${isCompleted ? "completed" : ""}`}>
                      {progress}%
                    </span>
                  </div>
                  <div className="progress progress-goal">
                    <i
                      className="progress-fill"
                      style={{
                        width: `${progress}%`,
                        background: isCompleted
                          ? "linear-gradient(90deg, var(--income), #34d399)"
                          : "linear-gradient(90deg, var(--brand), var(--brand-light))",
                      }}
                    />
                  </div>
                </div>

                {/* Financial Values Grid */}
                <div className="goal-metrics-box">
                  <div className="goal-metric-item">
                    <span className="metric-tag">Accumulated</span>
                    <strong className="metric-val income">
                      <Money value={Number(goal.currentAmount) || 0} />
                    </strong>
                  </div>
                  <div className="goal-metric-divider" />
                  <div className="goal-metric-item">
                    <span className="metric-tag">Target Cap</span>
                    <strong className="metric-val">
                      <Money value={Number(goal.targetAmount) || 0} />
                    </strong>
                  </div>
                </div>

                {/* Pace info & Deposit Button */}
                <div className="goal-card-actions">
                  <div className="goal-pace-note">
                    {isCompleted ? (
                      <span className="accomplished-badge">
                        🎉 Milestone Reached! Capital Secured.
                      </span>
                    ) : (
                      <>
                        <span className="pace-remaining">
                          <Money value={Number(goal.remaining) || 0} /> needed
                        </span>
                        <span className="pace-rate">
                          • <Money value={Number(goal.requiredMonthlySaving) || 0} />/mo pace
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    className="button button-secondary goal-deposit-btn"
                    onClick={() => {
                      setDepositGoal(goal);
                      setDepositAmount("");
                    }}
                  >
                    <Plus size={15} />
                    <span>Deposit Savings</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* New Goal Modal */}
      {show && (
        <Modal title="Establish Savings Milestone" onClose={() => setShow(false)}>
          <form onSubmit={save} className="goal-form">
            <div className="form-grid">
              <label className="wide">
                <span className="form-label-text">Milestone Name</span>
                <input
                  name="name"
                  required
                  placeholder="e.g. Emergency Liquidity Reserve, Home Downpayment"
                  autoFocus
                />
              </label>

              <label>
                <span className="form-label-text">Target Capital Amount</span>
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
                <span className="form-label-text">Target Milestone Date</span>
                <input name="targetDate" type="date" required />
              </label>

              <label className="wide">
                <span className="form-label-text">Initial Inflow / Seed Amount</span>
                <input
                  name="currentAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue="0"
                />
              </label>

              <label className="wide">
                <span className="form-label-text">Goal Memo / Purpose (Optional)</span>
                <input
                  name="description"
                  placeholder="Define investment purpose, account allocation, or timeline"
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
                Create Goal
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Deposit Savings Modal */}
      {depositGoal && (
        <Modal
          title={`Deposit Funds to "${depositGoal.name}"`}
          onClose={() => setDepositGoal(null)}
        >
          <form onSubmit={submitDeposit} className="deposit-form">
            <div className="deposit-summary-card">
              <div className="deposit-row">
                <span>Current Accumulated:</span>
                <strong><Money value={Number(depositGoal.currentAmount) || 0} /></strong>
              </div>
              <div className="deposit-row">
                <span>Target Cap:</span>
                <strong><Money value={Number(depositGoal.targetAmount) || 0} /></strong>
              </div>
              <div className="deposit-row">
                <span>Remaining to Goal:</span>
                <strong className="brand"><Money value={Number(depositGoal.remaining) || 0} /></strong>
              </div>
            </div>

            <label style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span className="form-label-text">Deposit Amount</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                autoFocus
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </label>

            <div className="modal-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setDepositGoal(null)}
                disabled={depositBusy}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button button-primary"
                disabled={depositBusy || !depositAmount || Number(depositAmount) <= 0}
              >
                {depositBusy ? "Crediting Reserve…" : "Confirm Deposit"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
