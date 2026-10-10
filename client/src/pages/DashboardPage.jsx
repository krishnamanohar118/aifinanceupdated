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
      subtext: "Current net funds",
    },
    {
      label: "Total Income",
      value: data.income,
      icon: ArrowDownLeft,
      color: "var(--income)",
      subtext: "Recorded this month",
    },
    {
      label: "Total Expenses",
      value: data.expenses,
      icon: ArrowUpRight,
      color: "var(--expense)",
      subtext: "Recorded this month",
    },
    {
      label: "Goal Savings",
      value: data.totalSavings,
      icon: PiggyBank,
      color: "#6366f1",
      subtext: "Active goal reserves",
    },
  ];

  return (
    <>
      <PageHeader
        title="Financial Overview"
        description="A real-time command center for your cashflow, budgets, and savings."
      >
        <Link to="/transactions" className="button button-primary">
          <Plus size={16} />
          <span>Add Transaction</span>
        </Link>
      </PageHeader>

      <section className="dashboard-grid">
        {stats.map(({ label, value, icon: Icon, color, subtext }) => (
          <article className="stat-card" key={label}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <p style={{ margin: 0 }}>{label}</p>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  backgroundColor: "var(--surface-subtle)",
                  display: "grid",
                  placeItems: "center",
                  color: color,
                  border: "1px solid var(--border)",
                }}
              >
                <Icon size={16} />
              </div>
            </div>

            <strong>
              <Money value={Number(value) || 0} />
            </strong>

            <small>{subtext}</small>
          </article>
        ))}
      </section>

      <section className="two-col">
        {/* Left Column: Intelligence & Savings Rate */}
        <article className="card panel">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h2>Financial Intelligence</h2>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--brand)",
                background: "var(--brand-tint)",
                padding: "3px 8px",
                borderRadius: "var(--radius-full)",
              }}
            >
              <Sparkles size={13} /> AI Generated
            </span>
          </div>

          <div className="insight">
            <Sparkles size={18} />
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>
                {data.insight || "Add transactions to unlock personalized insights."}
              </p>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink)" }}>
                Monthly Savings Rate
              </span>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: savingsPct >= 20 ? "var(--income)" : "var(--ink)",
                }}
              >
                {data.savingsPercentage || 0}%
              </span>
            </div>

            <div className="progress">
              <i style={{ width: `${savingsPct}%` }} />
            </div>

            <p className="muted" style={{ marginTop: "10px", fontSize: "0.8rem" }}>
              {savingsPct >= 20
                ? "Excellent pace! You are saving over 20% of your income this month."
                : savingsPct > 0
                ? "Good momentum. Target a 20%+ savings rate to build long-term wealth."
                : "No savings captured yet for this period."}
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "1px solid var(--border)",
            }}
          >
            <Link
              to="/analytics"
              className="button button-secondary"
              style={{ fontSize: "0.82rem", minHeight: "36px" }}
            >
              <TrendingUp size={15} /> View Trends
            </Link>
            <Link
              to="/budgets"
              className="button button-secondary"
              style={{ fontSize: "0.82rem", minHeight: "36px" }}
            >
              Set Budgets
            </Link>
          </div>
        </article>

        {/* Right Column: Recent Activity */}
        <article className="card panel">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h2>Recent Activity</h2>
            <Link
              to="/transactions"
              style={{
                fontSize: "0.82rem",
                color: "var(--brand)",
                fontWeight: 600,
              }}
            >
              View all →
            </Link>
          </div>

          {recent.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {recent.map((x) => (
                <div className="mini-row" key={x._id}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "8px",
                        backgroundColor:
                          x.type === "Income"
                            ? "var(--income-soft)"
                            : "var(--surface-subtle)",
                        color:
                          x.type === "Income"
                            ? "var(--income)"
                            : "var(--ink-secondary)",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      {x.type === "Income" ? (
                        <ArrowDownLeft size={16} />
                      ) : (
                        <ArrowUpRight size={16} />
                      )}
                    </div>

                    <span>
                      <b>{x.description}</b>
                      <small>
                        {formatDate(x.date)} {x.category ? `· ${x.category}` : ""}
                      </small>
                    </span>
                  </div>

                  <b className={x.type === "Income" ? "income" : "expense"}>
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
