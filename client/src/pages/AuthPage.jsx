import { ArrowRight, CheckCircle2, LockKeyhole, Mail, ShieldCheck, User } from "lucide-react";
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

        <div className="auth-header-block">
          <div className="eyebrow auth-eyebrow">
            <LockKeyhole size={14} /> 256-Bit Cryptographic Workspace
          </div>
          <h1>{isLogin ? "Sign In to FinSight" : "Open Your Workspace"}</h1>
          <p>
            {isLogin
              ? "Access institutional cashflow telemetry, category guardrails, and savings trajectories."
              : "Establish your private financial command center with automated intelligence."}
          </p>
        </div>

        <form onSubmit={submit} className="auth-form-card">
          {!isLogin && (
            <label>
              <span className="form-label-text">Full Name</span>
              <div className="input-with-icon">
                <User size={16} className="field-icon" />
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. Alex Morgan"
                  autoComplete="name"
                />
              </div>
            </label>
          )}

          <label>
            <span className="form-label-text">Email Address</span>
            <div className="input-with-icon">
              <Mail size={16} className="field-icon" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="you@domain.com"
                autoComplete="email"
              />
            </div>
          </label>

          <label>
            <span className="form-label-text">Password</span>
            <div className="input-with-icon">
              <LockKeyhole size={16} className="field-icon" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength="8"
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>
          </label>

          {!isLogin && (
            <label>
              <span className="form-label-text">Confirm Password</span>
              <div className="input-with-icon">
                <LockKeyhole size={16} className="field-icon" />
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
              </div>
            </label>
          )}

          {error && <div className="form-error">{error}</div>}

          <button
            className="button button-primary auth-submit-btn"
            disabled={busy}
            type="submit"
          >
            <span>
              {busy ? "Authenticating Session…" : isLogin ? "Sign In to Workspace" : "Create Private Account"}
            </span>
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "New to FinSight?" : "Already established an account?"}{" "}
          <Link to={target}>
            {isLogin ? "Open an account" : "Sign in here"}
          </Link>
        </p>

        <Link className="back-home" to="/">
          ← Return to Public Overview
        </Link>
      </div>

      <aside className="auth-hero-aside">
        <div className="aside-eyebrow">
          <ShieldCheck size={16} /> Institutional Financial Intelligence
        </div>
        <h2>Data-driven clarity across every financial decision.</h2>
        <p className="aside-subtext">
          Consolidate inflows, recurring expenditure guardrails, and automated savings pace within an end-to-end encrypted workspace.
        </p>

        <div className="aside-highlights-list">
          {[
            "Real-time cashflow telemetry & trend analytics",
            "Intelligent budget guardrails with proactive drift alerts",
            "Goal-aligned capital accumulation trajectories",
            "Private by design with local session persistence",
          ].map((item) => (
            <div key={item} className="aside-highlight-item">
              <CheckCircle2 size={18} className="aside-check-icon" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
