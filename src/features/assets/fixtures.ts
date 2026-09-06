/**
 * Slots Studio — Assets Development Fixtures
 *
 * ARCHITECTURAL NOTICE:
 * These fixtures provide sample multi-media asset records for UI development,
 * testing, and layout demonstration across various asset types.
 */

import { type Asset } from "@/lib/assets/types";

export const DEV_ASSET_FIXTURES: Asset[] = [
  {
    id: "asset_dev_01",
    workspaceId: "ws_dev_sample",
    projectId: "proj_sample_01",
    projectName: "Technical Training Jacket",
    slotCode: "SS-02481",
    name: "AeroShell Jacket — Concept Silhouette Alpha",
    assetType: "DESIGN",
    mimeType: "image/svg+xml",
    storageKey: "dev/concepts/aeroshell_alpha.svg",
    previewSvg: `
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-[var(--accent)] stroke-current">
        <path d="M60 40 L85 30 L100 45 L115 30 L140 40 L165 75 L145 90 L135 70 L135 170 L65 170 L65 70 L55 90 L35 75 Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" fill-opacity="0.06"/>
        <path d="M100 45 L100 170" stroke-width="1.5" stroke-dasharray="4 4" stroke-opacity="0.6"/>
        <line x1="75" y1="120" x2="95" y2="120" stroke-width="1.5"/>
        <line x1="105" y1="120" x2="125" y2="120" stroke-width="1.5"/>
      </svg>
    `,
    width: 2048,
    height: 2048,
    sizeBytes: 148200,
    source: "AI_GENERATED",
    status: "APPROVED",
    metadata: {
      studio: "Product Studio",
      candidateCode: "CANDIDATE-01",
      materials: ["Technical Ripstop Nylon", "Bonded Seams"],
    },
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "asset_dev_02",
    workspaceId: "ws_dev_sample",
    projectId: "proj_sample_01",
    projectName: "Technical Training Jacket",
    slotCode: "SS-02481",
    name: "Bonded Seam & Zipper Spec Reference",
    assetType: "REFERENCE",
    mimeType: "image/svg+xml",
    storageKey: "dev/references/bonded_seam.svg",
    previewSvg: `
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-[var(--accent)] stroke-current">
        <rect x="50" y="50" width="100" height="120" rx="16" stroke-width="2" fill="currentColor" fill-opacity="0.06"/>
        <path d="M75 50 C75 35 125 35 125 50" stroke-width="2" stroke-linecap="round"/>
        <line x1="50" y1="90" x2="150" y2="90" stroke-width="1.5"/>
        <rect x="65" y="110" width="70" height="40" rx="6" stroke-width="1.5" stroke-dasharray="4 4"/>
      </svg>
    `,
    width: 1920,
    height: 1080,
    sizeBytes: 84300,
    source: "UPLOAD",
    status: "REVIEW",
    metadata: {
      category: "MATERIAL",
      targetSeam: "Shoulder & Hood Transition",
    },
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: "asset_dev_03",
    workspaceId: "ws_dev_sample",
    projectId: "proj_sample_02",
    projectName: "Velocity Running Shoe",
    slotCode: "SS-00101",
    name: "Carbon Plate Outsole Geometry",
    assetType: "DESIGN",
    mimeType: "image/svg+xml",
    storageKey: "dev/concepts/velocity_outsole.svg",
    previewSvg: `
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-[var(--accent)] stroke-current">
        <path d="M30 140 C50 145 130 145 170 135 C175 125 170 100 145 85 C130 75 110 70 100 80 C90 90 85 100 65 105 C45 110 35 120 30 140 Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" fill-opacity="0.06"/>
        <path d="M25 145 L175 140 C175 148 165 155 140 155 L40 155 C30 155 25 150 25 145 Z" stroke-width="2" fill="currentColor" fill-opacity="0.12"/>
      </svg>
    `,
    width: 2048,
    height: 2048,
    sizeBytes: 192000,
    source: "AI_GENERATED",
    status: "REVIEW",
    metadata: {
      studio: "Product Studio",
      candidateCode: "CANDIDATE-02",
    },
    createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 16).toISOString(),
  },
  {
    id: "asset_dev_04",
    workspaceId: "ws_dev_sample",
    projectId: "proj_sample_01",
    projectName: "Technical Training Jacket",
    slotCode: "SS-02481",
    name: "Factory Technical Specification Pack",
    assetType: "DOCUMENT",
    mimeType: "application/pdf",
    storageKey: "dev/docs/tech_pack_ss02481.pdf",
    sizeBytes: 524288,
    source: "UPLOAD",
    status: "APPROVED",
    metadata: {
      pages: 12,
      specStandard: "ISO-13688",
    },
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "asset_dev_05",
    workspaceId: "ws_dev_sample",
    projectId: "proj_sample_02",
    projectName: "Velocity Running Shoe",
    slotCode: "SS-00101",
    name: "Outsole 360 Turntable Motion Render",
    assetType: "VIDEO",
    mimeType: "video/mp4",
    storageKey: "dev/renders/velocity_turntable.mp4",
    width: 1920,
    height: 1080,
    sizeBytes: 8388608,
    source: "AI_GENERATED",
    status: "REVIEW",
    metadata: {
      durationSeconds: 8,
      frameRate: 60,
      codec: "H.264",
    },
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
  },
];
