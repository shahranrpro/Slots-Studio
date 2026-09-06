"use client";

import React from "react";
import { type JobStatus } from "@/lib/jobs/types";
import { Badge } from "@/components/ui/Badge";

export interface JobStatusProps {
  status: JobStatus;
  className?: string;
}

export function JobStatusBadge({ status, className }: JobStatusProps) {
  switch (status) {
    case "RUNNING":
      return (
        <Badge variant="accent" dot className={className}>
          RUNNING
        </Badge>
      );
    case "REVIEW":
      return (
        <Badge variant="warning" dot className={className}>
          NEEDS REVIEW
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge variant="success" dot className={className}>
          COMPLETED
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="danger" className={className}>
          FAILED
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge variant="outline" className={className}>
          CANCELLED
        </Badge>
      );
    case "QUEUED":
    default:
      return (
        <Badge variant="outline" className={className}>
          QUEUED
        </Badge>
      );
  }
}
