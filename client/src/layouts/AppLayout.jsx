import {
  BarChart3,
  Bell,
  ChartNoAxesCombined,
  ChevronLeft,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PiggyBank,
  ReceiptText,
  Settings,
  Sun,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
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
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  const currentLink = links.find((l) => l.to === location.pathname);
  const userInitial = (user?.name || user?.email || "U")
    .charAt(0)
    .toUpperCase();

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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              className="icon-button mobile-only"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              type="button"
            >
              <Menu size={18} />
            </button>
            <div className="topbar-copy">
              <span>{currentLink ? currentLink.label : "FinSight AI"}</span>
              <small>Intelligent Financial Workspace</small>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              className="icon-button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              type="button"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
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
