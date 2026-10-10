import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  LockKeyhole,
  Moon,
  PieChart,
  PiggyBank,
  ReceiptText,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Wallet,
  WalletCards,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import { useTheme } from "../hooks/useTheme";

const corePillars = [
  {
    icon: ReceiptText,
    badge: "Double-Entry Ledger",
    title: "High-Density Transaction Ledger",
    copy: "Audit daily inflows and expenditures with granular category tagging, payment channels, and memos.",
  },
  {
    icon: ShieldCheck,
    badge: "Pacing Guardrails",
    title: "Dynamic Category Budgets",
    copy: "Automated monthly ceiling tracking with proactive warning illumination at 80% capacity.",
  },
  {
    icon: PiggyBank,
    badge: "Milestone Engine",
    title: "Targeted Savings Trajectories",
    copy: "Accumulate capital for key life milestones with automated monthly pace calculations and progress rings.",
  },
  {
    icon: TrendingUp,
    badge: "Visual Analytics",
    title: "Algorithmic Trend Intelligence",
    copy: "Deconstruct financial trajectory through 2x2 visual dimensions: distributions, monthly flow, and daily velocity.",
  },
  {
    icon: Bot,
    badge: "Private LLM Agent",
    title: "Autonomous Financial Partner",
    copy: "Inquire about spending optimization, debt repayment, and savings runway with contextual guidance.",
  },
  {
    icon: LockKeyhole,
    badge: "Zero-Tracking",
    title: "End-to-End Private by Design",
    copy: "Local token session management, salted password hashing, and encrypted data channels ensure complete autonomy.",
  },
];

