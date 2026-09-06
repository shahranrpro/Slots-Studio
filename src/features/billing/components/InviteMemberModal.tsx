"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { type WorkspaceRole, type InviteMemberRequest } from "@/lib/billing/types";
import { UserPlus, Shield, Eye, Edit3, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (req: InviteMemberRequest) => Promise<void>;
  isInviting: boolean;
}

const ROLES: { role: WorkspaceRole; title: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    role: "ADMIN",
    title: "Admin",
    desc: "Can invite members, manage studio generation parameters, and view billing.",
    icon: Shield,
  },
  {
    role: "EDITOR",
    title: "Editor",
    desc: "Can create projects, launch AI generation runs, and edit copy / specs.",
    icon: Edit3,
  },
  {
    role: "REVIEWER",
    title: "Reviewer",
    desc: "Can approve/reject concepts, visual renders, campaigns, and Tech Packs.",
    icon: Eye,
  },
  {
    role: "VIEWER",
    title: "Viewer",
    desc: "Read-only access to inspect projects, assets, jobs, and production specs.",
    icon: Lock,
  },
];

export function InviteMemberModal({
  isOpen,
  onClose,
  onInvite,
  isInviting,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<WorkspaceRole>("EDITOR");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await onInvite({ email: email.trim(), role: selectedRole });
      setEmail("");
      setSelectedRole("EDITOR");
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send invitation.");
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="INVITE TEAM MEMBER"
      description="Grant workspace access with granular role-based permissions."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {error && (
          <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-[var(--radius-sm)] text-xs text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="invite-email" className="block text-xs font-mono uppercase text-[var(--text-muted)]">
            Email Address
          </label>
          <Input
            id="invite-email"
            type="email"
            placeholder="colleague@brand.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isInviting}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase text-[var(--text-muted)]">
            Workspace Role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ROLES.map(({ role, title, desc, icon: Icon }) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "p-3 text-left rounded-[var(--radius-md)] border transition-all space-y-1",
                    isSelected
                      ? "bg-black/60 border-[var(--accent)] shadow-[0_0_15px_rgba(183,255,0,0.08)]"
                      : "bg-[var(--surface-2)] border-[var(--border)] hover:border-[var(--border-strong)]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-white">
                      <Icon className={cn("h-3.5 w-3.5", isSelected ? "text-[var(--accent)]" : "text-[var(--text-muted)]")} />
                      <span>{title}</span>
                    </div>
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-[var(--border)] mt-6">
          <div className="text-[10px] text-amber-400/80 bg-amber-950/30 p-2 rounded border border-amber-500/20 leading-relaxed text-center sm:text-left">
            <strong>MVP Notice:</strong> No actual email is delivered. This generates a simulated invitation in the pending list below.
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isInviting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isInviting}
              leftIcon={<UserPlus className="h-4 w-4" />}
            >
              {isInviting ? "Simulating Invite..." : "Simulate Invitation"}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
