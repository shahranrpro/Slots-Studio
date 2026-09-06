/**
 * Slots Studio — Dashboard Service Layer
 *
 * Provides truthful operational data for the authenticated command center.
 *
 * Service Contract:
 * When real database records (projects, jobs, review requests, assets) are not
 * yet created in the workspace, this service returns empty collections to trigger
 * honest and informative empty states in the UI.
 *
 * In future tasks (TASK 11+), these queries will read directly from the persistent
 * database and background job queue.
 */

import { type DashboardData } from "../types";

export async function getDashboardData(
  _userId: string,
  _workspaceId?: string
): Promise<DashboardData> {
  // Scoped to userId and workspaceId in future persistent database tasks
  void _userId;
  void _workspaceId;

  // Truthful empty operational state
  return {
    projects: [],
    jobs: [],
    reviews: [],
    assets: [],
    usage: {
      plan: "Studio Workspace Plan",
      period: "Current Billing Cycle",
      activeJobsCapacity: "Usage tracking not active",
      status: "Inactive",
    },
    activity: [],
  };
}
