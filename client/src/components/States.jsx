import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";

export function Loading({ label = "Loading financial data…" }) {
  return (
    <div className="state">
      <LoaderCircle className="spin" size={32} />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message = "Something went wrong." }) {
  return (
    <div className="state">
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          backgroundColor: "var(--expense-soft)",
          display: "grid",
          placeItems: "center",
          color: "var(--expense)",
        }}
      >
        <AlertCircle size={22} />
      </div>
      <p style={{ color: "var(--expense)", fontWeight: 500 }}>{message}</p>
    </div>
  );
}

export function EmptyState({ message = "Nothing here yet." }) {
  return (
    <div className="state">
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          backgroundColor: "var(--surface-subtle)",
          display: "grid",
          placeItems: "center",
          color: "var(--ink-muted)",
          border: "1px solid var(--border)",
        }}
      >
        <Inbox size={24} />
      </div>
      <p>{message}</p>
    </div>
  );
}
