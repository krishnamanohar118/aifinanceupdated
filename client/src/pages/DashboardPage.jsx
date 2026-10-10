import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Plus,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Money from "../components/Money";
import { ErrorState, Loading, EmptyState } from "../components/States";
import { formatDate } from "../utils/finance";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setError("");
        const response = await api.get("/dashboard");

        if (mounted) {
          setData(response.data?.data || null);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load dashboard.",
          );
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  if (!data) {
    return error ? <ErrorState message={error} /> : <Loading />;
  }

  const recent = Array.isArray(data.recent) ? data.recent : [];
  const savingsPct = Math.max(0, Math.min(100, Number(data.savingsPercentage) || 0));

  const stats = [
    {
      label: "Available Balance",
      value: data.balance,
      icon: Wallet,
      color: "var(--brand)",
      subtext: "Current liquid capital",
      trend: "+4.8%",
      trendType: "up",
      trendLabel: "vs last mo",
    },
    {
      label: "Total Income",
      value: data.income,
      icon: ArrowDownLeft,
      color: "var(--income)",
      subtext: "Recorded this month",
      trend: "+12.5%",
      trendType: "up",
      trendLabel: "MoM inflow",
    },
    {
      label: "Total Expenses",
      value: data.expenses,
      icon: ArrowUpRight,
      color: "var(--expense)",
      subtext: "Recorded this month",
      trend: "-2.4%",
      trendType: "down",
      trendLabel: "burn rate",
    },
    {
      label: "Goal Savings",
      value: data.totalSavings,
      icon: PiggyBank,
      color: "#6366f1",
      subtext: "Active goal reserves",
      trend: `${savingsPct}%`,
      trendType: savingsPct >= 20 ? "up" : "neutral",
      trendLabel: "savings pace",
    },
  ];

  return (
    <>
      <PageHeader
        title="Financial Overview"
        description="Real-time financial telemetry, liquidity metrics, and portfolio cashflow intelligence."
      >
        <Link to="/transactions" className="button button-primary">
          <Plus size={16} />
          <span>New Transaction</span>
        </Link>
      </PageHeader>

      <section className="dashboard-grid">
        {stats.map(({ label, value, icon: Icon, color, subtext, trend, trendType, trendLabel }) => (
          <article className="stat-card" key={label}>
            <div className="stat-card-header">
              <span className="stat-card-label">{label}</span>
              <div
                className="stat-icon-wrapper"
                style={{
                  color: color,
                  backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
                  borderColor: `color-mix(in srgb, ${color} 25%, transparent)`,
                }}
              >
                <Icon size={18} />
              </div>
            </div>

            <strong className="stat-card-value">
              <Money value={Number(value) || 0} />
            </strong>

            <div className="stat-card-footer">
              <div className={`stat-trend-badge ${trendType}`}>
                {trendType === "up" ? (
                  <TrendingUp size={12} />
                ) : trendType === "down" ? (
                  <TrendingUp size={12} style={{ transform: "rotate(90deg)" }} />
                ) : (
                  <Sparkles size={12} />
                )}
                <span>{trend}</span>
              </div>
              <span className="stat-trend-label">{trendLabel}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="two-col">
        {/* Left Column: Intelligence & Savings Rate */}
        <article className="card panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <h2>Financial Intelligence</h2>
              <p className="panel-subtitle">Algorithmic analysis of your current spending trajectory</p>
            </div>
            <span className="ai-badge">
              <Sparkles size={13} /> AI Generated
            </span>
          </div>

          <div className="insight-card">
            <div className="insight-icon">
              <Sparkles size={20} />
            </div>
            <div className="insight-body">
              <p>
                {data.insight || "Add your regular income and daily transactions to unlock predictive insights."}
              </p>
            </div>
          </div>

          <div className="savings-pace-container">
            <div className="savings-pace-header">
              <div>
                <span className="savings-pace-title">Monthly Savings Velocity</span>
                <p className="savings-pace-sub">Percentage of current net income retained</p>
              </div>
              <span
                className={`savings-pace-percentage ${
                  savingsPct >= 20 ? "optimal" : savingsPct > 0 ? "moderate" : "zero"
                }`}
              >
                {data.savingsPercentage || 0}%
              </span>
            </div>

            <div className="progress progress-large">
              <i
                style={{
                  width: `${savingsPct}%`,
                  background:
                    savingsPct >= 20
                      ? "linear-gradient(90deg, var(--brand), var(--income))"
                      : "linear-gradient(90deg, var(--brand), var(--brand-light))",
                }}
              />
            </div>

            <div className="savings-milestones">
              <span className="milestone-label">Baseline (0%)</span>
              <span className="milestone-label target">Target (20%+)</span>
              <span className="milestone-label">Elite (50%)</span>
            </div>

            <p className="savings-feedback">
              {savingsPct >= 20
                ? "Excellent financial resilience! You are saving over 20% of your net income this month."
                : savingsPct > 0
                ? "Healthy discipline. Strive toward the recommended 20%+ threshold to accelerate wealth goals."
                : "No savings captured yet for this accounting cycle."}
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="quick-actions-bar">
            <Link
              to="/analytics"
              className="button button-secondary"
            >
              <TrendingUp size={15} />
              <span>Explore Analytics</span>
            </Link>
            <Link
              to="/budgets"
              className="button button-secondary"
            >
              <Wallet size={15} />
              <span>Configure Budgets</span>
            </Link>
          </div>
        </article>

        {/* Right Column: Recent Activity */}
        <article className="card panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <h2>Recent Transactions</h2>
              <p className="panel-subtitle">Latest cleared entries across all categories</p>
            </div>
            <Link
              to="/transactions"
              className="panel-link"
            >
              <span>View all</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {recent.length > 0 ? (
            <div className="recent-activity-list">
              {recent.map((x) => (
                <div className="recent-activity-row" key={x._id}>
                  <div className="activity-main">
                    <div
                      className={`activity-icon-badge ${
                        x.type === "Income" ? "income" : "expense"
                      }`}
                    >
                      {x.type === "Income" ? (
                        <ArrowDownLeft size={16} />
                      ) : (
                        <ArrowUpRight size={16} />
                      )}
                    </div>

                    <div className="activity-info">
                      <b className="activity-desc">{x.description}</b>
                      <div className="activity-meta">
                        <span className="activity-date">{formatDate(x.date)}</span>
                        {x.category && (
                          <span className="activity-category-tag">{x.category}</span>
                        )}
                        {x.paymentMethod && (
                          <span className="activity-method-tag">{x.paymentMethod}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <b className={`activity-amount ${x.type === "Income" ? "income" : "expense"}`}>
                    {x.type === "Income" ? "+" : "−"}
                    <Money value={Number(x.amount) || 0} />
                  </b>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No recent transactions recorded yet." />
          )}
        </article>
      </section>
    </>
  );
}
