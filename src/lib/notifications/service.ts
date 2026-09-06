/**
 * Slots Studio — Notifications Service
 *
 * Coordinates persistent in-app notifications and transactional email alerts:
 * - Creates durable records in PostgreSQL (public.notifications)
 * - Guarantees idempotency (zero duplicates on worker retries)
 * - Fires transactional emails asynchronously without blocking execution
 */

import {
  createNotificationRecord,
  findNotificationsByUserId,
  countUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationRecord,
} from "@/lib/supabase/repositories/notificationRepository";
import { emailService } from "@/lib/email/service";
import {
  type Notification,
  type CreateNotificationInput,
  type NotificationListResponse,
} from "./types";
import { type Job } from "@/lib/jobs/types";
import { findUserById } from "@/lib/auth/store";
import { findUserById as findDbUserById } from "@/lib/supabase/repositories/authRepository";

class NotificationService {
  /**
   * Dispatches an in-app notification and optionally triggers a transactional email.
   */
  public async dispatchNotification(
    input: CreateNotificationInput,
    emailOptions?: {
      sendEmail?: boolean;
      userEmail?: string;
      emailSubject?: string;
    }
  ): Promise<Notification> {
    // 1. Create durable in-app notification in PostgreSQL
    const notification = await createNotificationRecord(input);

    // 2. Optionally send email asynchronously (non-blocking)
    if (emailOptions?.sendEmail && emailOptions.userEmail) {
      setTimeout(async () => {
        try {
          if (input.type === "JOB_COMPLETED" && input.jobId) {
            await emailService.sendJobCompleted(
              {
                to: emailOptions.userEmail!,
                jobTitle: input.title,
                studio: input.metadata?.studio as string || "Visual",
                jobUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${input.link || "/app/jobs"}`,
                completionSummary: input.message,
              },
              {
                workspaceId: input.workspaceId || undefined,
                userId: input.userId,
                jobId: input.jobId,
              }
            );
          } else if (input.type === "JOB_FAILED" && input.jobId) {
            await emailService.sendJobFailed(
              {
                to: emailOptions.userEmail!,
                jobTitle: input.title,
                studio: input.metadata?.studio as string || "Visual",
                jobUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${input.link || "/app/jobs"}`,
                errorMessageSafe: input.message,
              },
              {
                workspaceId: input.workspaceId || undefined,
                userId: input.userId,
                jobId: input.jobId,
              }
            );
          }
        } catch (err) {
          console.warn("Notice: Async notification email dispatch notice:", err);
        }
      }, 0);
    }

    return notification;
  }

  /**
   * Helper to resolve recipient user details for a job.
   */
  private async resolveJobRecipient(job: Job): Promise<{ userId: string; userEmail?: string }> {
    const userId = job.createdBy || "00000000-0000-0000-0000-000000000001";
    let userEmail: string | undefined;

    try {
      const user = (await findUserById(userId)) || (await findDbUserById(userId));
      if (user?.email) {
        userEmail = user.email;
      }
    } catch {
      // Fallback
    }

    return { userId, userEmail };
  }

  /**
   * Dispatches job completed notification & email.
   */
  public async notifyJobCompleted(job: Job): Promise<Notification> {
    const { userId, userEmail } = await this.resolveJobRecipient(job);
    const studioTitle = job.studio ? `${job.studio.charAt(0) + job.studio.slice(1).toLowerCase()} Studio` : "Studio";
    const jobTitle = job.projectName || `${studioTitle} Generation`;

    return this.dispatchNotification(
      {
        userId,
        workspaceId: job.workspaceId,
        type: "JOB_COMPLETED",
        title: `${studioTitle} Generation Complete`,
        message: `Pipeline finished successfully for "${jobTitle}".`,
        link: `/app/jobs?jobId=${job.id}`,
        jobId: job.id,
        projectId: job.projectId,
        idempotencyKey: `job_completed_notif_${job.id}`,
        metadata: {
          studio: job.studio,
          outputIds: job.outputIds,
        },
      },
      {
        sendEmail: Boolean(userEmail),
        userEmail,
      }
    );
  }

