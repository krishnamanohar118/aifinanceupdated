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
        title="Audit Logs & System Alerts"
        description={
          unreadCount > 0
            ? `You have ${unreadCount} pending financial alert${unreadCount === 1 ? "" : "s"} requiring review.`
            : "All ledger alerts and guardrail notifications are acknowledged."
        }
      >
        {unreadCount > 0 && (
          <span className="notifications-unread-pill">
            <Bell size={14} />
            <span>{unreadCount} Unread Alerts</span>
          </span>
        )}
      </PageHeader>

      {!data.items || data.items.length === 0 ? (
        <EmptyState message="No notifications in your inbox. Important budget alerts, monthly pace notifications, and system events will appear here." />
      ) : (
        <div className="notifications-feed-list">
          {data.items.map((notification) => {
            const isUnread = !notification.read;

            return (
              <article
                className={`card notification-card-item ${isUnread ? "unread" : "read"}`}
                key={notification._id}
                onClick={() => {
                  if (isUnread) {
                    markAsRead(notification._id);
                  }
                }}
              >
                <div className={`notification-icon-wrapper ${isUnread ? "unread" : ""}`}>
                  <Bell size={18} />
                </div>

                <div className="notification-content-area">
                  <div className="notification-title-strip">
                    <h3 className="notification-title-text">
                      {notification.title}
                    </h3>
                    {isUnread ? (
                      <span className="unread-dot-badge">New Alert</span>
                    ) : (
                      <span className="acknowledged-tag">
                        <CheckCheck size={13} /> Acknowledged
                      </span>
                    )}
                  </div>

                  <p className="notification-message-body">
                    {notification.message}
                  </p>

                  <div className="notification-footer-meta">
                    <span className="notification-timestamp">
                      <Clock size={12} />
                      <span>{formatDate(notification.createdAt)}</span>
                    </span>
                    {isUnread && (
                      <span className="mark-read-hint">
                        Click to acknowledge
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
