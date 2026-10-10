import {
  ArrowRight,
  Bot,
  ChartNoAxesCombined,
  CheckCircle2,
  LockKeyhole,
  Moon,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Sun,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import ScrollReveal from "../components/ScrollReveal";
import { useTheme } from "../hooks/useTheme";
import heroArt from "../assets/finance-hero.png";

const features = [
  {
    icon: ReceiptText,
    title: "Unified money timeline",
    copy: "Track income and expenses in a clean flow that makes patterns easier to spot.",
  },
  {
    icon: Bot,
    title: "AI answers that stay practical",
    copy: "Ask plain-language finance questions and get useful next steps from your own context.",
  },
  {
    icon: PiggyBank,
    title: "Savings goals with momentum",
    copy: "See progress, remaining balance, and the monthly pace needed to stay on track.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Visual spending intelligence",
    copy: "Turn transactions into quick summaries, trends, and signals you can act on.",
  },
  {
    icon: ShieldCheck,
    title: "Budget guardrails",
    copy: "Keep spending categories visible so your plan feels easier to follow every week.",
  },
  {
    icon: LockKeyhole,
    title: "Private by design",
    copy: "Your workspace stays focused on your financial decisions and protected account flow.",
  },
];

const metrics = [
  { label: "Cashflow health", value: "+18%", detail: "after recurring bills" },
  { label: "Saved this month", value: "$1,280", detail: "toward active goals" },
  { label: "Spending drift", value: "-9%", detail: "lower than last month" },
];

const insights = [
  "Dining is trending down after your new budget.",
  "Car fund needs $420/month to hit the target.",
  "You have room to move $180 into savings.",
];

const steps = [
  "Connect the daily view of income, expenses, budgets, and goals.",
  "Let the tracker turn raw activity into clear financial signals.",
  "Ask the AI assistant what to do next and act with more confidence.",
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing">
      <header className="marketing-nav">
        <Brand />

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            className="icon-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            type="button"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <Link className="text-link" to="/login">
            Log in
          </Link>

          <Link className="button button-primary" to="/register">
            <span>Get Started</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      <main>
        <ScrollReveal as="section" className="hero">
          <div className="hero-copy">
            <div className="eyebrow reveal-bottom">
              <Sparkles size={14} />
              Intelligent Money Management
            </div>

            <h1 className="reveal-left">FinSight AI</h1>

            <p className="reveal-left" style={{ "--reveal-delay": "80ms" }}>
              A modern financial intelligence workspace that turns everyday income,
              spending, budgets, and savings goals into crisp, actionable guidance.
            </p>

            <div className="hero-actions reveal-bottom" style={{ "--reveal-delay": "160ms" }}>
              <Link className="button button-primary" to="/register">
                <span>Start Managing Your Money</span>
                <ArrowRight size={16} />
              </Link>

              <Link className="button button-secondary" to="/login">
                Sign In
              </Link>
            </div>

            <div className="trust reveal-bottom" style={{ "--reveal-delay": "240ms" }}>
              <span>
                <CheckCircle2 size={16} />
                Private workspace
              </span>

              <span>
                <CheckCircle2 size={16} />
                Goal-aware insights
              </span>

              <span>
                <CheckCircle2 size={16} />
                Fast daily clarity
              </span>
            </div>
          </div>

          <div className="hero-media reveal-right" aria-hidden="true">
            <img src={heroArt} alt="FinSight AI Dashboard Preview" />

            <div className="hero-signal-panel reveal-right" style={{ "--reveal-delay": "120ms" }}>
              <span>
                <TrendingUp size={14} />
                AI Forecast
              </span>
              <strong>Save $2,400 faster</strong>
              <small>Suggested by your cashflow and active goals.</small>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" className="preview card" direction="right">
          <div className="preview-top">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <WalletCards size={18} style={{ color: "var(--brand)" }} />
              Financial Command Center
            </span>

            <span className="live-dot">
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "var(--brand)",
                  display: "inline-block",
                }}
              />
              Live Telemetry Preview
            </span>
          </div>

          <div className="metric-grid">
            {metrics.map((metric, index) => (
              <div key={metric.label} style={{ "--reveal-delay": `${index * 80}ms` }}>
                <small>{metric.label}</small>
                <strong>{metric.value}</strong>
                <span>{metric.detail}</span>
              </div>
            ))}
          </div>

          <div className="command-center-layout">
            <div className="chart-placeholder reveal-right" aria-label="Demo spending and savings chart">
              <span>Monthly Capital Trajectory</span>
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

            <div className="insight-stack">
              {insights.map((insight, index) => (
                <div className="insight-pill reveal-right" style={{ "--reveal-delay": `${index * 75}ms` }} key={insight}>
                  <span>0{index + 1}</span>
                  <p>{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" className="section">
          <div className="section-intro reveal-left">
            <div className="eyebrow reveal-bottom">Engineered for real financial life</div>
            <h2 className="reveal-left">Everything essential, organized into one calm workspace.</h2>
          </div>

          <div className="feature-grid">
            {features.map(({ icon: Icon, title, copy }, index) => (
              <ScrollReveal
                as="article"
                className="card feature"
                direction="right"
                delay={index * 65}
                key={title}
              >
                <div className="feature-icon">
                  <Icon size={20} />
                </div>

                <h3>{title}</h3>
                <p>{copy}</p>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" className="how section">
          <div className="reveal-left">
            <div className="eyebrow reveal-bottom">How It Operates</div>
            <h2>From fragmented activity to confident next steps.</h2>
            <p style={{ color: "var(--ink-secondary)", fontSize: "0.95rem", marginTop: "12px" }}>
              Take the guesswork out of daily cash management with continuous reconciliation and predictive goal forecasts.
            </p>
          </div>

          <ol>
            {steps.map((step, index) => (
              <ScrollReveal as="li" direction="bottom" delay={index * 80} key={step}>
                <b>0{index + 1}</b>
                <span>{step}</span>
              </ScrollReveal>
            ))}
          </ol>
        </ScrollReveal>

        <ScrollReveal as="section" className="assistant-preview section">
          <div className="assistant-emblem reveal-bottom">
            <Bot size={36} />
          </div>

          <div className="reveal-left">
            <div className="eyebrow" style={{ color: "var(--brand-light)" }}>Smart Finance Assistant</div>
            <h2>Ask better money questions and get answers that fit.</h2>
            <p>
              Ask about saving more, planning a car purchase, reading your
              goal progress, or understanding why your monthly surplus feels
              tight.
            </p>
          </div>

          <div className="assistant-lines reveal-right" aria-hidden="true">
            <span>How can I optimize recurring expenses?</span>
            <span>Am I on schedule for my emergency reserve?</span>
            <span>Forecast my surplus after upcoming bills</span>
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" className="cta">
          <div className="eyebrow reveal-bottom">Begin with Total Clarity</div>
          <h2 className="reveal-left">Take control of your money without making finance feel heavy.</h2>
          <p className="reveal-left" style={{ "--reveal-delay": "80ms" }}>
            Start tracking today and build a clearer, more confident financial
            future.
          </p>

          <Link className="button button-light reveal-bottom" style={{ "--reveal-delay": "160ms" }} to="/register">
            <span>Open Free Account</span>
            <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </main>

      <footer>
        <Brand />
        <span>© {new Date().getFullYear()} FinSight AI Inc. All rights reserved.</span>
        <div className="footer-actions">
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
        </div>
      </footer>
    </div>
  );
}
