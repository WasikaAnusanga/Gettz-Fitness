// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import { FaBell } from "react-icons/fa";
// import "./NotificationBell.css";

// const socket = io("http://localhost:3000");

// const NotificationBell = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [isOpen, setIsOpen] = useState(false);

//   // Fetch initial notifications and set up socket listeners
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/api/notification");
//         const data = await response.json();
//         setNotifications(data);
//         setUnreadCount(data.filter(n => !n.isRead).length);
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       }
//     };

//     fetchNotifications();

//     // Listen for new notifications
//     socket.on("newNotification", (notification) => {
//       setNotifications(prev => [notification, ...prev]);
//       setUnreadCount(prev => prev + 1);
//     });

//     return () => {
//       socket.off("newNotification");
//     };
//   }, []);

//   const markAllAsRead = async () => {
//     try {
//       await fetch("http://localhost:3000/api/notification/markasread", {
//         method: "PUT"
//       });
//       setUnreadCount(0);
//       setNotifications(prev => 
//         prev.map(n => ({ ...n, isRead: true }))
//       );
//     } catch (error) {
//       console.error("Error marking notifications as read:", error);
//     }
//   };

//   return (
//     <div className="notification-container">
//       <div 
//         className="notification-bell" 
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <FaBell />
//         {unreadCount > 0 && (
//           <span className="badge">{unreadCount}</span>
//         )}
//       </div>

//       {isOpen && (
//         <div className="notification-dropdown">
//           <div className="dropdown-header">
//             <h3>Notifications</h3>
//             <button onClick={markAllAsRead} className="mark-read-btn">
//               Mark all as read
//             </button>
//           </div>

//           <div className="notification-list">
//             {notifications.length === 0 ? (
//               <div className="empty-state">No notifications yet</div>
//             ) : (
//               notifications.map((notification) => (
//                 <div 
//                   key={notification._id} 
//                   className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
//                 >
//                   <h4>{notification.title}</h4>
//                   <p>{notification.message}</p>
//                   <small>
//                     {new Date(notification.createdAt).toLocaleString()}
//                   </small>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;

import React, { useEffect, useMemo, useState } from "react";
import { FaBell } from "react-icons/fa";
import "./NotificationBell.css";

const API = "http://localhost:3000/api/notification";

// Small utility to format timestamps nicely
const formatDateTime = (ts) => {
  try {
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return ts;
  }
};

// Optional: color chip per type
const TypeChip = ({ type = "info" }) => {
  return <span className={`nf-chip nf-${type}`}>{type}</span>;
};

// Skeleton loader item
const SkeletonItem = () => (
  <div className="nf-item nf-skeleton">
    <div className="nf-chip nf-skeleton-chip" />
    <div className="nf-title nf-skeleton-line" />
    <div className="nf-body nf-skeleton-line long" />
    <div className="nf-meta nf-skeleton-line short" />
  </div>
);

export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = useMemo(() => localStorage.getItem("token"), []);
  const authHeader = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  const fetchMine = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/mine`, { headers: authHeader });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json(); // [{id, title, body, type, createdAt, isRead}]
      setItems(data);
      setUnread(data.filter((x) => !x.isRead).length);
    } catch (e) {
      console.error("Error fetching notifications:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMine(); // initial
    const t = setInterval(fetchMine, 45000); // light polling
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAllAsRead = async () => {
    try {
      const res = await fetch(`${API}/markasread`, {
        method: "PUT",
        headers: authHeader,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setItems((prev) => prev.map((p) => ({ ...p, isRead: true })));
      setUnread(0);
    } catch (e) {
      console.error("Error marking all as read:", e);
    }
  };

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      const panel = document.getElementById("nf-panel");
      const btn = document.getElementById("nf-button");
      if (panel && !panel.contains(e.target) && btn && !btn.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div className="nf-wrap">
      <button
        id="nf-button"
        className="nf-bell"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open notifications"
        onClick={() => setOpen((v) => !v)}
      >
        <FaBell className="nf-bell-icon" />
        {unread > 0 && <span className="nf-badge">{unread}</span>}
      </button>

      {open && (
        <div
          id="nf-panel"
          className="nf-panel"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="nf-header">
            <div className="nf-titlebar">
              <h3 className="nf-title">Notifications</h3>
              <div className="nf-actions">
                <button className="nf-link" onClick={fetchMine}>
                  Refresh
                </button>
                <span className="nf-sep" />
                <button className="nf-link" onClick={markAllAsRead}>
                  Mark all as read
                </button>
              </div>
            </div>
          </div>

          <div className="nf-list">
            {loading ? (
              <>
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
              </>
            ) : items.length === 0 ? (
              <div className="nf-empty">
                <div className="nf-empty-emoji">🔔</div>
                <div className="nf-empty-title">You’re all caught up</div>
                <div className="nf-empty-sub">No notifications to show.</div>
                <button className="nf-ghost" onClick={fetchMine}>
                  Check again
                </button>
              </div>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  className={`nf-item ${!n.isRead ? "nf-unread" : ""}`}
                >
                  <div className="nf-item-top">
                    <TypeChip type={n.type} />
                    {!n.isRead && <span className="nf-dot" aria-hidden="true" />}
                  </div>
                  <div className="nf-titleline">{n.title}</div>
                  <div className="nf-body">{n.body}</div>
                  <div className="nf-meta">{formatDateTime(n.createdAt)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