const mockSignals = [
  {
    tag: "OPTIMIZATION",
    text: "Discretionary dining velocity is down 14% after your weekend cap.",
    type: "positive",
  },
  {
    tag: "MILESTONE PACE",
    text: "Emergency liquidity reserve requires ₹12,500/mo to reach target on schedule.",
    type: "info",
  },
  {
    tag: "SURPLUS FORECAST",
    text: "Net operating surplus of ₹74,800 available to sweep into investments.",
    type: "positive",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Capture Daily Cashflow",
    description: "Record transaction amounts, payment methods, and category classifications in seconds.",
  },
  {
    step: "02",
    title: "Establish Spending Guardrails",
    description: "Define category budgets and savings milestones with automated pace monitoring.",
  },
  {
    step: "03",
    title: "Execute with AI Guidance",
    description: "Generate fiscal statements (PDF/CSV) and leverage real-time AI to maximize your retained wealth.",
  },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing">
      {/* Top Marketing Navigation */}
      <header className="marketing-nav">
        <Brand />

        <div className="marketing-nav-right">
          <div className="marketing-status-pill" title="System Operational">
            <span className="system-dot" />
            <span>Telemetry Online</span>
          </div>

          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            type="button"
          >
            {theme === "light" ? (
              <>
                <Moon size={16} />
                <span className="theme-toggle-label">Dark</span>
              </>
            ) : (
              <>
                <Sun size={16} />
                <span className="theme-toggle-label">Light</span>
              </>
            )}
          </button>

          <Link className="text-link" to="/login">
            Sign In
          </Link>

          <Link className="button button-primary nav-cta-btn" to="/register">
            <span>Launch Workspace</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">
              <Sparkles size={14} />
              Autonomous Financial Intelligence
            </div>

            <h1 className="hero-heading">
              Institutional Clarity for Every Financial Decision.
            </h1>

            <p className="hero-lead">
              High-fidelity cashflow tracking, algorithmic budget guardrails, and forward-looking savings milestones in a unified, private workspace.
            </p>

            <div className="hero-actions">
              <Link className="button button-primary hero-btn-main" to="/register">
                <span>Open Private Workspace</span>
                <ArrowRight size={16} />
              </Link>

              <Link className="button button-secondary hero-btn-sub" to="/login">
                <span>Sign In to Terminal</span>
              </Link>
            </div>

            <div className="trust-strip">
              <div className="trust-item">
                <CheckCircle2 size={15} />
                <span>256-bit Encryption</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={15} />
                <span>Zero Third-Party Ads</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={15} />
                <span>Instant Telemetry</span>
              </div>
            </div>
          </div>

          {/* Interactive Command Center Preview Card */}
          <div className="hero-preview-wrapper" aria-label="Interactive Financial Dashboard Preview">
            <div className="card live-command-center">
              {/* Terminal Titlebar */}
              <div className="command-header">
                <div className="command-title-group">
                  <div className="window-dots">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <span className="terminal-title">FinSight Real-Time Telemetry Node</span>
                </div>
                <div className="live-pill">
                  <span className="system-dot" />
                  <span>Real-time</span>
                </div>
              </div>

              {/* KPI Strip */}
              <div className="command-kpi-row">
                <div className="command-kpi-item">
                  <span className="kpi-label">Available Liquidity</span>
                  <strong className="kpi-num">₹2,84,500.00</strong>
                  <div className="kpi-trend up">
                    <TrendingUp size={12} />
                    <span>+14.2% MoM</span>
                  </div>
                </div>

                <div className="command-kpi-item">
                  <span className="kpi-label">Monthly Inflow</span>
                  <strong className="kpi-num income">+₹1,20,000.00</strong>
                  <div className="kpi-trend up">
                    <ArrowDownLeft size={12} />
                    <span>On target</span>
                  </div>
                </div>

                <div className="command-kpi-item">
                  <span className="kpi-label">Current Outflow</span>
                  <strong className="kpi-num expense">−₹45,200.00</strong>
                  <div className="kpi-trend down">
                    <ArrowUpRight size={12} />
                    <span>-3.2% Burn</span>
                  </div>
                </div>

                <div className="command-kpi-item">
                  <span className="kpi-label">Retained Capital</span>
                  <strong className="kpi-num brand">₹74,800.00</strong>
                  <div className="kpi-trend up">
                    <Sparkles size={12} />
                    <span>62% Velocity</span>
                  </div>
                </div>
              </div>

              {/* Interactive Telemetry Graphic (Visualized Wave / Bars) */}
              <div className="telemetry-graphic-box">
                <div className="graphic-top-label">
                  <span>Cashflow Trajectory vs Algorithmic Benchmark</span>
                  <span className="rate-badge">Optimal Resilience</span>
                </div>

                <div className="telemetry-svg-container">
                  <svg viewBox="0 0 540 120" className="telemetry-chart-svg" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="540" y2="30" stroke="var(--border-subtle)" strokeDasharray="3 3" />
                    <line x1="0" y1="70" x2="540" y2="70" stroke="var(--border-subtle)" strokeDasharray="3 3" />
                    {/* Area under curve */}
                    <path
                      d="M0,95 Q60,80 120,65 T240,45 T360,35 T480,20 L540,15 L540,120 L0,120 Z"
                      fill="url(#chartGradient)"
                    />
                    {/* Smooth curve */}
                    <path
                      d="M0,95 Q60,80 120,65 T240,45 T360,35 T480,20 L540,15"
                      fill="none"
                      stroke="var(--brand)"
                      strokeWidth="3"
                    />
                    {/* Data dots */}
                    <circle cx="120" cy="65" r="4" fill="var(--brand)" />
                    <circle cx="240" cy="45" r="4" fill="var(--brand)" />
                    <circle cx="360" cy="35" r="4" fill="var(--brand)" />
                    <circle cx="480" cy="20" r="5" fill="var(--brand)" stroke="var(--surface)" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Intelligence Signals Strip */}
              <div className="command-signals-list">
                {mockSignals.map((sig, idx) => (
                  <div key={idx} className="command-signal-row">
                    <span className="signal-tag">{sig.tag}</span>
                    <span className="signal-desc">{sig.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Pillars Grid */}
        <section className="section platform-pillars-section">
          <div className="section-head-centered">
            <div className="eyebrow">Comprehensive Financial Suite</div>
            <h2>Engineered for Disciplined Capital Allocation</h2>
            <p className="section-sub">
              Everything required to monitor liquidity, prevent spending drift, and grow net worth.
            </p>
          </div>

          <div className="pillars-grid">
            {corePillars.map(({ icon: Icon, badge, title, copy }, index) => (
              <article className="card pillar-card" key={title}>
                <div className="pillar-card-top">
                  <div className="pillar-icon-box">
                    <Icon size={20} />
                  </div>
                  <span className="pillar-badge">{badge}</span>
                </div>

                <h3 className="pillar-title">{title}</h3>
                <p className="pillar-desc">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Execution Workflow Section */}
        <section className="section workflow-section">
          <div className="workflow-content">
            <div className="workflow-intro">
              <div className="eyebrow">Streamlined Architecture</div>
              <h2>From Transactional Noise to Calibrated Next Steps.</h2>
              <p>
                Eliminate spreadsheet friction. Let automated reconciliation calculate your exact surplus runway and goal completion pacing.
              </p>
            </div>

            <div className="workflow-cards-stack">
              {workflowSteps.map((s) => (
                <div className="card workflow-step-card" key={s.step}>
                  <span className="step-num">{s.step}</span>
                  <div>
                    <h3 className="step-title">{s.title}</h3>
                    <p className="step-desc">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Assistant Showcase */}
        <section className="section assistant-spotlight-section">
          <div className="card assistant-spotlight-card">
            <div className="assistant-spotlight-left">
              <div className="assistant-emblem-capsule">
                <Bot size={32} />
              </div>

              <div className="eyebrow" style={{ color: "var(--brand-light)" }}>
                Autonomous Financial Agent
              </div>

              <h2>Ask Complex Financial Inquiries. Receive Grounded Insights.</h2>
              <p>
                Query your personalized assistant regarding budget adjustments, tax deductions, goal timeline forecasts, or how an upcoming major expenditure impacts your savings velocity.
              </p>

              <Link to="/register" className="button button-light assistant-cta">
                <span>Test Financial Assistant</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="assistant-dialog-preview">
              <div className="sample-query-pill">
                <span>User:</span> “How much surplus capital can I allocate to my emergency fund this month?”
              </div>
              <div className="sample-response-card">
                <div className="agent-badge">
                  <Sparkles size={13} />
                  <span>FinSight AI</span>
                </div>
                <p>
                  Based on your current month-to-date inflows of <b>₹1,20,000</b> and essential expenses of <b>₹45,200</b>, your remaining unbudgeted surplus is <b>₹74,800</b>. Earmarking <b>₹25,000</b> to your Emergency Reserve today will bring you to <b>82%</b> of your target milestone ahead of schedule.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="cta-banner-wrapper">
          <div className="card cta-banner-card">
            <div className="eyebrow" style={{ color: "#a7f3d0" }}>
              Private & Self-Contained
            </div>
            <h2>Take Command of Your Wealth Trajectory.</h2>
            <p>
              Join individuals managing their daily finances with institutional clarity and predictive peace of mind.
            </p>

            <Link className="button button-light cta-action-btn" to="/register">
              <span>Open Free Workspace</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <footer>
        <Brand />
        <span className="footer-copyright">
          © {new Date().getFullYear()} FinSight AI Inc. All rights reserved.
        </span>
        <div className="footer-actions">
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Workspace</Link>
        </div>
      </footer>
    </div>
  );
}
