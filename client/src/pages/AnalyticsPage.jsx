import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Money from "../components/Money";
import { ErrorState, Loading, EmptyState } from "../components/States";
import { useAuth } from "../hooks/useAuth";

const colors = [
  "#0d9488",
  "#f59e0b",
  "#6366f1",
  "#ec4899",
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#14b8a6",
  "#f97316",
  "#06b6d4",
];

function FintechTooltip({ active, payload, label, currency = "INR" }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "10px 14px",
        boxShadow: "var(--shadow-lg)",
        color: "var(--ink)",
        fontSize: "0.82rem",
        minWidth: "150px",
      }}
    >
      {label && (
        <p
          style={{
            fontWeight: 700,
            marginBottom: "6px",
            color: "var(--ink)",
            fontSize: "0.82rem",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "4px",
          }}
        >
          {label}
        </p>
      )}
      {payload.map((entry, index) => (
        <div
          key={`item-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            padding: "2px 0",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--ink-secondary)",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: entry.color || entry.fill || "var(--brand)",
              }}
            />
            {entry.name || entry.dataKey}
          </span>
          <span style={{ fontWeight: 700, color: "var(--ink)" }}>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency,
              maximumFractionDigits: 2,
            }).format(Number(entry.value) || 0)}
          </span>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload, currency = "INR" }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0];

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "10px 14px",
        boxShadow: "var(--shadow-lg)",
        color: "var(--ink)",
        fontSize: "0.82rem",
        minWidth: "140px",
      }}
    >
      <p style={{ fontWeight: 700, marginBottom: "4px", color: "var(--ink)" }}>
        {data.name}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
        <span style={{ color: "var(--ink-secondary)" }}>Expense:</span>
        <span style={{ fontWeight: 700, color: "var(--expense)" }}>
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
          }).format(Number(data.value) || 0)}
        </span>
      </div>
      {data.payload?.percentage !== undefined && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginTop: "4px" }}>
          <span style={{ color: "var(--ink-secondary)" }}>Share:</span>
          <span style={{ fontWeight: 600, color: "var(--brand)" }}>
            {Number(data.payload.percentage).toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, subtitle, children, empty }) {
  return (
    <article className="card chart-card">
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ margin: "0 0 4px" }}>{title}</h2>
        {subtitle && <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--ink-muted)" }}>{subtitle}</p>}
      </div>

      <div className="chart" style={{ width: "100%", height: "290px" }}>
        {empty ? (
          <EmptyState message="No data recorded for this timeframe." />
        ) : (
          children
        )}
      </div>
    </article>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("current");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const { user } = useAuth();
  const userCurrency = user?.currency || "INR";

  useEffect(() => {
    setData(null);
    setErr("");

    Promise.all([
      api.get("/analytics/summary", {
        params: { period },
      }),

      api.get("/analytics/categories", {
        params: { period },
      }),

      api.get("/analytics/monthly", {
        params: { months: 6 },
      }),

      api.get("/analytics/trends", {
        params: { period },
      }),
    ])
      .then(([s, c, m, t]) => {
        setData({
          s: s.data.data || {},
          c: c.data.items || [],
          m: m.data.items || [],
          t: t.data.items || [],
        });
      })
      .catch((e) => {
        console.error(e);
        setErr(
          e.response?.data?.message || e.message || "Failed to load analytics",
        );
      });
  }, [period]);

  if (!data) {
    return err ? <ErrorState message={err} /> : <Loading />;
  }

  const income = Number(data.s.income) || 0;
  const expenses = Number(data.s.expenses) || 0;
  const savings = Number(data.s.savings) || 0;
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Analytics & Insights"
        description="Data-driven visibility into category spending, cashflow trends, and trajectory."
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ minWidth: "150px" }}
          >
            <option value="current">Current month</option>
            <option value="previous">Previous month</option>
            <option value="3m">Last 3 months</option>
            <option value="6m">Last 6 months</option>
            <option value="year">Current year</option>
          </select>
        </div>
      </PageHeader>

      {/* Analytics KPI Ribbon */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div className="card" style={{ padding: "16px 20px" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ink-muted)", textTransform: "uppercase" }}>
            Total Inflow
          </span>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--income)", marginTop: "4px" }}>
            <Money value={income} />
          </div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ink-muted)", textTransform: "uppercase" }}>
            Total Outflow
          </span>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--ink)", marginTop: "4px" }}>
            <Money value={expenses} />
          </div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ink-muted)", textTransform: "uppercase" }}>
            Net Saved
          </span>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, color: savings >= 0 ? "var(--brand)" : "var(--expense)", marginTop: "4px" }}>
            <Money value={savings} />
          </div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ink-muted)", textTransform: "uppercase" }}>
            Savings Rate
          </span>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, color: savingsRate >= 20 ? "var(--income)" : "var(--ink)", marginTop: "4px" }}>
            {savingsRate}%
          </div>
        </div>
      </div>

      <div className="chart-grid">
        {/* Chart 1: Expense Distribution (Pie/Donut) */}
        <ChartCard
          title="Expense Distribution"
          subtitle="Breakdown of spending by category for the period"
          empty={!data.c || data.c.length === 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.c}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
              >
                {data.c.map((item, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    stroke="var(--surface)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip currency={userCurrency} />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2: Income vs Expenses (Monthly Bar) */}
        <ChartCard
          title="Income vs Expenses"
          subtitle="Monthly cashflow balance over past 6 months"
          empty={!data.m || data.m.length === 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.m}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip
                content={<FintechTooltip currency={userCurrency} />}
              />
              <Legend
                wrapperStyle={{ fontSize: "0.82rem", paddingTop: "10px" }}
              />
              <Bar
                dataKey="income"
                fill="#059669"
                name="Income"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                fill="#f97316"
                name="Expenses"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 3: Spending Trend (Line) */}
        <ChartCard
          title="Spending Trend"
          subtitle="Daily expense timeline across the selected range"
          empty={!data.t || data.t.length === 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.t}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip
                content={<FintechTooltip currency={userCurrency} />}
              />
              <Line
                type="monotone"
                dataKey="amount"
                name="Expense"
                stroke="#0d9488"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#0d9488",
                  stroke: "var(--surface)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 4: Category Comparison (Horizontal Bar) */}
        <ChartCard
          title="Category Comparison"
          subtitle="Relative weight of spending categories ranked"
          empty={!data.c || data.c.length === 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.c}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <YAxis
                type="category"
                dataKey="category"
                width={95}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <Tooltip
                content={<FintechTooltip currency={userCurrency} />}
              />
              <Bar
                dataKey="amount"
                name="Spent"
                fill="#6366f1"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  );
}
