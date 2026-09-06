"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Dialog } from "@/components/ui/Dialog";
import { Checkbox } from "@/components/ui/Checkbox";
import { Images, Plus, FileText, CheckCircle2 } from "lucide-react";
import { type VisualReference } from "../types";

export interface VisualReferencePanelProps {
  references: VisualReference[];
  onToggleReference: (refId: string) => void;
  onAddReference: (name: string, type: string) => Promise<void>;
  isLoading?: boolean;
}

export function VisualReferencePanel({
  references,
  onToggleReference,
  onAddReference,
  isLoading = false,
}: VisualReferencePanelProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("STYLE");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddReference(name.trim(), type);
      setName("");
      setType("STYLE");
      setIsAddOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCount = references.filter((r) => r.selected).length;

  return (
    <>
      <Card variant="subtle" className="p-4 border-[var(--border-strong)] space-y-3.5 select-none">
        <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
              <Images className="h-3.5 w-3.5" />
            </div>
            <CardTitle className="text-xs">VISUAL REFERENCES</CardTitle>
          </div>

          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            {selectedCount}/{references.length} ACTIVE
          </span>
        </CardHeader>

        <CardContent className="p-0 space-y-3">
          {references.length === 0 ? (
            <div className="py-4 text-center space-y-2">
              <p className="text-xs font-bold text-[var(--text-primary)] font-mono">
                NO REFERENCES YET
              </p>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                Add style boards or mood references to guide lighting and framing.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
              {references.map((ref) => (
                <div
                  key={ref.id}
                  onClick={() => onToggleReference(ref.id)}
                  className={`flex items-center justify-between p-2 rounded-[var(--radius-sm)] border text-xs cursor-pointer transition-colors ${
                    ref.selected
                      ? "bg-[var(--surface-2)] border-[var(--accent)]/40 text-[var(--text-primary)]"
                      : "bg-[var(--surface-1)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Checkbox
                      checked={ref.selected}
                      onChange={() => onToggleReference(ref.id)}
                      className="pointer-events-none"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-semibold block truncate text-xs">
                        {ref.name}
                      </span>
                      <span className="font-mono text-[9px] uppercase px-1 rounded bg-[var(--surface-3)] border border-[var(--border)]">
                        {ref.type}
                      </span>
                    </div>
                  </div>

                  {ref.selected && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="w-full justify-center text-xs"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            disabled={isLoading}
          >
            Add Reference Guide
          </Button>
        </CardContent>
      </Card>

      {/* Add Reference Modal */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="ADD VISUAL REFERENCE"
        description="Attach a lighting guide, styling mood, or composition reference."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)] font-mono">
              REFERENCE NAME
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Minimalist Studio Softbox, Architectural Mood"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)] font-mono">
              REFERENCE TYPE
            </label>
            <Select
              value={type}
              onChange={(val) => setType(val)}
              options={[
                { value: "STYLE", label: "Style / Mood Direction" },
                { value: "LIGHTING", label: "Lighting Reference" },
                { value: "COMPOSITION", label: "Framing / Composition" },
                { value: "ENVIRONMENT", label: "Backdrop / Scene" },
                { value: "OTHER", label: "Other Asset Guide" },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<FileText className="h-3.5 w-3.5" />}
            >
              Attach Reference
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
