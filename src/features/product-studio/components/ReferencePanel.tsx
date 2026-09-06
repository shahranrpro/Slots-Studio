"use client";

import React, { useState } from "react";
import { type ProductReference, type ReferenceType } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Plus, Trash2 } from "lucide-react";

export interface ReferencePanelProps {
  references: ProductReference[];
  onAddReference: (input: { name: string; type: ReferenceType; value: string; notes?: string }) => Promise<void>;
  onRemoveReference: (id: string) => Promise<void>;
}

const REFERENCE_TYPES: { label: string; value: ReferenceType }[] = [
  { label: "Style / Silhouette", value: "STYLE" },
  { label: "Material Spec", value: "MATERIAL" },
  { label: "Color Target", value: "COLOR" },
  { label: "Product Benchmark", value: "PRODUCT" },
  { label: "Logo / Brand Mark", value: "LOGO" },
  { label: "Other Reference", value: "OTHER" },
];

export function ReferencePanel({
  references,
  onAddReference,
  onRemoveReference,
}: ReferencePanelProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<ReferenceType>("STYLE");
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddReference({
        name: name.trim(),
        type,
        value: value.trim() || name.trim(),
      });
      setName("");
      setValue("");
      setShowAddModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="subtle" className="border-[var(--border-strong)] p-5 space-y-4 select-none">
      <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-3">
        <CardTitle className="text-sm">REFERENCES</CardTitle>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddModal(!showAddModal)}
          leftIcon={<Plus className="h-3.5 w-3.5" />}
          className="text-xs"
        >
          Add Reference
        </Button>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {/* Quick Add Form */}
        {showAddModal && (
          <form
            onSubmit={handleSubmit}
            className="p-3.5 rounded-[var(--radius-md)] border border-[var(--accent)]/40 bg-[var(--surface-2)] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[var(--accent)]">
                NEW REFERENCE ATTACHMENT
              </span>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <FormField label="Reference Title" required>
                <Input
                  placeholder="e.g. Matte bonded seam reference"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Reference Type" required>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ReferenceType)}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] p-2 text-xs text-[var(--text-primary)] focus:outline-none"
                >
                  {REFERENCE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                Attach Reference
              </Button>
            </div>
          </form>
        )}

        {/* References List / Empty State */}
        {references.length === 0 ? (
          <div className="py-6 text-center space-y-1.5">
            <p className="text-xs font-bold text-[var(--text-primary)] font-mono">NO REFERENCES YET</p>
            <p className="text-[11px] text-[var(--text-muted)] max-w-xs mx-auto">
              Add a product, style, material, color, or visual reference to guide the concept.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {references.map((ref) => (
              <div
                key={ref.id}
                className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div>
                    <span className="font-mono text-[9px] font-bold text-[var(--accent)] uppercase tracking-wider">
                      {ref.type}
                    </span>
                  </div>
                  <p className="font-bold text-[var(--text-primary)] truncate">
                    {ref.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveReference(ref.id)}
                  className="p-1 rounded text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--surface-3)] transition-colors cursor-pointer"
                  title="Remove reference"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
