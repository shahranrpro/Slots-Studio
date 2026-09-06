"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { type TechPack, type UpdateTechPackInput } from "@/lib/production/types";
import { X, Save, Edit3 } from "lucide-react";

export interface ProductionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  techPack: TechPack;
  onSave: (input: UpdateTechPackInput) => Promise<void>;
}

export function ProductionEditModal({
  isOpen,
  onClose,
  techPack,
  onSave,
}: ProductionEditModalProps) {
  const [season, setSeason] = useState(techPack.season);
  const [targetRegion, setTargetRegion] = useState(techPack.targetRegion);
  const [factoryNotes, setFactoryNotes] = useState(techPack.factoryNotes);
  const [changelog, setChangelog] = useState(techPack.changelog);
  const [spi, setSpi] = useState(techPack.construction.spi);
  const [seamType, setSeamType] = useState(techPack.construction.seamType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        techPackId: techPack.id,
        season,
        targetRegion,
        factoryNotes,
        changelog,
        construction: {
          spi,
          seamType,
        },
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[var(--surface-1)] border border-[var(--border-strong)] rounded-[var(--radius-lg)] shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3.5">
          <div className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-[var(--accent)]" />
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
              EDIT MANUFACTURING SPECIFICATION ({techPack.version})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-[10px] font-semibold uppercase text-[var(--text-secondary)]">
                TARGET SEASON:
              </label>
              <Input
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="bg-[var(--surface-2)]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] font-semibold uppercase text-[var(--text-secondary)]">
                TARGET FACILITY / REGION:
              </label>
              <Input
                value={targetRegion}
                onChange={(e) => setTargetRegion(e.target.value)}
                className="bg-[var(--surface-2)]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-[10px] font-semibold uppercase text-[var(--text-secondary)]">
                STITCH DENSITY (SPI):
              </label>
              <Input
                value={spi}
                onChange={(e) => setSpi(e.target.value)}
                className="bg-[var(--surface-2)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] font-semibold uppercase text-[var(--text-secondary)]">
                SEAM ASSEMBLY SPECIFICATION:
              </label>
              <Input
                value={seamType}
                onChange={(e) => setSeamType(e.target.value)}
                className="bg-[var(--surface-2)]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] font-semibold uppercase text-[var(--text-secondary)]">
              FACTORY DIRECTIVES & SPECIAL NOTES:
            </label>
            <textarea
              rows={3}
              value={factoryNotes}
              onChange={(e) => setFactoryNotes(e.target.value)}
              className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] p-2.5 text-xs text-[var(--text-primary)] focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] font-semibold uppercase text-[var(--text-secondary)]">
              REVISION CHANGELOG NOTE:
            </label>
            <Input
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              className="bg-[var(--surface-2)]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
            <Button variant="outline" size="sm" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Save className="h-3.5 w-3.5" />}
            >
              Save Specification Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
