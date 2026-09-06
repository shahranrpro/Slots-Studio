"use client";

import React, { useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, Building2, Globe } from "lucide-react";
import { generateWorkspaceSlug } from "@/lib/workspace/utils";

export interface WorkspaceSetupProps {
  initialName?: string;
  onBack: () => void;
  onSuccess: (workspaceName: string) => void;
}

export function WorkspaceSetup({
  initialName = "",
  onBack,
  onSuccess,
}: WorkspaceSetupProps) {
  const [name, setName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = generateWorkspaceSlug(name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError("Workspace name must be at least 2 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to create workspace.");
        setIsLoading(false);
        return;
      }

      onSuccess(data.data.workspace.name);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Eyebrow & Title */}
      <div className="space-y-2">
        <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent)]">
          STEP 2 OF 4 • WORKSPACE
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          CREATE YOUR WORKSPACE
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          Give your workspace a name so your projects have a home.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Workspace Name */}
        <FormField
          label="Workspace Name"
          htmlFor="workspace-name"
          description="You can invite team members and add more workspaces later."
          error={error || undefined}
          required
        >
          <Input
            id="workspace-name"
            name="workspaceName"
            type="text"
            required
            autoFocus
            placeholder="e.g. Apex Design Studio or Acme Corp"
            leftIcon={<Building2 className="h-4 w-4" />}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        {/* Live URL Slug Preview */}
        <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-3 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[11px] uppercase font-mono">
            <Globe className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>Workspace Slug Preview</span>
          </div>
          <p className="font-mono text-[var(--text-secondary)] truncate">
            slots.studio/
            <span className="text-[var(--accent)] font-semibold">
              {slug || "your-workspace"}
            </span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onBack}
            disabled={isLoading}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Create & Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
