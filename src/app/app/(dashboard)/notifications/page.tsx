"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  UserPlus,
  Sparkles,
  Info,
  CheckCheck,
  ExternalLink,
  Trash2,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Notification, type NotificationType } from "@/lib/notifications/types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"ALL" | "UNREAD" | "JOBS" | "WORKSPACE">("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?limit=100");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setNotifications(json.data.notifications || []);
          setUnreadCount(json.data.unreadCount || 0);
        }
      }
    } catch {
      // Non-blocking
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Non-blocking
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Non-blocking
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Non-blocking
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "UNREAD") return !n.isRead;
    if (activeTab === "JOBS") return ["JOB_COMPLETED", "JOB_FAILED", "JOB_CANCELLED"].includes(n.type);
    if (activeTab === "WORKSPACE") return ["WORKSPACE_INVITE", "WELCOME"].includes(n.type);
    return true;
  });

  const renderIcon = (type: NotificationType) => {
    switch (type) {
      case "JOB_COMPLETED":
        return <CheckCircle2 className="h-4 w-4 text-[var(--accent)] shrink-0" />;
      case "JOB_FAILED":
        return <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />;
      case "JOB_CANCELLED":
        return <XCircle className="h-4 w-4 text-zinc-400 shrink-0" />;
      case "WORKSPACE_INVITE":
        return <UserPlus className="h-4 w-4 text-blue-400 shrink-0" />;
      case "WELCOME":
        return <Sparkles className="h-4 w-4 text-[var(--accent)] shrink-0" />;
      case "SYSTEM":
      default:
        return <Info className="h-4 w-4 text-zinc-400 shrink-0" />;
    }
  };

  const formatTimestamp = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-heading">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/30 px-2.5 py-0.5 text-xs font-mono font-bold text-[var(--accent)]">
                {unreadCount} UNREAD
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            System operational notices, background generation alerts, and team events.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:text-[var(--accent)] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="h-4 w-4 text-[var(--accent)]" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
        <Filter className="h-3.5 w-3.5 text-[var(--text-muted)] mr-1 shrink-0" />
        {[
          { id: "ALL", label: "All Activity" },
          { id: "UNREAD", label: `Unread (${unreadCount})` },
          { id: "JOBS", label: "Jobs Pipeline" },
          { id: "WORKSPACE", label: "Workspace" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap",
              activeTab === tab.id
                ? "bg-[var(--surface-3)] text-[var(--text-primary)] border border-[var(--border-strong)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      {isLoading ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-1)] p-12 text-center">
          <p className="text-sm text-[var(--text-muted)]">Loading notifications...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-1)] p-16 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text-muted)]">
            <Bell className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">No notifications</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
            {activeTab === "UNREAD"
              ? "You're all caught up! No unread notifications found."
              : "No notification events have occurred in this view."}
          </p>
        </div>
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-1)] divide-y divide-[var(--border)] overflow-hidden">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                "flex items-start justify-between gap-4 p-4 sm:p-5 transition-colors",
                notif.isRead ? "bg-transparent opacity-80" : "bg-[var(--surface-2)]/40"
              )}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="mt-1">{renderIcon(notif.type)}</div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {notif.title}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">
                      {formatTimestamp(notif.createdAt)}
                    </span>
                    {!notif.isRead && (
                      <span className="rounded bg-[var(--accent)]/20 px-1.5 py-0.2 text-[9px] font-mono font-bold text-[var(--accent)]">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {notif.message}
                  </p>
                  {notif.link && (
                    <div className="pt-1">
                      <Link
                        href={notif.link}
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
                      >
                        <span>Open related item</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!notif.isRead && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="rounded p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)] transition-colors cursor-pointer"
                    title="Mark as read"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(notif.id)}
                  className="rounded p-1.5 text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--surface-3)] transition-colors cursor-pointer"
                  title="Dismiss notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
