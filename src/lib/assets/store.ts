/**
 * Slots Studio — Asset Repository Implementation (Development Only)
 *
 * ARCHITECTURAL NOTICE:
 * This repository manages assets in memory during development.
 * It is EXPLICITLY NON-PRODUCTION and will be replaced with PostgreSQL
 * and S3/R2 Object Storage in upcoming tasks.
 */

import {
  type Asset,
  type AssetFiltersInput,
  type AssetRepository,
} from "./types";

const globalForAssets = globalThis as unknown as {
  assetsMap?: Map<string, Asset>;
};

const assetsMap = globalForAssets.assetsMap || new Map<string, Asset>();
if (process.env.NODE_ENV !== "production") globalForAssets.assetsMap = assetsMap;

class InMemoryAssetRepository implements AssetRepository {
  private assets: Map<string, Asset> = assetsMap;

  async findMany(workspaceId: string, filters?: AssetFiltersInput): Promise<Asset[]> {
    let list = Array.from(this.assets.values()).filter(
      (a) => a.workspaceId === workspaceId || a.workspaceId === "ws_dev_seed"
    );

    // Filter out archived unless specifically requested or status filter is ARCHIVED
    if (!filters?.includeArchived && filters?.status !== "ARCHIVED") {
      list = list.filter((a) => a.status !== "ARCHIVED");
    }

    if (filters?.projectId) {
      list = list.filter((a) => a.projectId === filters.projectId);
    }

    if (filters?.assetType) {
      list = list.filter((a) => a.assetType === filters.assetType);
    }

    if (filters?.source) {
      list = list.filter((a) => a.source === filters.source);
    }

    if (filters?.status) {
      list = list.filter((a) => a.status === filters.status);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter((a) =>
        a.name.toLowerCase().includes(q) ||
        (a.projectName && a.projectName.toLowerCase().includes(q)) ||
        (a.slotCode && a.slotCode.toLowerCase().includes(q)) ||
        a.assetType.toLowerCase().includes(q)
      );
    }

    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findById(workspaceId: string, id: string): Promise<Asset | null> {
    const asset = this.assets.get(id);
    if (!asset || (asset.workspaceId !== workspaceId && asset.workspaceId !== "ws_dev_seed")) {
      return null;
    }
    return asset;
  }

  async create(asset: Asset): Promise<Asset> {
    this.assets.set(asset.id, asset);
    return asset;
  }

  async update(
    workspaceId: string,
    id: string,
    updates: Partial<Asset>
  ): Promise<Asset | null> {
    const existing = await this.findById(workspaceId, id);
    if (!existing) return null;

    const updated: Asset = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.assets.set(id, updated);
    return updated;
  }

  async delete(workspaceId: string, id: string): Promise<boolean> {
    const existing = await this.findById(workspaceId, id);
    if (!existing) return false;
    return this.assets.delete(id);
  }
}

export const assetStore = new InMemoryAssetRepository();
