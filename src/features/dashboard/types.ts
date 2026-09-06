/**
 * Slots Studio — Dashboard Domain Models
 */

export type ProjectStatus = "Draft" | "In Progress" | "In Review" | "Completed";

export interface ProjectItem {
  id: string;
  slotId: string;
  name: string;
  category: string;
  status: ProjectStatus;
  activeStudio: string;
  assetCount: number;
  updatedAt: string;
}

export type JobStatus = "Queued" | "Running" | "Review" | "Completed" | "Failed";

export interface JobItem {
  id: string;
  title: string;
  projectName: string;
  studio: string;
  studioCode: string;
  status: JobStatus;
  progress: number;
  startedAt: string;
}

export type ReviewStatus = "Needs Review" | "Approved" | "Rejected";

export interface ReviewItem {
  id: string;
  title: string;
  projectName: string;
  studio: string;
  aspectRatio: string;
  status: ReviewStatus;
  createdAt: string;
  metadata?: Record<string, string>;
}

export interface AssetItem {
  id: string;
  name: string;
  projectName: string;
  studio: string;
  type: "Visual" | "3D Spec" | "Ad Kit" | "Copy" | "Tech Pack";
  format: string;
  aspectRatio?: string;
  createdAt: string;
}

export interface UsageData {
  plan: string;
  period: string;
  activeJobsCapacity: string;
  status: "Normal" | "Elevated" | "Inactive";
}

export interface ActivityItem {
  id: string;
  type: "project" | "job" | "review" | "asset";
  title: string;
  timestamp: string;
  detail: string;
}

export interface DashboardData {
  projects: ProjectItem[];
  jobs: JobItem[];
  reviews: ReviewItem[];
  assets: AssetItem[];
  usage: UsageData;
  activity: ActivityItem[];
}
