import React from "react";
import { Badge } from "@/components/ui/Badge";
import { type WorkspaceRole } from "@/lib/billing/types";

export interface RoleBadgeProps {
  role: WorkspaceRole;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  switch (role) {
    case "OWNER":
      return <Badge variant="success">OWNER</Badge>;
    case "ADMIN":
      return <Badge variant="accent">ADMIN</Badge>;
    case "EDITOR":
      return <Badge variant="default">EDITOR</Badge>;
    case "REVIEWER":
      return <Badge variant="outline">REVIEWER</Badge>;
    case "VIEWER":
      return <Badge variant="outline">VIEWER</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
}
