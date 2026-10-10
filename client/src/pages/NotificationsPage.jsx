import { useEffect, useState } from "react";
import { Bell, CheckCheck, Clock } from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import { EmptyState, ErrorState, Loading } from "../components/States";
import { formatDate } from "../utils/finance";

export default function NotificationsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setError("");
      const response = await api.get("/notifications");
      setData(response.data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load notifications.",
      );
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      await loadNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update notification.",
      );
    }
  };

  if (!data) {
    if (error) {
      return <ErrorState message={error} />;
    }
    return <Loading />;
  }

  const unreadCount = Number(data.unread) || 0;

  return (
    <>
      <PageHeader
        title="Notifications & Alerts"
        description={
          unreadCount > 0
            ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`
            : "All notices and system updates are up to date."
        }
      >
        {unreadCount > 0 && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--brand-tint)",
              color: "var(--brand)",
              fontSize: "0.82rem",
              fontWeight: 600,
            }}
          >
            <Bell size={14} />
            {unreadCount} Unread
          </span>
        )}
      </PageHeader>

      {!data.items || data.items.length === 0 ? (
        <EmptyState message="No notifications in your inbox. Important budget alerts and monthly updates will appear here." />
      ) : (
        <div className="stack">
          {data.items.map((notification) => {
            const isUnread = !notification.read;

            return (
              <article
                className={`card notification ${isUnread ? "unread" : ""}`}
                key={notification._id}
                onClick={() => {
                  if (isUnread) {
                    markAsRead(notification._id);
                  }
                }}
                style={{
                  cursor: isUnread ? "pointer" : "default",
                  position: "relative",
                  borderRadius: "var(--radius)",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "8px",
                    backgroundColor: isUnread ? "var(--brand-soft)" : "var(--surface-subtle)",
                    color: isUnread ? "var(--brand)" : "var(--ink-muted)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Bell size={18} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>
                      {notification.title}
                    </h2>
                    {isUnread && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "var(--brand)",
                          display: "inline-block",
                        }}
                      />
                    )}
                  </div>

                  <p style={{ margin: "0 0 6px", fontSize: "0.88rem", color: "var(--ink-secondary)" }}>
                    {notification.message}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      fontSize: "0.75rem",
                      color: "var(--ink-muted)",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Clock size={12} />
                      {formatDate(notification.createdAt)}
                    </span>
                    {isUnread ? (
                      <span style={{ color: "var(--brand)", fontWeight: 600 }}>
                        Click to mark as read
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <CheckCheck size={13} /> Read
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
