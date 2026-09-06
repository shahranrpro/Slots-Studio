"use client";

import React, { useState } from "react";
import { type Project, type ProjectStatus } from "@/lib/projects/types";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectTabs } from "./ProjectTabs";
import { ProjectEditDialog } from "./ProjectEditDialog";

export interface ProjectDetailViewProps {
  initialProject: Project;
}

export function ProjectDetailView({ initialProject }: ProjectDetailViewProps) {
  const [project, setProject] = useState<Project>(initialProject);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    const response = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await response.json();
    if (data.success && data.data) {
      setProject(data.data);
    }
  };

  const handleArchive = async () => {
    const response = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ARCHIVED" }),
    });
    const data = await response.json();
    if (data.success && data.data) {
      setProject(data.data);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto select-none">
      {/* Project Header */}
      <ProjectHeader
        project={project}
        onEditClick={() => setIsEditOpen(true)}
        onStatusChange={handleStatusChange}
        onArchive={handleArchive}
      />

      {/* Project Tabs & Context Workstation */}
      <ProjectTabs project={project} />

      {/* Edit Project Dialog */}
      <ProjectEditDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        project={project}
        onProjectUpdated={setProject}
      />
    </div>
  );
}
