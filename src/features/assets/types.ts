/**
 * Slots Studio — Assets Feature UI Types
 */

import { type AssetType, type AssetSource, type AssetStatus } from "@/lib/assets/types";

export type AssetViewMode = "grid" | "list";

export interface AssetFilterState {
  search: string;
  projectId: string;
  assetType: AssetType | "ALL";
  source: AssetSource | "ALL";
  status: AssetStatus | "ALL";
  includeArchived: boolean;
}
