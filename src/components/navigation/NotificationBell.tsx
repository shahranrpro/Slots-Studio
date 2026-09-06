"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Notification, type NotificationType } from "@/lib/notifications/types";

export function NotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?limit=10");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setNotifications(json.data.notifications || []);
          setUnreadCount(json.data.unreadCount || 0);
        }
      }
    } catch {
      // Non-blocking fetch
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, link?: string | null) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Non-blocking
    }

    if (link) {
      setIsOpen(false);
      router.push(link);
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Non-blocking
    } finally {
      setIsLoading(false);
    }
  };

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

  const formatTimeAgo = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] cursor-pointer",
          isOpen && "border-[var(--border-strong)] text-[var(--text-primary)]"
        )}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[9px] font-bold text-black ring-2 ring-[var(--surface-1)]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-1)] shadow-2xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95">
          {/* Popover Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 bg-[var(--surface-2)]/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] font-mono">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="rounded bg-[var(--surface-3)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--accent)]">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={isLoading}
                className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[var(--border)]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-3)] text-[var(--text-muted)]">
                  <Bell className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium text-[var(--text-secondary)]">All caught up</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">No notifications right now.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id, notif.link)}
                  className={cn(
                    "flex items-start gap-3 p-3.5 transition-colors cursor-pointer select-none text-left",
                    notif.isRead
                      ? "bg-transparent opacity-75 hover:bg-[var(--surface-2)]/50 hover:opacity-100"
                      : "bg-[var(--surface-2)]/80 hover:bg-[var(--surface-2)]"
                  )}
                >
                  <div className="mt-0.5">{renderIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={cn("text-xs font-semibold truncate", notif.isRead ? "text-[var(--text-secondary)]" : "text-[var(--text-primary)]")}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono shrink-0">
                        {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.link && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[var(--accent)] font-medium mt-1">
                        View details <ExternalLink className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                  {!notif.isRead && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer View All Link */}
          <div className="border-t border-[var(--border)] bg-[var(--surface-2)]/40 p-2 text-center">
            <Link
              href="/app/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-block text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-1"
            >
              View all notifications &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
