import {
  BarChart3,
  Bell,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PiggyBank,
  ReceiptText,
  Settings,
  Sparkles,
  Sun,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Brand from "../components/Brand";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import FinanceChatbot from "../components/FinanceChatbot";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ReceiptText },
  { to: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { to: "/budgets", label: "Budgets", icon: CircleDollarSign },
  { to: "/goals", label: "Savings Goals", icon: PiggyBank },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentLink = links.find((l) => l.to === location.pathname);
  const userInitial = (user?.name || user?.email || "U")
    .charAt(0)
    .toUpperCase();

  const formattedDate = currentDateTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="side-head">
          <Brand />
          <button
            className="icon-button mobile-only"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        <div className="sidebar-section-label">Main Navigation</div>

        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {to === "/notifications" && (
                <span className="sidebar-badge">Live</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="sidebar-user">
            <div className="user-avatar">{userInitial}</div>
            <div className="user-details">
              <p title={user?.name}>{user?.name || "User"}</p>
              <small title={user?.email}>{user?.email}</small>
            </div>
            <span className="user-status-dot" title="Active workspace session" />
          </div>
          <button className="logout" onClick={logout} type="button">
            <LogOut size={15} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {open && (
        <button
          className="backdrop"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
          type="button"
        />
      )}

      <main>
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-only"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              type="button"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb Navigation */}
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <span className="breadcrumb-root">FinSight</span>
              <ChevronRight size={14} className="breadcrumb-separator" />
              <span className="breadcrumb-item">Workspace</span>
              <ChevronRight size={14} className="breadcrumb-separator" />
              <span className="breadcrumb-current">
                {currentLink ? currentLink.label : "Overview"}
              </span>
            </nav>
          </div>

          <div className="topbar-right">
            {/* Real-time Date and Time */}
            <div className="topbar-datetime" title="Current Workspace Time">
              <Clock size={14} />
              <span className="date-str">{formattedDate}</span>
              <span className="time-dot">•</span>
              <span className="time-str">{formattedTime}</span>
            </div>

            {/* Live Sync Status */}
            <div className="system-pill" title="Telemetry & Data Streams Synced">
              <span className="system-dot" />
              <span>Live Synced</span>
            </div>

            {/* Dark / Light Mode Toggle */}
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
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>

        <FinanceChatbot />
      </main>
    </div>
  );
}