  /**
   * Dispatches job failed alert notification & email.
   */
  public async notifyJobFailed(job: Job, safeError: string): Promise<Notification> {
    const { userId, userEmail } = await this.resolveJobRecipient(job);
    const studioTitle = job.studio ? `${job.studio.charAt(0) + job.studio.slice(1).toLowerCase()} Studio` : "Studio";
    const jobTitle = job.projectName || `${studioTitle} Generation`;

    return this.dispatchNotification(
      {
        userId,
        workspaceId: job.workspaceId,
        type: "JOB_FAILED",
        title: `${jobTitle} Failed`,
        message: safeError || "The pipeline failed after maximum retry attempts.",
        link: `/app/jobs?jobId=${job.id}`,
        jobId: job.id,
        projectId: job.projectId,
        idempotencyKey: `job_failed_notif_${job.id}`,
        metadata: {
          studio: job.studio,
          errorCode: job.errorCode,
        },
      },
      {
        sendEmail: Boolean(userEmail),
        userEmail,
      }
    );
  }

  /**
   * Dispatches job cancelled notification.
   */
  public async notifyJobCancelled(job: Job): Promise<Notification> {
    const { userId } = await this.resolveJobRecipient(job);
    const studioTitle = job.studio ? `${job.studio.charAt(0) + job.studio.slice(1).toLowerCase()} Studio` : "Studio";

    return this.dispatchNotification({
      userId,
      workspaceId: job.workspaceId,
      type: "JOB_CANCELLED",
      title: `${studioTitle} Job Cancelled`,
      message: `The generation pipeline for job ${job.id} was stopped by user request.`,
      link: `/app/jobs?jobId=${job.id}`,
      jobId: job.id,
      projectId: job.projectId,
      idempotencyKey: `job_cancelled_notif_${job.id}`,
      metadata: {
        studio: job.studio,
      },
    });
  }

  /**
   * Dispatches workspace invitation notification.
   */
  public async notifyWorkspaceInvite(params: {
    invitedUserId: string;
    workspaceId: string;
    workspaceName: string;
    inviterName: string;
    role: string;
  }): Promise<Notification> {
    return this.dispatchNotification({
      userId: params.invitedUserId,
      workspaceId: params.workspaceId,
      type: "WORKSPACE_INVITE",
      title: `Invited to ${params.workspaceName}`,
      message: `${params.inviterName} invited you to join ${params.workspaceName} as ${params.role}.`,
      link: "/app/settings",
      idempotencyKey: `ws_invite_notif_${params.workspaceId}_${params.invitedUserId}`,
      metadata: {
        workspaceName: params.workspaceName,
        role: params.role,
      },
    });
  }

  /**
   * Retrieves notifications with unread count.
   */
  public async getUserNotifications(
    userId: string,
    options?: { limit?: number; unreadOnly?: boolean; workspaceId?: string }
  ): Promise<NotificationListResponse> {
    const [notifications, unreadCount] = await Promise.all([
      findNotificationsByUserId(userId, options),
      countUnreadNotifications(userId, options?.workspaceId),
    ]);

    return {
      notifications,
      unreadCount,
      totalCount: notifications.length,
    };
  }

  public async getUnreadCount(userId: string, workspaceId?: string): Promise<number> {
    return countUnreadNotifications(userId, workspaceId);
  }

  public async markRead(notificationId: string, userId: string): Promise<boolean> {
    return markNotificationAsRead(notificationId, userId);
  }

  public async markAllRead(userId: string, workspaceId?: string): Promise<number> {
    return markAllNotificationsAsRead(userId, workspaceId);
  }

  public async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    return deleteNotificationRecord(notificationId, userId);
  }
}

export const notificationService = new NotificationService();
