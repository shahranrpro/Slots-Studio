import { type Campaign, type CampaignOutput } from "./types";

const globalForCampaigns = globalThis as unknown as {
  campaignsMap?: Map<string, Campaign>;
  campaignOutputsMap?: Map<string, CampaignOutput>;
};

const campaignsMap = globalForCampaigns.campaignsMap || new Map<string, Campaign>();
if (process.env.NODE_ENV !== "production") globalForCampaigns.campaignsMap = campaignsMap;

const outputsMap = globalForCampaigns.campaignOutputsMap || new Map<string, CampaignOutput>();
if (process.env.NODE_ENV !== "production") globalForCampaigns.campaignOutputsMap = outputsMap;

export interface CampaignRepository {
  createCampaign(campaign: Campaign): Promise<Campaign>;
  findCampaignById(workspaceId: string, id: string): Promise<Campaign | null>;
  findCampaignsByProjectId(workspaceId: string, projectId: string): Promise<Campaign[]>;
  updateCampaign(workspaceId: string, id: string, updates: Partial<Campaign>): Promise<Campaign | null>;
  deleteCampaign(workspaceId: string, id: string): Promise<boolean>;

  saveOutput(output: CampaignOutput): Promise<CampaignOutput>;
  saveOutputs(outputs: CampaignOutput[]): Promise<CampaignOutput[]>;
  findOutputById(workspaceId: string, id: string): Promise<CampaignOutput | null>;
  findOutputsByCampaignId(workspaceId: string, campaignId: string): Promise<CampaignOutput[]>;
  findOutputsByProjectId(workspaceId: string, projectId: string): Promise<CampaignOutput[]>;
  updateOutput(workspaceId: string, id: string, updates: Partial<CampaignOutput>): Promise<CampaignOutput | null>;
  deleteOutput(workspaceId: string, id: string): Promise<boolean>;
}

class DevCampaignRepository implements CampaignRepository {
  async createCampaign(campaign: Campaign): Promise<Campaign> {
    campaignsMap.set(campaign.id, campaign);
    return campaign;
  }

  async findCampaignById(workspaceId: string, id: string): Promise<Campaign | null> {
    const campaign = campaignsMap.get(id);
    if (!campaign || (campaign.workspaceId !== workspaceId && campaign.workspaceId !== "ws_dev_seed")) return null;
    return campaign;
  }

  async findCampaignsByProjectId(workspaceId: string, projectId: string): Promise<Campaign[]> {
    const list: Campaign[] = [];
    for (const c of campaignsMap.values()) {
      if (c.projectId === projectId && (c.workspaceId === workspaceId || c.workspaceId === "ws_dev_seed")) {
        list.push(c);
      }
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async updateCampaign(workspaceId: string, id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    const existing = await this.findCampaignById(workspaceId, id);
    if (!existing) return null;

    const updated: Campaign = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    campaignsMap.set(id, updated);
    return updated;
  }

  async deleteCampaign(workspaceId: string, id: string): Promise<boolean> {
    const existing = await this.findCampaignById(workspaceId, id);
    if (!existing) return false;
    campaignsMap.delete(id);
    return true;
  }

  async saveOutput(output: CampaignOutput): Promise<CampaignOutput> {
    outputsMap.set(output.id, output);
    return output;
  }

  async saveOutputs(outputs: CampaignOutput[]): Promise<CampaignOutput[]> {
    for (const out of outputs) {
      outputsMap.set(out.id, out);
    }
    return outputs;
  }

  async findOutputById(workspaceId: string, id: string): Promise<CampaignOutput | null> {
    const out = outputsMap.get(id);
    if (!out || (out.workspaceId !== workspaceId && out.workspaceId !== "ws_dev_seed")) return null;
    return out;
  }

  async findOutputsByCampaignId(workspaceId: string, campaignId: string): Promise<CampaignOutput[]> {
    const list: CampaignOutput[] = [];
    for (const out of outputsMap.values()) {
      if (out.campaignId === campaignId && (out.workspaceId === workspaceId || out.workspaceId === "ws_dev_seed")) {
        list.push(out);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findOutputsByProjectId(workspaceId: string, projectId: string): Promise<CampaignOutput[]> {
    const list: CampaignOutput[] = [];
    for (const out of outputsMap.values()) {
      if (out.projectId === projectId && (out.workspaceId === workspaceId || out.workspaceId === "ws_dev_seed")) {
        list.push(out);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateOutput(workspaceId: string, id: string, updates: Partial<CampaignOutput>): Promise<CampaignOutput | null> {
    const existing = await this.findOutputById(workspaceId, id);
    if (!existing) return null;

    const updated: CampaignOutput = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    outputsMap.set(id, updated);
    return updated;
  }

  async deleteOutput(workspaceId: string, id: string): Promise<boolean> {
    const existing = await this.findOutputById(workspaceId, id);
    if (!existing) return false;
    outputsMap.delete(id);
    return true;
  }
}

export const campaignStore = new DevCampaignRepository();
