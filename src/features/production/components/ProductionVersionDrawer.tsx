"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { type TechPack } from "@/lib/production/types";
import { X, Clock, FileText } from "lucide-react";

export interface ProductionVersionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  techPacks: TechPack[];
  activeTechPackId: string;
  onSelectVersion: (techPackId: string) => void;
  onNewRevision: () => void;
}

export function ProductionVersionDrawer({
  isOpen,
  onClose,
  techPacks,
  activeTechPackId,
  onSelectVersion,
  onNewRevision,
}: ProductionVersionDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[var(--surface-1)] border-l border-[var(--border-strong)] h-full p-6 flex flex-col justify-between space-y-6 shadow-2xl overflow-y-auto">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3.5">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[var(--accent)]" />
              <h2 className="font-display text-base font-bold text-[var(--text-primary)]">
                TECH PACK REVISION HISTORY
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-[var(--text-secondary)]">
            Traceable version lineage for manufacturing handoffs. Approved versions remain locked and immutable.
          </p>

          {/* Revisions List */}
          <div className="space-y-2.5 pt-2">
            {techPacks.map((tp) => {
              const isActive = tp.id === activeTechPackId;
              return (
                <div
                  key={tp.id}
                  onClick={() => {
                    onSelectVersion(tp.id);
                    onClose();
                  }}
                  className={`p-3.5 rounded-[var(--radius-md)] border cursor-pointer transition-all ${
                    isActive
                      ? "border-[var(--accent)] bg-[var(--surface-3)]"
                      : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[var(--accent)]" />
                      <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                        {tp.version}
                      </span>
                      {isActive && <Badge variant="accent">ACTIVE</Badge>}
                    </div>

                    <Badge
                      variant={
                        tp.status === "APPROVED"
                          ? "success"
                          : tp.status === "REJECTED"
                          ? "danger"
                          : "default"
                      }
                    >
                      {tp.status}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-[var(--text-secondary)] mt-1.5 line-clamp-2">
                    {tp.changelog}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] mt-2 pt-2 border-t border-[var(--border)]">
                    <span>{tp.season}</span>
                    <span>{new Date(tp.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-[var(--border)]">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              onNewRevision();
            }}
            className="w-full"
          >
            Create New Specification Revision
          </Button>
        </div>
      </div>
    </div>
  );
}
