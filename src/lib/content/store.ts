/**
 * Slots Studio — Content Studio Development Store
 *
 * Ephemeral in-memory development repository for Content Studio outputs.
 * Non-production only; cleanly swappable with PostgreSQL in future phases.
 */

import { type ContentOutput, type ContentRepository } from "./types";

const contentOutputsMap = new Map<string, ContentOutput>(); // key: outputId

class DevContentRepository implements ContentRepository {
  async findOutputsByProjectId(
    workspaceId: string,
    projectId: string
  ): Promise<ContentOutput[]> {
    const results: ContentOutput[] = [];
    for (const output of contentOutputsMap.values()) {
      if (output.workspaceId === workspaceId && output.projectId === projectId) {
        results.push(output);
      }
    }
    return results.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findOutputById(
    workspaceId: string,
    id: string
  ): Promise<ContentOutput | null> {
    const output = contentOutputsMap.get(id);
    if (!output || output.workspaceId !== workspaceId) return null;
    return output;
  }

  async saveOutput(output: ContentOutput): Promise<ContentOutput> {
    contentOutputsMap.set(output.id, output);
    return output;
  }

  async updateOutput(
    workspaceId: string,
    id: string,
    updates: Partial<ContentOutput>
  ): Promise<ContentOutput | null> {
    const existing = await this.findOutputById(workspaceId, id);
    if (!existing) return null;

    const updated: ContentOutput = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    contentOutputsMap.set(id, updated);
    return updated;
  }

  async deleteOutput(workspaceId: string, id: string): Promise<boolean> {
    const existing = await this.findOutputById(workspaceId, id);
    if (!existing) return false;
    return contentOutputsMap.delete(id);
  }
}

export const contentStore: ContentRepository = new DevContentRepository();
