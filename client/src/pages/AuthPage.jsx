import { ArrowRight, CheckCircle2, LockKeyhole, Mail, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Brand from "../components/Brand";

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const target = isLogin ? "/register" : "/login";

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setBusy(true);
    try {
      await (isLogin ? login : register)(form);
      navigate(location.state?.from?.pathname || "/dashboard");
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <Brand />

        <div style={{ marginTop: "24px" }}>
          <p className="eyebrow">
            <LockKeyhole size={14} /> Enterprise-grade Encryption
          </p>
          <h1>{isLogin ? "Welcome Back" : "Open Your Workspace"}</h1>
          <p>
            {isLogin
              ? "Access your unified dashboard, cashflow trends, and financial telemetry."
              : "Start making informed money decisions with data-driven clarity."}
          </p>
        </div>

        <form onSubmit={submit}>
          {!isLogin && (
            <label>
              Full Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="e.g. Alex Morgan"
                autoComplete="name"
              />
            </label>
          )}

          <label>
            Email Address
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@domain.com"
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength="8"
              placeholder="••••••••"
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </label>

          {!isLogin && (
            <label>
              Confirm Password
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                required
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </label>
          )}

          {error && <p className="form-error">{error}</p>}

          <button
            className="button button-primary"
            disabled={busy}
            type="submit"
          >
            <span>
              {busy ? "Authenticating…" : isLogin ? "Sign In" : "Create Account"}
            </span>
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Need an account?" : "Already have an account?"}{" "}
          <Link to={target}>
            {isLogin ? "Create account" : "Sign in here"}
          </Link>
        </p>

        <Link className="back-home" to="/" style={{ marginTop: "16px" }}>
          ← Return to Overview
        </Link>
      </div>

      <aside>
        <p className="eyebrow">Institutional Clarity</p>
        <h2>Data-driven control over every financial decision.</h2>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "1.05rem",
            lineHeight: 1.6,
            marginTop: "16px",
            marginBottom: "32px",
            maxWidth: "460px",
          }}
        >
          Track inflows, expenses, recurring limits, and goal pace within a unified, private workspace.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            "Real-time cashflow telemetry & trend analytics",
            "Intelligent budget guardrails with proactive alerts",
            "Goal-aligned capital accumulation trajectories",
            "Private by design with local session persistence",
          ].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#e2e8f0",
                fontSize: "0.9rem",
              }}
            >
              <CheckCircle2 size={18} style={{ color: "var(--brand-light)", flexShrink: 0 }} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
