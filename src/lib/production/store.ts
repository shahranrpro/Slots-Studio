/**
 * Slots Studio — Ephemeral Development Production Repository
 *
 * Provides in-memory storage for manufacturing Tech Packs and version lineage.
 * Follows the abstract repository pattern, cleanly decoupled from UI components.
 */

import { type TechPack } from "./types";

const globalForProduction = globalThis as unknown as {
  techPacksMap?: Map<string, TechPack>;
};

const techPacksMap = globalForProduction.techPacksMap || new Map<string, TechPack>();
if (process.env.NODE_ENV !== "production") globalForProduction.techPacksMap = techPacksMap;

export interface ProductionRepository {
  createTechPack(techPack: TechPack): Promise<TechPack>;
  findTechPackById(workspaceId: string, id: string): Promise<TechPack | null>;
  findTechPacksByProjectId(workspaceId: string, projectId: string): Promise<TechPack[]>;
  updateTechPack(workspaceId: string, id: string, updates: Partial<TechPack>): Promise<TechPack | null>;
  deleteTechPack(workspaceId: string, id: string): Promise<boolean>;
}

export class DevProductionRepository implements ProductionRepository {
  async createTechPack(techPack: TechPack): Promise<TechPack> {
    techPacksMap.set(techPack.id, techPack);
    return techPack;
  }

  async findTechPackById(workspaceId: string, id: string): Promise<TechPack | null> {
    const techPack = techPacksMap.get(id);
    if (!techPack || (techPack.workspaceId !== workspaceId && techPack.workspaceId !== "ws_dev_seed")) {
      return null;
    }
    return techPack;
  }

  async findTechPacksByProjectId(workspaceId: string, projectId: string): Promise<TechPack[]> {
    const list: TechPack[] = [];
    for (const tp of techPacksMap.values()) {
      if (tp.projectId === projectId && (tp.workspaceId === workspaceId || tp.workspaceId === "ws_dev_seed")) {
        list.push(tp);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateTechPack(
    workspaceId: string,
    id: string,
    updates: Partial<TechPack>
  ): Promise<TechPack | null> {
    const existing = await this.findTechPackById(workspaceId, id);
    if (!existing) return null;

    const updated: TechPack = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    techPacksMap.set(id, updated);
    return updated;
  }

  async deleteTechPack(workspaceId: string, id: string): Promise<boolean> {
    const existing = await this.findTechPackById(workspaceId, id);
    if (!existing) return false;
    techPacksMap.delete(id);
    return true;
  }
}

export const productionStore = new DevProductionRepository();
