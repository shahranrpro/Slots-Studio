"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";
import { type Project, type ProjectCategory } from "@/lib/projects/types";

export interface ProjectEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onProjectUpdated: (updated: Project) => void;
}

const CATEGORIES: { label: string; value: ProjectCategory }[] = [
  { label: "Product", value: "PRODUCT" },
  { label: "Collection", value: "COLLECTION" },
  { label: "Campaign", value: "CAMPAIGN" },
  { label: "Brand Asset", value: "BRAND_ASSET" },
  { label: "Other", value: "OTHER" },
];

export function ProjectEditDialog({
  isOpen,
  onClose,
  project,
  onProjectUpdated,
}: ProjectEditDialogProps) {
  const [name, setName] = useState(project.name);
  const [category, setCategory] = useState<ProjectCategory>(project.category);
  const [description, setDescription] = useState(project.description);
  const [targetAudience, setTargetAudience] = useState(project.context.targetAudience || "");
  const [visualDirection, setVisualDirection] = useState(project.context.visualDirection || "");
  const [notes, setNotes] = useState(project.context.notes || "");
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
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category,
          description: description.trim(),
          context: {
            targetAudience: targetAudience.trim(),
            visualDirection: visualDirection.trim(),
            notes: notes.trim(),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "Failed to update project.");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onProjectUpdated(data.data);
      onClose();
    } catch {
      setErrorMessage("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Project ${project.slotCode}`}
      description="Update brief parameters and design intent for this project slot."
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {errorMessage && <FormError message={errorMessage} />}

        <FormField label="Project Name" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
          />
        </FormField>

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

        <FormField label="Concept Description">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            rows={3}
          />
        </FormField>

        <FormField label="Target Audience">
          <Input
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        <FormField label="Visual Direction">
          <Input
            value={visualDirection}
            onChange={(e) => setVisualDirection(e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        <FormField label="Creative Notes">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading}
            rows={2}
          />
        </FormField>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
