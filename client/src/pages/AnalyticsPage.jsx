import { useEffect, useState } from "react";
import {
  Area,
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
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Filter,
  PieChart as PieIcon,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Money from "../components/Money";
import { ErrorState, Loading, EmptyState } from "../components/States";
import { useAuth } from "../hooks/useAuth";

const colors = [
  "#0d9488", // Emerald / Brand
  "#6366f1", // Indigo
  "#f59e0b", // Amber
  "#ec4899", // Rose
  "#06b6d4", // Cyan
  "#8b5cf6", // Purple
  "#10b981", // Mint green
  "#f97316", // Orange
  "#3b82f6", // Blue
  "#14b8a6", // Teal
];

function FintechTooltip({ active, payload, label, currency = "INR" }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="fintech-chart-tooltip">
      {label && (
        <div className="tooltip-header">
          <span className="tooltip-title">{label}</span>
        </div>
      )}
      <div className="tooltip-body">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="tooltip-row">
            <span className="tooltip-name-group">
              <span
                className="tooltip-indicator"
                style={{
                  backgroundColor: entry.color || entry.fill || "var(--brand)",
                }}
              />
              <span className="tooltip-name">{entry.name || entry.dataKey}</span>
            </span>
            <span className="tooltip-value tabular-num">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency,
                maximumFractionDigits: 2,
              }).format(Number(entry.value) || 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PieTooltip({ active, payload, currency = "INR" }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0];

  return (
    <div className="fintech-chart-tooltip">
      <div className="tooltip-header">
        <span className="tooltip-title">{data.name}</span>
      </div>
      <div className="tooltip-body">
        <div className="tooltip-row">
          <span className="tooltip-name-group">
            <span
              className="tooltip-indicator"
              style={{ backgroundColor: data.payload?.fill || "var(--expense)" }}
            />
            <span className="tooltip-name">Expenditure</span>
          </span>
          <span className="tooltip-value expense tabular-num">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency,
              maximumFractionDigits: 2,
            }).format(Number(data.value) || 0)}
          </span>
        </div>
        {data.payload?.percentage !== undefined && (
          <div className="tooltip-row" style={{ marginTop: "4px" }}>
            <span className="tooltip-name" style={{ color: "var(--ink-muted)" }}>Portfolio Share</span>
            <span className="tooltip-value brand tabular-num">
              {Number(data.payload.percentage).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, icon: Icon, children, empty, action }) {
  return (
    <article className="card chart-card-elevated">
      <div className="chart-card-top">
        <div className="chart-card-heading">
          <div className="chart-title-with-icon">
            {Icon && (
              <div className="chart-header-icon">
                <Icon size={16} />
              </div>
            )}
            <h3>{title}</h3>
          </div>
          {subtitle && <p className="chart-subtitle">{subtitle}</p>}
        </div>
        {action && <div className="chart-card-action">{action}</div>}
      </div>

      <div className="chart-container-box">
        {empty ? (
          <div className="chart-empty-state">
            <div className="empty-chart-icon-box">
              <PieIcon size={24} />
            </div>
            <p className="empty-chart-text">No transactional telemetry for this timeframe</p>
            <span className="empty-chart-sub">Record income or expenses to visualize this dimension</span>
          </div>
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
  api.get("/api/analytics/summary", {
    params: { period },
  }),

  api.get("/api/analytics/categories", {
    params: { period },
  }),

  api.get("/api/analytics/monthly", {
    params: { months: 6 },
  }),

  api.get("/api/analytics/trends", {
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
    return err ? <ErrorState message={err} /> : <Loading label="Compiling analytics telemetry…" />;
  }

  const income = Number(data.s.income) || 0;
  const expenses = Number(data.s.expenses) || 0;
  const savings = Number(data.s.savings) || 0;
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  const periods = [
    { id: "current", label: "Current Month" },
    { id: "previous", label: "Previous Month" },
    { id: "3m", label: "Last 3 Months" },
    { id: "6m", label: "Last 6 Months" },
    { id: "year", label: "Fiscal Year" },
  ];

  return (
    <>
      <PageHeader
        title="Analytics & Telemetry"
        description="Comprehensive visibility into category allocation, cashflow trajectory, and monthly velocity."
      >
        <div className="period-segmented-control">
          {periods.map((p) => (
            <button
              key={p.id}
              className={`period-segment-btn ${period === p.id ? "active" : ""}`}
              onClick={() => setPeriod(p.id)}
              type="button"
            >
              {p.label}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* Analytics KPI Ribbon */}
      <div className="analytics-kpi-grid">
        <div className="card analytics-kpi-card">
          <div className="analytics-kpi-header">
            <span className="analytics-kpi-label">Total Inflow</span>
            <div className="kpi-mini-icon income">
              <ArrowDownLeft size={14} />
            </div>
          </div>
          <div className="analytics-kpi-value income">
            <Money value={income} />
          </div>
          <span className="analytics-kpi-sub">Total credited for period</span>
        </div>

        <div className="card analytics-kpi-card">
          <div className="analytics-kpi-header">
            <span className="analytics-kpi-label">Total Outflow</span>
            <div className="kpi-mini-icon expense">
              <ArrowUpRight size={14} />
            </div>
          </div>
          <div className="analytics-kpi-value expense">
            <Money value={expenses} />
          </div>
          <span className="analytics-kpi-sub">Total expended funds</span>
        </div>

        <div className="card analytics-kpi-card">
          <div className="analytics-kpi-header">
            <span className="analytics-kpi-label">Net Retained</span>
            <div className="kpi-mini-icon brand">
              <TrendingUp size={14} />
            </div>
          </div>
          <div
            className={`analytics-kpi-value ${
              savings >= 0 ? "brand" : "expense"
            }`}
          >
            <Money value={savings} />
          </div>
          <span className="analytics-kpi-sub">
            {savings >= 0 ? "Retained surplus balance" : "Deficit draw on capital"}
          </span>
        </div>

        <div className="card analytics-kpi-card">
          <div className="analytics-kpi-header">
            <span className="analytics-kpi-label">Savings Velocity</span>
            <span className="kpi-mini-icon brand">
              <Sparkles size={14} />
            </span>
          </div>
          <div
            className={`analytics-kpi-value ${
              savingsRate >= 20 ? "income" : savingsRate > 0 ? "brand" : "zero"
            }`}
          >
            {savingsRate}%
          </div>
          <span className="analytics-kpi-sub">
            {savingsRate >= 20 ? "Exceeding institutional target" : "Under 20% benchmark"}
          </span>
        </div>
      </div>

      {/* 2x2 Responsive Chart Grid */}
      <div className="fintech-charts-grid">
        {/* Chart 1: Expense Distribution (Donut) */}
        <ChartCard
          title="Expense Allocation"
          subtitle="Proportional capital distribution across expense categories"
          icon={PieIcon}
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
                innerRadius={68}
                outerRadius={102}
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
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  fontSize: "0.78rem",
                  color: "var(--ink-secondary)",
                  paddingTop: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2: Income vs Expenses (Monthly Bar) */}
        <ChartCard
          title="Cashflow Comparison"
          subtitle="Monthly net inflows versus outflows over trailing 6-month window"
          icon={TrendingUp}
          empty={!data.m || data.m.length === 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.m}
              margin={{ top: 12, right: 16, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                tick={{ fill: "var(--ink-muted)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                tick={{ fill: "var(--ink-muted)", fontSize: 11 }}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip
                content={<FintechTooltip currency={userCurrency} />}
              />
              <Legend
                wrapperStyle={{ fontSize: "0.8rem", paddingTop: "10px", color: "var(--ink-secondary)" }}
              />
              <Bar
                dataKey="income"
                fill="#10b981"
                name="Inflow (Income)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                fill="#f43f5e"
                name="Outflow (Expense)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 3: Spending Trend (Smooth curve Line with active dot) */}
        <ChartCard
          title="Daily Spending Velocity"
          subtitle="Continuous daily expense timeline across current period with peak detection"
          icon={TrendingUp}
          empty={!data.t || data.t.length === 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.t}
              margin={{ top: 12, right: 16, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                tick={{ fill: "var(--ink-muted)", fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                tick={{ fill: "var(--ink-muted)", fontSize: 11 }}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip
                content={<FintechTooltip currency={userCurrency} />}
              />
              <Line
                type="monotone"
                dataKey="amount"
                name="Expenditure"
                stroke="var(--brand)"
                strokeWidth={2.5}
                dot={{
                  r: 3,
                  fill: "var(--brand)",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 7,
                  fill: "var(--brand)",
                  stroke: "var(--surface)",
                  strokeWidth: 3,
                  className: "active-chart-dot",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 4: Category Comparison (Horizontal Bar with rounded ends) */}
        <ChartCard
          title="Category Expenditure Hierarchy"
          subtitle="Ranked category weights with subtle rounded caps and precision ticks"
          icon={Filter}
          empty={!data.c || data.c.length === 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.c}
              layout="vertical"
              margin={{ top: 12, right: 24, left: 16, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-subtle)" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                tick={{ fill: "var(--ink-muted)", fontSize: 11 }}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <YAxis
                type="category"
                dataKey="category"
                width={100}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                tick={{ fill: "var(--ink-secondary)", fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip
                content={<FintechTooltip currency={userCurrency} />}
              />
              <Bar
                dataKey="amount"
                name="Disbursed"
                fill="#6366f1"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  );
}
