"use client";

import React, { useState } from "react";
import { type ProductBriefData } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/ui/FormField";
import { FormSuccess } from "@/components/ui/FormSuccess";
import { FormError } from "@/components/ui/FormError";
import { Save, Plus, X } from "lucide-react";

export interface ProductBriefProps {
  initialBrief: ProductBriefData;
  onSaveBrief: (brief: ProductBriefData) => Promise<boolean>;
}

const CATEGORIES = [
  { label: "Apparel", value: "APPAREL" },
  { label: "Sportswear", value: "SPORTSWEAR" },
  { label: "Outerwear", value: "OUTERWEAR" },
  { label: "Accessories", value: "ACCESSORIES" },
  { label: "Equipment", value: "EQUIPMENT" },
  { label: "Other", value: "OTHER" },
];

export function ProductBrief({ initialBrief, onSaveBrief }: ProductBriefProps) {
  const [brief, setBrief] = useState<ProductBriefData>(initialBrief);
  const [newColor, setNewColor] = useState("");
  const [newMaterial, setNewMaterial] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    const success = await onSaveBrief(brief);
    setIsSaving(false);

    if (success) {
      setStatusMessage({ type: "success", text: "Product context saved and locked." });
      setTimeout(() => setStatusMessage(null), 3500);
    } else {
      setStatusMessage({ type: "error", text: "Failed to save brief parameters." });
    }
  };

  const addColor = () => {
    if (newColor.trim() && !brief.colors.includes(newColor.trim())) {
      setBrief((prev) => ({ ...prev, colors: [...prev.colors, newColor.trim()] }));
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setBrief((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== color) }));
  };

  const addMaterial = () => {
    if (newMaterial.trim() && !brief.materials.includes(newMaterial.trim())) {
      setBrief((prev) => ({ ...prev, materials: [...prev.materials, newMaterial.trim()] }));
      setNewMaterial("");
    }
  };

  const removeMaterial = (material: string) => {
    setBrief((prev) => ({ ...prev, materials: prev.materials.filter((m) => m !== material) }));
  };

  return (
    <Card variant="subtle" className="border-[var(--border-strong)] p-5 space-y-4 select-none">
      <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-3">
        <CardTitle className="text-sm">PRODUCT BRIEF & CONTEXT</CardTitle>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          CANONICAL CONTEXT
        </span>
      </CardHeader>

      <CardContent className="p-0">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {statusMessage?.type === "success" && <FormSuccess message={statusMessage.text} />}
          {statusMessage?.type === "error" && <FormError message={statusMessage.text} />}

          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Product Name" required>
              <Input
                value={brief.name}
                onChange={(e) => setBrief((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </FormField>

            <FormField label="Category" required>
              <select
                value={brief.category.toUpperCase()}
                onChange={(e) => setBrief((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] p-2 text-xs text-[var(--text-primary)] transition-colors focus:border-[var(--border-strong)] focus:outline-2 focus:outline-[var(--accent)] cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          {/* Description */}
          <FormField label="Concept Description" required>
            <Textarea
              value={brief.description}
              onChange={(e) => setBrief((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Outline the silhouette, purpose, and key functional requirements..."
              required
            />
          </FormField>

          {/* Target User & Visual Direction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Target User">
              <Input
                placeholder="e.g. Urban commuter, performance runner"
                value={brief.targetUser}
                onChange={(e) => setBrief((prev) => ({ ...prev, targetUser: e.target.value }))}
              />
            </FormField>

            <FormField label="Visual & Styling Direction">
              <Input
                placeholder="e.g. Technical minimalism, matte textures"
                value={brief.visualDirection}
                onChange={(e) => setBrief((prev) => ({ ...prev, visualDirection: e.target.value }))}
              />
            </FormField>
          </div>

          {/* Color Palette Tags */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              Color Palette
            </span>
            <div className="flex flex-wrap items-center gap-1.5 min-h-[32px] p-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)]">
              {brief.colors.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 rounded bg-[var(--surface-3)] px-2 py-0.5 text-[10px] font-mono text-[var(--text-primary)] border border-[var(--border)]"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-black/20"
                    style={{ backgroundColor: c }}
                  />
                  <span>{c}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(c)}
                    className="text-[var(--text-muted)] hover:text-red-400 cursor-pointer"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Add color / hex..."
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addColor();
                    }
                  }}
                  className="h-6 w-28 rounded bg-transparent px-1 text-[11px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                />
                {newColor && (
                  <button
                    type="button"
                    onClick={addColor}
                    className="p-0.5 rounded text-[var(--accent)] hover:bg-[var(--surface-2)] cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Materials Tags */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              Materials & Fabrication
            </span>
            <div className="flex flex-wrap items-center gap-1.5 min-h-[32px] p-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)]">
              {brief.materials.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1 rounded bg-[var(--surface-3)] px-2 py-0.5 text-[10px] font-mono text-[var(--text-primary)] border border-[var(--border)]"
                >
                  <span>{m}</span>
                  <button
                    type="button"
                    onClick={() => removeMaterial(m)}
                    className="text-[var(--text-muted)] hover:text-red-400 cursor-pointer"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Add material..."
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addMaterial();
                    }
                  }}
                  className="h-6 w-32 rounded bg-transparent px-1 text-[11px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                />
                {newMaterial && (
                  <button
                    type="button"
                    onClick={addMaterial}
                    className="p-0.5 rounded text-[var(--accent)] hover:bg-[var(--surface-2)] cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              leftIcon={<Save className="h-3.5 w-3.5" />}
            >
              Lock Context
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
