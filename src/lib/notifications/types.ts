/**
 * Slots Studio — In-App Notifications Types
 *
 * Defines the notification entity model, supported notification event types,
 * and input parameters for persistent notification creation.
 */

export type NotificationType =
  | "JOB_COMPLETED"
  | "JOB_FAILED"
  | "JOB_CANCELLED"
  | "WORKSPACE_INVITE"
  | "WELCOME"
  | "SYSTEM";

export interface Notification {
  id: string;
  userId: string;
  workspaceId?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  jobId?: string | null;
  projectId?: string | null;
  isRead: boolean;
  idempotencyKey?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface CreateNotificationInput {
  userId: string;
  workspaceId?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  jobId?: string | null;
  projectId?: string | null;
  idempotencyKey?: string | null;
  metadata?: Record<string, unknown>;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
  totalCount: number;
}
