/**
 * Slots Studio — Development-Only Dashboard Fixtures
 *
 * ARCHITECTURAL NOTICE:
 * The data structures below are artificial sample fixtures used strictly for
 * local development preview, component testing, and UI demonstration.
 *
 * They MUST NOT be presented as real operational customer metrics, telemetry,
 * or background job states. The production dashboard service provides truthful
 * empty states until real PostgreSQL database tables and job queues are active.
 */

import { type DashboardData } from "./types";

export const DEV_DASHBOARD_FIXTURES: DashboardData = {
  projects: [
    {
      id: "demo_proj_02481",
      slotId: "SLOT-02481",
      name: "Technical Training Jacket",
      category: "Outerwear",
      status: "In Progress",
      activeStudio: "Visual Studio",
      assetCount: 14,
      updatedAt: "12m ago",
    },
    {
      id: "demo_proj_01192",
      slotId: "SLOT-01192",
      name: "Apex Carbon Footwear",
      category: "Footwear",
      status: "In Review",
      activeStudio: "Product Studio",
      assetCount: 8,
      updatedAt: "2h ago",
    },
  ],
  jobs: [
    {
      id: "demo_job_8821",
      title: "Multi-Angle Visual Studio Render",
      projectName: "Technical Training Jacket",
      studio: "Visual Studio",
      studioCode: "02",
      status: "Running",
      progress: 68,
      startedAt: "3m ago",
    },
  ],
  reviews: [
    {
      id: "demo_rev_02481_b",
      title: "Candidate #02481-B (High Contrast Studio Render)",
      projectName: "Technical Training Jacket",
      studio: "Visual Studio",
      aspectRatio: "1:1",
      status: "Needs Review",
      createdAt: "15m ago",
      metadata: {
        Silhouette: "LOCKED",
        Colorway: "Black / Volt",
      },
    },
  ],
  assets: [
    {
      id: "demo_ast_991",
      name: "Jacket Technical CAD Wireframe",
      projectName: "Technical Training Jacket",
      studio: "Product Studio",
      type: "3D Spec",
      format: "SVG / DXF",
      createdAt: "20m ago",
    },
  ],
  usage: {
    plan: "Workspace Demo Tier",
    period: "Development Preview",
    activeJobsCapacity: "Sample Capacity",
    status: "Inactive",
  },
  activity: [
    {
      id: "demo_act_1",
      type: "job",
      title: "Visual render started for Technical Training Jacket",
      timestamp: "3m ago",
      detail: "Visual Studio — Key Studio Softbox pass initiated",
    },
  ],
};
