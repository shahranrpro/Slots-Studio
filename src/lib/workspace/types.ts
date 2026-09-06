/**
 * Slots Studio — Workspace & Onboarding Domain Types
 */

export type WorkspaceRole = "OWNER" | "ADMIN" | "EDITOR" | "REVIEWER" | "VIEWER";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  createdAt: string;
}

export type CreationIntent =
  | "Products"
  | "Collections"
  | "Campaigns"
  | "Brand Assets"
  | "Other";

export type TeamStructure =
  | "Solo"
  | "Small Team"
  | "Studio"
  | "Growing Team";

export interface OnboardingAnswers {
  creationIntent?: CreationIntent;
  teamStructure?: TeamStructure;
  displayName?: string;
  avatar?: string;
}

export interface OnboardingState {
  userId: string;
  workspaceId?: string;
  currentStep: number; // 1: Welcome, 2: Workspace, 3: Intent/Team, 4: Ready
  completed: boolean;
  answers: OnboardingAnswers;
  updatedAt: string;
}

export interface WorkspaceResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}
