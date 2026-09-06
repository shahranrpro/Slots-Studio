"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";
import { type ProjectCategory, type Project } from "@/lib/projects/types";
import { Plus } from "lucide-react";

export interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (project: Project) => void;
}

const CATEGORIES: { label: string; value: ProjectCategory }[] = [
  { label: "Product (Apparel, Footwear, Hardgoods)", value: "PRODUCT" },
  { label: "Collection (Multi-Product Seasonal Line)", value: "COLLECTION" },
  { label: "Campaign (Editorial, Ad Kit, Lookbook)", value: "CAMPAIGN" },
  { label: "Brand Asset (Identity, Typography, 3D)", value: "BRAND_ASSET" },
  { label: "Other Creative Concept", value: "OTHER" },
];

export function CreateProjectDialog({
  isOpen,
  onClose,
  onProjectCreated,
}: CreateProjectDialogProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("PRODUCT");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [visualDirection, setVisualDirection] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Please enter a project name.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category,
          description: description.trim(),
          targetAudience: targetAudience.trim(),
          visualDirection: visualDirection.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "Failed to create project.");
        setIsLoading(false);
        return;
      }

      // Reset form
      setName("");
      setDescription("");
      setTargetAudience("");
      setVisualDirection("");
      setIsLoading(false);
      onClose();

      if (onProjectCreated) {
        onProjectCreated(data.data);
      }

      router.push(`/app/projects/${data.data.id}`);
      router.refresh();
    } catch {
      setErrorMessage("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project Slot"
      description="Establish unified product context that will automatically flow across all 5 studios."
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {errorMessage && <FormError message={errorMessage} />}

        {/* Project Name */}
        <FormField label="Project Name" required>
          <Input
            placeholder="e.g. Technical Training Jacket"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
            autoFocus
          />
        </FormField>

        {/* Category Select */}
        <FormField label="Project Category" required>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProjectCategory)}
            disabled={isLoading}
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] p-2.5 text-xs text-[var(--text-primary)] transition-colors focus:border-[var(--border-strong)] focus:outline-2 focus:outline-[var(--accent)]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </FormField>

        {/* Short Description */}
        <FormField label="Concept Description">
          <Textarea
            placeholder="Briefly describe the silhouette, materials, and creative intent..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            rows={3}
          />
        </FormField>

        {/* Optional Visual Direction */}
        <FormField label="Visual & Styling Direction">
          <Input
            placeholder="e.g. Minimalist athletic, matte black, high contrast"
            value={visualDirection}
            onChange={(e) => setVisualDirection(e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        {/* Dialog Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Create Project Slot
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
