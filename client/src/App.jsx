import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import PlaceholderPage from "./components/PlaceholderPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TransactionsPage from "./pages/TransactionsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BudgetsPage from "./pages/BudgetsPage";
import GoalsPage from "./pages/GoalsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
const protectedPages = [
  [
    "transactions",
    "Transactions",
    "A structured home for future income and expense records.",
  ],
  ["analytics", "Analytics", "Future visual insights into financial behavior."],
  ["budgets", "Budgets", "Plan spending limits in a future project phase."],
  ["goals", "Savings Goals", "Set and follow future savings milestones."],
  [
    "notifications",
    "Notifications",
    "Keep up with important financial updates later.",
  ],
  ["reports", "Reports", "Create financial summaries and exports later."],
  [
    "settings",
    "Profile & Settings",
    "Personalize your account and preferences later.",
  ],
];
import { useScrollAnimation } from "./hooks/useScrollAnimation";

export default function App() {
  useScrollAnimation();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
