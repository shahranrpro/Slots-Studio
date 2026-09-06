"use client";

import React, { useState } from "react";
import {
  type BillingSettingsState,
  type SubscriptionPlanId,
  type BillingInterval,
  type WorkspaceRole,
  type InviteMemberRequest,
} from "@/lib/billing/types";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ProfileSetup } from "@/features/workspace";
import { AppearanceSelector } from "@/components/ui/AppearanceSelector";
import { CreditUsageMeter } from "./CreditUsageMeter";
import { PlanOverviewCard } from "./PlanOverviewCard";
import { PlanTierSelector } from "./PlanTierSelector";
import { UsageLedgerTable } from "./UsageLedgerTable";
import { TeamMemberList } from "./TeamMemberList";
import { InviteMemberModal } from "./InviteMemberModal";
import {
  Sliders,
  CreditCard,
  History,
  Users,
  User,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface BillingSettingsViewProps {
  initialState: BillingSettingsState;
  initialUserName?: string;
  initialUserEmail?: string;
  workspaceSlug?: string;
}

type TabType = "PREFERENCES" | "BILLING" | "USAGE" | "TEAM";

export function BillingSettingsView({
  initialState,
  initialUserName,
  initialUserEmail,
  workspaceSlug,
}: BillingSettingsViewProps) {
  const [state, setState] = useState<BillingSettingsState>(initialState);
  const [activeTab, setActiveTab] = useState<TabType>("PREFERENCES");
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  // Handle Plan Change / Upgrade / Downgrade
  const handleChangePlan = async (planId: SubscriptionPlanId, billingInterval: BillingInterval) => {
    setIsChangingPlan(true);
    try {
      const response = await fetch("/api/workspace/billing/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingInterval }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setState((prev) => ({
          ...prev,
          currentPlan: resData.data.plan,
          credits: resData.data.credits,
          subscription: {
            ...prev.subscription,
            planId,
            billingInterval,
          },
        }));
      }
    } catch (err) {
      console.error("Failed to change plan:", err);
    } finally {
      setIsChangingPlan(false);
    }
  };

  // Handle Member Invitation
  const handleInviteMember = async (req: InviteMemberRequest) => {
    setIsInviting(true);
    try {
      const response = await fetch("/api/workspace/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setState((prev) => ({
          ...prev,
          invitations: [resData.data, ...prev.invitations],
        }));
      } else {
        throw new Error(resData.error || "Failed to send invitation.");
      }
    } finally {
      setIsInviting(false);
    }
  };

  // Handle Member Role Update
  const handleUpdateRole = async (memberId: string, newRole: WorkspaceRole) => {
    try {
      const response = await fetch(`/api/workspace/team/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setState((prev) => ({
          ...prev,
          members: prev.members.map((m) => (m.id === memberId ? resData.data : m)),
        }));
      }
    } catch (err) {
      console.error("Failed to update member role:", err);
    }
  };

  // Handle Member Removal
  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/workspace/team/${memberId}`, {
        method: "DELETE",
      });

      const resData = await response.json();
      if (resData.success) {
        setState((prev) => ({
          ...prev,
          members: prev.members.filter((m) => m.id !== memberId),
        }));
      }
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
  };

  // Handle Invitation Revocation
  const handleRevokeInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/workspace/team/invites/${invitationId}`, {
        method: "DELETE",
      });

      const resData = await response.json();
      if (resData.success) {
        setState((prev) => ({
          ...prev,
          invitations: prev.invitations.filter((i) => i.id !== invitationId),
        }));
      }
    } catch (err) {
      console.error("Failed to revoke invitation:", err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Development MVP Banner */}
      <div className="bg-amber-950/40 border border-amber-800/40 rounded-[var(--radius-md)] p-3 flex items-start gap-3">
        <Shield className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-amber-400">Development Environment (MVP)</p>
          <p className="text-xs text-amber-300/80 leading-relaxed">
            Settings, billing, and team features are currently using an in-memory development store. No real payments are processed, no real emails are sent for invitations, and data will reset on server restart. This is a simulation of the production architecture.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-[var(--border)] pb-4 space-y-1">
        <Badge variant="accent" dot>
          SETTINGS & WORKSPACE CONTROL
        </Badge>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          WORKSPACE SETTINGS
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Manage account identity, subscription tier, credit quotas, and team permissions.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-px overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("PREFERENCES")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 -mb-px whitespace-nowrap",
            activeTab === "PREFERENCES"
              ? "border-[var(--accent)] text-white bg-[var(--surface-2)]"
              : "border-transparent text-[var(--text-muted)] hover:text-white"
          )}
        >
          <Sliders className="h-4 w-4 text-[var(--accent)]" />
          <span>General Preferences</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("BILLING")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 -mb-px whitespace-nowrap",
            activeTab === "BILLING"
              ? "border-[var(--accent)] text-white bg-[var(--surface-2)]"
              : "border-transparent text-[var(--text-muted)] hover:text-white"
          )}
        >
          <CreditCard className="h-4 w-4 text-[var(--accent)]" />
          <span>Plans & Billing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("USAGE")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 -mb-px whitespace-nowrap",
            activeTab === "USAGE"
              ? "border-[var(--accent)] text-white bg-[var(--surface-2)]"
              : "border-transparent text-[var(--text-muted)] hover:text-white"
          )}
        >
          <History className="h-4 w-4 text-[var(--accent)]" />
          <span>Usage Ledger</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("TEAM")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 -mb-px whitespace-nowrap",
            activeTab === "TEAM"
              ? "border-[var(--accent)] text-white bg-[var(--surface-2)]"
              : "border-transparent text-[var(--text-muted)] hover:text-white"
          )}
        >
          <Users className="h-4 w-4 text-[var(--accent)]" />
          <span>Team & RBAC</span>
          <Badge variant="outline" className="ml-1 text-[10px]">
            {state.members.length}
          </Badge>
        </button>
      </div>

      {/* Tab 1: General Preferences */}
      {activeTab === "PREFERENCES" && (
        <div className="grid grid-cols-1 gap-6">
          {/* Profile Section */}
          <Card variant="subtle" className="p-6 border-[var(--border-strong)] space-y-4">
            <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-[var(--accent)]" />
                <CardTitle className="text-sm">Account Profile</CardTitle>
              </div>
              <Badge variant="outline">IDENTITY</Badge>
            </CardHeader>
            <CardContent className="p-0 pt-2 max-w-lg">
              <ProfileSetup
                initialName={initialUserName || state.members[0]?.name || "Dev Lead"}
                email={initialUserEmail || "dev@slots.studio"}
              />
            </CardContent>
          </Card>

          {/* Workspace Info Section */}
          <Card variant="subtle" className="p-6 border-[var(--border-strong)] space-y-4">
            <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2.5">
                <Sliders className="h-4 w-4 text-[var(--accent)]" />
                <CardTitle className="text-sm">Workspace Attributes</CardTitle>
              </div>
              <Badge variant="success" dot>
                ACTIVE
              </Badge>
            </CardHeader>
            <CardContent className="p-0 pt-2 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/60">
                <span className="text-[var(--text-muted)]">Workspace Name:</span>
                <span className="font-bold text-[var(--text-primary)]">{state.workspaceName}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/60">
                <span className="text-[var(--text-muted)]">Workspace Slug:</span>
                <span className="text-[var(--accent)] font-semibold">{workspaceSlug || "default"}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[var(--text-muted)]">Your Access Level:</span>
                <span className="text-emerald-400 font-semibold">{state.currentUserRole}</span>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Mode Section */}
          <Card variant="subtle" className="p-6 border-[var(--border-strong)] space-y-4">
            <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2.5">
                <Shield className="h-4 w-4 text-[var(--accent)]" />
                <CardTitle className="text-sm">Interface Appearance</CardTitle>
              </div>
              <Badge variant="outline">THEME ENGINE</Badge>
            </CardHeader>
            <CardContent className="p-0 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[var(--text-primary)]">Theme Mode</p>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Choose between Default (OS auto-detection), Light, or Dark creative workstation.
                </p>
              </div>
              <AppearanceSelector size="md" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Plans & Billing */}
      {activeTab === "BILLING" && (
        <div className="space-y-6">
          {/* Active Plan Overview */}
          <PlanOverviewCard
            subscription={state.subscription}
            currentPlan={state.currentPlan}
            onOpenUpgradeModal={() => {
              window.scrollTo({ top: 500, behavior: "smooth" });
            }}
          />

          {/* Credit Usage Meter */}
          <CreditUsageMeter credits={state.credits} />

          {/* Plan Tier Selector */}
          <PlanTierSelector
            plans={state.availablePlans}
            activePlanId={state.subscription.planId}
            activeBillingInterval={state.subscription.billingInterval}
            onChangePlan={handleChangePlan}
            isChangingPlan={isChangingPlan}
          />
        </div>
      )}

      {/* Tab 3: Usage Ledger */}
      {activeTab === "USAGE" && (
        <div className="space-y-6">
          <CreditUsageMeter credits={state.credits} />
          <UsageLedgerTable entries={state.recentUsage} />
        </div>
      )}

      {/* Tab 4: Team & RBAC */}
      {activeTab === "TEAM" && (
        <div className="space-y-6">
          <TeamMemberList
            members={state.members}
            invitations={state.invitations}
            currentUserId={state.currentUserId}
            currentUserRole={state.currentUserRole}
            onOpenInviteModal={() => setIsInviteModalOpen(true)}
            onUpdateRole={handleUpdateRole}
            onRemoveMember={handleRemoveMember}
            onRevokeInvitation={handleRevokeInvitation}
          />

          {/* Invite Member Modal */}
          <InviteMemberModal
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            onInvite={handleInviteMember}
            isInviting={isInviting}
          />
        </div>
      )}
    </div>
  );
}
