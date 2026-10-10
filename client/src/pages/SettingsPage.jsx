import { useState } from "react";
import { CheckCircle2, Lock, LogOut, Moon, Save, Shield, Sun, User } from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

export default function SettingsPage() {
  const { user, setUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || "");
  const [currency, setCurrency] = useState(user?.currency || "INR");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const r = await api.put("/profile", {
        name,
        currency,
        theme,
      });

      setUser(r.data.user);
      setMessage("Profile and preferences saved successfully.");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setMessage(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Settings & Preferences"
        description="Configure your personal identity, display currency, and workspace appearance."
      />

      <form className="card settings-form" onSubmit={save}>
        {message && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: message.includes("success")
                ? "var(--income-soft)"
                : "var(--expense-soft)",
              color: message.includes("success")
                ? "var(--income)"
                : "var(--expense)",
              border: `1px solid ${
                message.includes("success")
                  ? "var(--income-border)"
                  : "var(--expense-border)"
              }`,
              fontSize: "0.86rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <CheckCircle2 size={16} />
            {message}
          </div>
        )}

        {/* Profile Section */}
        <div>
          <h2>Account Profile</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "14px" }}>
            <label>
              Full Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
              />
            </label>

            <label>
              Email Address
              <input
                value={user?.email || ""}
                disabled
                title="Account email address cannot be changed"
              />
            </label>
          </div>
        </div>

        {/* Currency Section */}
        <div>
          <h2>Financial Currency</h2>
          <p className="muted" style={{ margin: "4px 0 12px" }}>
            All dashboard totals and transactions will display in your selected currency.
          </p>
          <label>
            Base Reporting Currency
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="INR">Indian Rupee (₹ INR)</option>
              <option value="USD">United States Dollar ($ USD)</option>
              <option value="EUR">Euro (€ EUR)</option>
            </select>
          </label>
        </div>

        {/* Appearance Section */}
        <div>
          <h2>Workspace Appearance</h2>
          <p className="muted" style={{ margin: "4px 0 12px" }}>
            Choose between daytime clarity or low-light dark mode.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <button
              type="button"
              onClick={() => {
                if (theme !== "light") toggleTheme();
              }}
              style={{
                padding: "16px",
                borderRadius: "var(--radius-sm)",
                border: `2px solid ${theme === "light" ? "var(--brand)" : "var(--border)"}`,
                backgroundColor: "var(--surface)",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--ink)", fontWeight: 700 }}>
                <Sun size={18} style={{ color: theme === "light" ? "var(--brand)" : "var(--ink-muted)" }} />
                <span>Light Mode</span>
              </div>
              <span style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>
                High-contrast clean canvas
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (theme !== "dark") toggleTheme();
              }}
              style={{
                padding: "16px",
                borderRadius: "var(--radius-sm)",
                border: `2px solid ${theme === "dark" ? "var(--brand)" : "var(--border)"}`,
                backgroundColor: "var(--surface)",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--ink)", fontWeight: 700 }}>
                <Moon size={18} style={{ color: theme === "dark" ? "var(--brand)" : "var(--ink-muted)" }} />
                <span>Dark Mode</span>
              </div>
              <span style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>
                Low-strain dark graphite
              </span>
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div>
          <h2>Session & Security</h2>
          <p className="muted" style={{ margin: "4px 0 16px" }}>
            Your workspace is secured with JWT tokens and salted password hashing.
          </p>

          <div
            style={{
              padding: "14px 18px",
              backgroundColor: "var(--surface-subtle)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Shield size={20} style={{ color: "var(--brand)", flexShrink: 0 }} />
            <span style={{ fontSize: "0.82rem", color: "var(--ink-secondary)" }}>
              Authenticated as <b>{user?.email}</b>. All data transmissions are encrypted.
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-actions" style={{ marginTop: "12px", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
          <button
            type="button"
            className="button button-secondary"
            onClick={logout}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>

          <button
            className="button button-primary"
            type="submit"
            disabled={saving}
          >
            <Save size={16} />
            <span>{saving ? "Saving…" : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </>
  );
}
