import { AlertCircle, Inbox, LoaderCircle, Sparkles } from "lucide-react";

export function Loading({ label = "Loading financial data…" }) {
  return (
    <div className="state">
      <div className="loading-capsule">
        <LoaderCircle className="spin" size={32} />
      </div>
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message = "Something went wrong." }) {
  return (
    <div className="state">
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          backgroundColor: "var(--expense-soft)",
          border: "1px solid var(--expense-border)",
          display: "grid",
          placeItems: "center",
          color: "var(--expense)",
        }}
      >
        <AlertCircle size={22} />
      </div>
      <p style={{ color: "var(--expense)", fontWeight: 600 }}>{message}</p>
    </div>
  );
}

export function EmptyState({ message = "Nothing here yet." }) {
  return (
    <div className="state">
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "12px",
          backgroundColor: "var(--surface-subtle)",
          display: "grid",
          placeItems: "center",
          color: "var(--ink-muted)",
          border: "1px solid var(--border)",
        }}
      >
        <Inbox size={26} />
      </div>
      <p>{message}</p>
    </div>
  );
}
