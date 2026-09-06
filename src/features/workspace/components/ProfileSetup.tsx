"use client";

import React, { useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { User, Mail } from "lucide-react";

export interface ProfileSetupProps {
  initialName?: string;
  email?: string;
  onSave?: (name: string) => void;
}

export function ProfileSetup({ initialName = "", email = "", onSave }: ProfileSetupProps) {
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    if (onSave) onSave(name);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Full Name" htmlFor="profile-name" required>
        <Input
          id="profile-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<User className="h-4 w-4" />}
          placeholder="Your full name"
        />
      </FormField>

      <FormField label="Email Address (Locked)" htmlFor="profile-email">
        <Input
          id="profile-email"
          name="email"
          type="email"
          value={email}
          disabled
          leftIcon={<Mail className="h-4 w-4" />}
        />
      </FormField>

      <div className="flex items-center justify-between pt-2">
        {saved && (
          <span className="text-xs font-medium text-emerald-400">
            Profile saved
          </span>
        )}
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          isLoading={isSaving}
          className="ml-auto"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
