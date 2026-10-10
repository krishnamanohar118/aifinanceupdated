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

      <form className="card settings-container-card" onSubmit={save}>
        {message && (
          <div className="settings-alert-banner success">
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}

        {/* Profile Section */}
        <div className="settings-section">
          <div className="settings-section-head">
            <User size={18} className="settings-icon" />
            <div>
              <h3>Account Identity</h3>
              <p className="settings-sub">Manage your profile credentials and login identifier</p>
            </div>
          </div>

          <div className="settings-fields-group">
            <label>
              <span className="form-label-text">Full Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full legal name"
              />
            </label>

            <label>
              <span className="form-label-text">Authenticated Email Address</span>
              <input
                value={user?.email || ""}
                disabled
                title="Account email address cannot be changed"
              />
            </label>
          </div>
        </div>

        {/* Currency Section */}
        <div className="settings-section">
          <div className="settings-section-head">
            <Shield size={18} className="settings-icon" />
            <div>
              <h3>Financial Reporting Currency</h3>
              <p className="settings-sub">
                All ledger balances, charts, and budget limits will compute using this base currency
              </p>
            </div>
          </div>

          <div className="settings-fields-group">
            <label>
              <span className="form-label-text">Base Denomination</span>
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
        </div>

        {/* Appearance Section */}
        <div className="settings-section">
          <div className="settings-section-head">
            <Sun size={18} className="settings-icon" />
            <div>
              <h3>Workspace Appearance</h3>
              <p className="settings-sub">
                Switch between institutional daylight contrast and low-strain dark mode
              </p>
            </div>
          </div>

          <div className="theme-options-grid">
            <button
              type="button"
              onClick={() => {
                if (theme !== "light") toggleTheme();
              }}
              className={`theme-card-option ${theme === "light" ? "active" : ""}`}
            >
              <div className="theme-card-top">
                <Sun size={18} />
                <span className="theme-card-title">Daylight Mode</span>
              </div>
              <span className="theme-card-desc">
                High-contrast crisp white canvas with emerald accents
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (theme !== "dark") toggleTheme();
              }}
              className={`theme-card-option ${theme === "dark" ? "active" : ""}`}
            >
              <div className="theme-card-top">
                <Moon size={18} />
                <span className="theme-card-title">Dark Mode</span>
              </div>
              <span className="theme-card-desc">
                Low-strain dark graphite with luminous data points
              </span>
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div className="settings-section">
          <div className="settings-section-head">
            <Lock size={18} className="settings-icon" />
            <div>
              <h3>Session & Data Protection</h3>
              <p className="settings-sub">
                Your workspace is secured with JWT tokens and salted password hashing
              </p>
            </div>
          </div>

          <div className="security-notice-box">
            <Shield size={20} className="security-shield-icon" />
            <div className="security-text-group">
              <strong>Enterprise Cryptographic Session Active</strong>
              <p>
                Connected session for <b>{user?.email}</b>. All payload transmissions over TLS 1.3.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="settings-footer-actions">
          <button
            type="button"
            className="button button-secondary"
            onClick={logout}
          >
            <LogOut size={16} />
            <span>Sign Out Session</span>
          </button>

          <button
            className="button button-primary"
            type="submit"
            disabled={saving}
          >
            <Save size={16} />
            <span>{saving ? "Saving Changes…" : "Save Preferences"}</span>
          </button>
        </div>
      </form>
    </>
  );
}
