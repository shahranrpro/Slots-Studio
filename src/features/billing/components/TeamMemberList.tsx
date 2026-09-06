"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  type WorkspaceMemberDetailed,
  type WorkspaceInvitation,
  type WorkspaceRole,
} from "@/lib/billing/types";
import { RoleBadge } from "./RoleBadge";
import { Users, UserPlus, Trash2, Mail, ShieldAlert, Clock } from "lucide-react";

export interface TeamMemberListProps {
  members: WorkspaceMemberDetailed[];
  invitations: WorkspaceInvitation[];
  currentUserId: string;
  currentUserRole: WorkspaceRole;
  onOpenInviteModal: () => void;
  onUpdateRole: (memberId: string, role: WorkspaceRole) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
  onRevokeInvitation: (invitationId: string) => Promise<void>;
}

export function TeamMemberList({
  members,
  invitations,
  currentUserId,
  currentUserRole,
  onOpenInviteModal,
  onUpdateRole,
  onRemoveMember,
  onRevokeInvitation,
}: TeamMemberListProps) {
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [revokingInviteId, setRevokingInviteId] = useState<string | null>(null);

  const canManageTeam = currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  const handleRoleChange = async (memberId: string, newRole: WorkspaceRole) => {
    setUpdatingMemberId(memberId);
    try {
      await onUpdateRole(memberId, newRole);
    } finally {
      setUpdatingMemberId(null);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member from the workspace?")) return;
    setRemovingMemberId(memberId);
    try {
      await onRemoveMember(memberId);
    } finally {
      setRemovingMemberId(null);
    }
  };

  const handleRevoke = async (invitationId: string) => {
    setRevokingInviteId(invitationId);
    try {
      await onRevokeInvitation(invitationId);
    } finally {
      setRevokingInviteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Members Card */}
      <Card variant="subtle" className="p-6 border-[var(--border-strong)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Users className="h-4 w-4 text-[var(--accent)]" />
              <h3 className="font-display text-lg font-bold text-white tracking-tight">
                ACTIVE WORKSPACE MEMBERS
              </h3>
              <Badge variant="outline">{`${members.length} SEATS`}</Badge>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Collaborators with assigned roles in this workspace.
            </p>
          </div>

          {canManageTeam && (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenInviteModal}
              leftIcon={<UserPlus className="h-4 w-4" />}
            >
              Simulate Invite
            </Button>
          )}
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--border)]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black text-[11px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)]">
              <tr>
                <th className="py-2.5 px-4">Member</th>
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4">Role</th>
                <th className="py-2.5 px-4">Joined Date</th>
                {canManageTeam && <th className="py-2.5 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/40 bg-[var(--surface-1)]">
              {members.map((member) => {
                const isSelf = member.userId === currentUserId;
                const isOwner = member.role === "OWNER";
                const joinedFormatted = new Date(member.joinedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <tr key={member.id} className="hover:bg-[var(--surface-2)]/60 transition-colors">
                    {/* Name + Avatar */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-[var(--surface-3)] border border-[var(--border-strong)] flex items-center justify-center font-bold text-white text-[11px]">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-sans font-semibold text-white">
                            <span>{member.name}</span>
                            {isSelf && (
                              <span className="text-[10px] font-mono text-[var(--accent)] font-normal">
                                (You)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 whitespace-nowrap text-[var(--text-secondary)]">
                      {member.email}
                    </td>

                    {/* Role Dropdown / Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {canManageTeam && !isOwner && !isSelf ? (
                        <select
                          value={member.role}
                          disabled={updatingMemberId === member.id}
                          onChange={(e) => handleRoleChange(member.id, e.target.value as WorkspaceRole)}
                          className="bg-black text-white text-xs border border-[var(--border)] rounded px-2 py-1 focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="EDITOR">EDITOR</option>
                          <option value="REVIEWER">REVIEWER</option>
                          <option value="VIEWER">VIEWER</option>
                        </select>
                      ) : (
                        <RoleBadge role={member.role} />
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="py-3 px-4 whitespace-nowrap text-[var(--text-muted)]">
                      {joinedFormatted}
                    </td>

                    {/* Remove Action */}
                    {canManageTeam && (
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        {!isOwner && !isSelf ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={removingMemberId === member.id}
                            onClick={() => handleRemove(member.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 h-auto"
                            title="Remove Member"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        ) : null}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pending Invitations Card */}
      {invitations.length > 0 && (
        <Card variant="subtle" className="p-6 border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[var(--accent)]" />
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                PENDING INVITATIONS
              </h4>
              <Badge variant="accent">{invitations.length}</Badge>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              Invites expire after 7 days
            </span>
          </div>

          <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--border)]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black text-[11px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="py-2.5 px-4">Invited Email</th>
                  <th className="py-2.5 px-4">Assigned Role</th>
                  <th className="py-2.5 px-4">Sent By</th>
                  <th className="py-2.5 px-4">Expires In</th>
                  {canManageTeam && <th className="py-2.5 px-4 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/40 bg-[var(--surface-1)]">
                {invitations.map((inv) => {
                  const expiresFormatted = new Date(inv.expiresAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <tr key={inv.id} className="hover:bg-[var(--surface-2)]/60">
                      <td className="py-3 px-4 whitespace-nowrap text-white">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                          <span>{inv.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <RoleBadge role={inv.role} />
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-[var(--text-secondary)]">
                        {inv.invitedByName}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-[var(--text-muted)]">
                        {expiresFormatted}
                      </td>
                      {canManageTeam && (
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={revokingInviteId === inv.id}
                            onClick={() => handleRevoke(inv.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-[11px] py-1 px-2 h-auto"
                          >
                            Revoke
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Role Permissions Reference Table */}
      <Card variant="subtle" className="p-5 border-[var(--border)]/70 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[var(--accent)]" />
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            ROLE PERMISSION MATRIX
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-black/40 rounded-[var(--radius-sm)] border border-[var(--border)]/60 space-y-1">
            <Badge variant="accent">ADMIN</Badge>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed pt-1">
              Invite members, manage generation quotas, view billing, archive project slots.
            </p>
          </div>
          <div className="p-3 bg-black/40 rounded-[var(--radius-sm)] border border-[var(--border)]/60 space-y-1">
            <Badge variant="default">EDITOR</Badge>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed pt-1">
              Create and edit product concepts, generate visuals, write content, refine campaigns.
            </p>
          </div>
          <div className="p-3 bg-black/40 rounded-[var(--radius-sm)] border border-[var(--border)]/60 space-y-1">
            <Badge variant="outline">REVIEWER</Badge>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed pt-1">
              Approve/reject product concepts, visual assets, copy, and manufacturing Tech Packs.
            </p>
          </div>
          <div className="p-3 bg-black/40 rounded-[var(--radius-sm)] border border-[var(--border)]/60 space-y-1">
            <Badge variant="outline">VIEWER</Badge>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed pt-1">
              Read-only inspection of projects, assets, jobs, and production specifications.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
