"use client";

import React, { useState, useMemo, useRef } from "react";
import { type Asset } from "@/lib/assets/types";
import { type Project } from "@/lib/projects/types";
import { type AssetFilterState, type AssetViewMode } from "../types";
import { AssetToolbar } from "./AssetToolbar";
import { AssetGrid } from "./AssetGrid";
import { AssetList } from "./AssetList";
import { AssetViewer } from "./AssetViewer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Upload } from "lucide-react";

export interface AssetLibraryProps {
  initialAssets: Asset[];
  projects?: Project[];
}

export function AssetLibrary({
  initialAssets = [],
  projects = [],
}: AssetLibraryProps) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [viewMode, setViewMode] = useState<AssetViewMode>("grid");
  const [activeAsset, setActiveAsset] = useState<Asset | null>(null);

  const [filters, setFilters] = useState<AssetFilterState>({
    search: "",
    projectId: "ALL",
    assetType: "ALL",
    source: "ALL",
    status: "ALL",
    includeArchived: false,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (filters.projectId !== "ALL") {
        formData.append("projectId", filters.projectId);
      }

      const res = await fetch("/api/assets", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setAssets((prev) => [json.data, ...prev]);
      } else {
        setUploadError(json.error || "Failed to upload file.");
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload error.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFilterChange = (partial: Partial<AssetFilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleFilterReset = () => {
    setFilters({
      search: "",
      projectId: "ALL",
      assetType: "ALL",
      source: "ALL",
      status: "ALL",
      includeArchived: false,
    });
  };

  // Client-side filtering
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Archive filter
      if (filters.status === "ARCHIVED") {
        if (asset.status !== "ARCHIVED") return false;
      } else if (!filters.includeArchived && asset.status === "ARCHIVED") {
        return false;
      }

      // Status filter
      if (filters.status !== "ALL" && filters.status !== "ARCHIVED") {
        if (asset.status !== filters.status) return false;
      }

      // Project filter
      if (filters.projectId !== "ALL" && asset.projectId !== filters.projectId) {
        return false;
      }

      // Asset type filter
      if (filters.assetType !== "ALL" && asset.assetType !== filters.assetType) {
        return false;
      }

      // Source filter
      if (filters.source !== "ALL" && asset.source !== filters.source) {
        return false;
      }

      // Search query
      if (filters.search.trim()) {
        const q = filters.search.trim().toLowerCase();
        const matchesName = asset.name.toLowerCase().includes(q);
        const matchesProject = asset.projectName?.toLowerCase().includes(q);
        const matchesSlot = asset.slotCode?.toLowerCase().includes(q);
        const matchesType = asset.assetType.toLowerCase().includes(q);
        if (!matchesName && !matchesProject && !matchesSlot && !matchesType) {
          return false;
        }
      }

      return true;
    });
  }, [assets, filters]);

  const isFiltered =
    filters.assetType !== "ALL" ||
    filters.source !== "ALL" ||
    filters.status !== "ALL" ||
    filters.projectId !== "ALL" ||
    Boolean(filters.search);

  const handleDownload = (asset: Asset) => {
    const link = document.createElement("a");
    link.href = `/api/assets/${asset.id}/download`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleArchive = async (asset: Asset) => {
    try {
      const response = await fetch(`/api/assets/${asset.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setAssets((prev) =>
          prev.map((a) =>
            a.id === asset.id
              ? { ...a, status: "ARCHIVED" as const, archivedAt: new Date().toISOString() }
              : a
          )
        );
      }
    } catch (err) {
      console.error("Failed to archive asset:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="space-y-1">
          <Badge variant="accent" dot>
            CENTRAL ASSET REPOSITORY
          </Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            ASSETS
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Browse, search, inspect, and organize workspace creative assets and concept renders.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".png,.jpg,.jpeg,.webp,.svg,.gif,.pdf,.md,.txt,.json,.csv"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            leftIcon={<Upload className="h-4 w-4" />}
          >
            {isUploading ? "Uploading..." : "Upload Asset"}
          </Button>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 rounded-[var(--radius-md)] bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-between">
          <span>{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="hover:underline ml-2 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Toolbar */}
      <AssetToolbar
        filters={filters}
        projects={projects}
        totalCount={filteredAssets.length}
        viewMode={viewMode}
        onFilterChange={handleFilterChange}
        onFilterReset={handleFilterReset}
        onViewModeChange={setViewMode}
      />

      {/* Main View: Grid or List */}
      {viewMode === "grid" ? (
        <AssetGrid
          assets={filteredAssets}
          isFiltered={isFiltered}
          onOpen={setActiveAsset}
          onDownload={handleDownload}
          onArchive={handleArchive}
        />
      ) : (
        <AssetList
          assets={filteredAssets}
          isFiltered={isFiltered}
          onOpen={setActiveAsset}
          onDownload={handleDownload}
          onArchive={handleArchive}
        />
      )}

      {/* Modal Inspector */}
      <AssetViewer
        asset={activeAsset}
        isOpen={Boolean(activeAsset)}
        onClose={() => setActiveAsset(null)}
        onDownload={handleDownload}
        onArchive={handleArchive}
      />
    </div>
  );
}
