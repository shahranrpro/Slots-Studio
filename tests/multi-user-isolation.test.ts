/**
 * SLOTS STUDIO — MULTI-USER DATA ISOLATION TYPE TEST
 *
 * Validates module exports, typings, and contracts for:
 * - normalizeWorkspaceId / normalizeUserId / normalizeProjectId
 * - AuthenticatedWorkspaceContext resolution
 * - Signup auto-provisioning
 */

import {
  normalizeWorkspaceId,
  normalizeUserId,
  normalizeProjectId,
  isUuid,
} from "@/lib/supabase/utils";
import { type AuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { type User } from "@/lib/auth/types";
import { type Workspace } from "@/lib/workspace/types";

// Static compile-time type verification
export function verifyMultiUserTypes() {
  const testId = "11111111-1111-1111-1111-111111111111";
  const validUuid: boolean = isUuid(testId);
  const normalizedWs: string = normalizeWorkspaceId(testId);
  const normalizedUser: string = normalizeUserId(testId);
  const normalizedProj: string | undefined = normalizeProjectId(testId);

  const mockUser: User = {
    id: testId,
    email: "user@slots.studio",
    name: "Test User",
    role: "user",
    createdAt: new Date().toISOString(),
  };

  const mockWs: Workspace = {
    id: testId,
    name: "Test Workspace",
    ownerId: testId,
    tier: "FREE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const context: AuthenticatedWorkspaceContext = {
    user: mockUser,
    workspace: mockWs,
    workspaces: [mockWs],
    onboarding: {
      userId: testId,
      workspaceId: testId,
      currentStep: 4,
      completed: true,
      updatedAt: new Date().toISOString(),
    },
  };

  return { validUuid, normalizedWs, normalizedUser, normalizedProj, context };
}
