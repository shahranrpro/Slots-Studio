"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { type TechPack } from "@/lib/production/types";
import {
  Layers,
  Scissors,
  Palette,
  Ruler,
  ShieldCheck,
  FileCode,
  Copy,
  CheckCheck,
  Download,
} from "lucide-react";

export interface ProductionTechPackViewerProps {
  techPack: TechPack;
  onExport: (format: "MARKDOWN" | "JSON" | "CSV_BOM") => Promise<void>;
}

type TabKey = "bom" | "colorways" | "construction" | "grading" | "qc" | "document";

export function ProductionTechPackViewer({
  techPack,
  onExport,
}: ProductionTechPackViewerProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("bom");
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(techPack.rawMarkdownSpec);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy markdown:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[var(--border)] no-scrollbar select-none">
        <button
          type="button"
          onClick={() => setActiveTab("bom")}
          className={`px-3.5 py-2 rounded-t-[var(--radius-sm)] text-xs font-mono font-bold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === "bom"
              ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface-2)]"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>BOM & TRIMS ({techPack.materials.length + techPack.trims.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("colorways")}
          className={`px-3.5 py-2 rounded-t-[var(--radius-sm)] text-xs font-mono font-bold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === "colorways"
              ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface-2)]"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          <span>COLORWAYS & ARTWORK ({techPack.colorways.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("construction")}
          className={`px-3.5 py-2 rounded-t-[var(--radius-sm)] text-xs font-mono font-bold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === "construction"
              ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface-2)]"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Scissors className="h-3.5 w-3.5" />
          <span>CONSTRUCTION & SEAMS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("grading")}
          className={`px-3.5 py-2 rounded-t-[var(--radius-sm)] text-xs font-mono font-bold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === "grading"
              ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface-2)]"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Ruler className="h-3.5 w-3.5" />
          <span>SIZE MATRIX ({techPack.measurements.length} POMS)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("qc")}
          className={`px-3.5 py-2 rounded-t-[var(--radius-sm)] text-xs font-mono font-bold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === "qc"
              ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface-2)]"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>QC & PACKAGING</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("document")}
          className={`px-3.5 py-2 rounded-t-[var(--radius-sm)] text-xs font-mono font-bold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === "document"
              ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface-2)]"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <FileCode className="h-3.5 w-3.5" />
          <span>RAW TECH PACK</span>
        </button>
      </div>

      {/* Tab 1: BOM & Trims */}
      {activeTab === "bom" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Bill of Materials Table */}
          <Card variant="subtle" className="p-4 border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase text-[var(--text-primary)]">
                PRIMARY TEXTILES & FABRICATIONS (BOM)
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport("CSV_BOM")}
                leftIcon={<Download className="h-3 w-3" />}
                className="h-7 text-[10px]"
              >
                Export BOM .csv
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-strong)] text-[var(--text-muted)] text-[10px] uppercase">
                    <th className="py-2 px-2">REF</th>
                    <th className="py-2 px-2">PLACEMENT</th>
                    <th className="py-2 px-2">FABRIC NAME</th>
                    <th className="py-2 px-2">COMPOSITION</th>
                    <th className="py-2 px-2">WEIGHT</th>
                    <th className="py-2 px-2">FINISH / TREATMENT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {techPack.materials.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-[var(--surface-2)] transition-colors">
                      <td className="py-2.5 px-2 font-bold text-[var(--accent)]">M-0{idx + 1}</td>
                      <td className="py-2.5 px-2 text-[var(--text-primary)] font-semibold">{m.placement}</td>
                      <td className="py-2.5 px-2 text-[var(--text-secondary)]">{m.fabricName}</td>
                      <td className="py-2.5 px-2 text-[var(--text-muted)]">{m.composition}</td>
                      <td className="py-2.5 px-2 text-[var(--text-primary)]">{m.weightGsm} GSM</td>
                      <td className="py-2.5 px-2 text-[var(--text-secondary)]">{m.finishTreatment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Trims & Hardware Table */}
          <Card variant="subtle" className="p-4 border-[var(--border)] space-y-3">
            <span className="font-mono text-xs font-bold uppercase text-[var(--text-primary)]">
              TRIMS & HARDWARE SPECIFICATIONS
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-strong)] text-[var(--text-muted)] text-[10px] uppercase">
                    <th className="py-2 px-2">REF</th>
                    <th className="py-2 px-2">TYPE</th>
                    <th className="py-2 px-2">ITEM DESCRIPTION</th>
                    <th className="py-2 px-2">PLACEMENT</th>
                    <th className="py-2 px-2">COLOR / FINISH</th>
                    <th className="py-2 px-2">QUANTITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {techPack.trims.map((t, idx) => (
                    <tr key={t.id} className="hover:bg-[var(--surface-2)] transition-colors">
                      <td className="py-2.5 px-2 font-bold text-[var(--accent)]">T-0{idx + 1}</td>
                      <td className="py-2.5 px-2 font-semibold text-[var(--text-primary)]">{t.type}</td>
                      <td className="py-2.5 px-2 text-[var(--text-secondary)]">{t.description}</td>
                      <td className="py-2.5 px-2 text-[var(--text-muted)]">{t.placement}</td>
                      <td className="py-2.5 px-2 text-[var(--text-primary)]">{t.colorRef}</td>
                      <td className="py-2.5 px-2 text-[var(--accent)]">{t.quantityPerUnit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Colorways & Artwork */}
      {activeTab === "colorways" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Colorway Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techPack.colorways.map((c) => (
              <Card key={c.id} variant="subtle" className="p-4 border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
                  <span className="font-mono font-bold text-xs text-[var(--text-primary)]">
                    {c.colorwayName}
                  </span>
                  <Badge variant="accent">APPROVED</Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-[var(--surface-2)] border border-[var(--border)]">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c.hexPrimary }} />
                      <span className="font-mono font-bold text-[var(--text-primary)]">PRIMARY</span>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">{c.pantonePrimary} ({c.hexPrimary})</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-[var(--surface-2)] border border-[var(--border)]">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c.hexAccent }} />
                      <span className="font-mono font-bold text-[var(--text-primary)]">ACCENT</span>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">{c.pantoneAccent} ({c.hexAccent})</span>
                  </div>

                  <div className="pt-1 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    <span className="font-mono font-semibold text-[var(--text-muted)] uppercase block">PLACEMENT DIRECTIVES:</span>
                    {c.placementSummary}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Artwork & Heat Transfers */}
          <Card variant="subtle" className="p-4 border-[var(--border)] space-y-3">
            <span className="font-mono text-xs font-bold uppercase text-[var(--text-primary)]">
              BRANDING & REFLECTIVE ARTWORK PLACEMENT
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {techPack.artwork.map((a, idx) => (
                <div key={a.id} className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5 text-xs">
                  <span className="font-mono text-[10px] font-bold text-[var(--accent)]">ART-0{idx + 1}</span>
                  <p className="font-semibold text-[var(--text-primary)]">{a.item}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">Location: {a.placement}</p>
                  <p className="text-[10px] font-mono text-[var(--text-secondary)]">Spec: {a.technique}</p>
                  <span className="font-mono text-[10px] text-[var(--accent)] block">Dim: {a.dimensions}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Construction & Seams */}
      {activeTab === "construction" && (
        <div className="space-y-4 animate-fadeIn">
          <Card variant="subtle" className="p-5 border-[var(--border)] space-y-4 text-xs">
            <span className="font-mono text-xs font-bold uppercase text-[var(--text-primary)] block border-b border-[var(--border)] pb-2.5">
              SEAM ENGINEERING & STITCH PROTOCOLS
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">SEAM ASSEMBLY:</span>
                <p className="font-semibold text-[var(--text-primary)]">{techPack.construction.seamType}</p>
              </div>

              <div className="p-3 rounded bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">STITCH DENSITY (SPI):</span>
                <p className="font-semibold text-[var(--accent)] font-mono">{techPack.construction.spi}</p>
              </div>

              <div className="p-3 rounded bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">EDGE FINISHING:</span>
                <p className="font-semibold text-[var(--text-primary)]">{techPack.construction.edgeFinishing}</p>
              </div>

              <div className="p-3 rounded bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">HOOD ARCHITECTURE:</span>
                <p className="font-semibold text-[var(--text-primary)]">{techPack.construction.hoodConstruction || "N/A"}</p>
              </div>

              <div className="p-3 rounded bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">STORM CUFF ASSEMBLY:</span>
                <p className="font-semibold text-[var(--text-primary)]">{techPack.construction.cuffConstruction || "N/A"}</p>
              </div>

              <div className="p-3 rounded bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">VENTILATION MATRIX:</span>
                <p className="font-semibold text-[var(--text-primary)]">{techPack.construction.ventilationSpec || "N/A"}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 4: Size Grading Matrix */}
      {activeTab === "grading" && (
        <Card variant="subtle" className="p-4 border-[var(--border)] space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-[var(--text-primary)]">
              POINTS OF MEASUREMENT & SIZE GRADING MATRIX (CM)
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">TOLERANCES MEASURED IN FLAT CM</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-strong)] text-[var(--text-muted)] text-[10px] uppercase">
                  <th className="py-2 px-2">CODE</th>
                  <th className="py-2 px-2">POINT OF MEASUREMENT (POM)</th>
                  <th className="py-2 px-2 text-center">TOL (±)</th>
                  <th className="py-2 px-2 text-center font-bold">XS</th>
                  <th className="py-2 px-2 text-center font-bold">S</th>
                  <th className="py-2 px-2 text-center font-bold text-[var(--accent)]">M (BASE)</th>
                  <th className="py-2 px-2 text-center font-bold">L</th>
                  <th className="py-2 px-2 text-center font-bold">XL</th>
                  <th className="py-2 px-2 text-center font-bold">XXL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {techPack.measurements.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--surface-2)] transition-colors">
                    <td className="py-2.5 px-2 font-bold text-[var(--accent)]">{p.code}</td>
                    <td className="py-2.5 px-2 text-[var(--text-primary)] font-semibold">{p.pointName}</td>
                    <td className="py-2.5 px-2 text-center text-[var(--text-muted)]">±{p.toleranceCm}</td>
                    <td className="py-2.5 px-2 text-center text-[var(--text-secondary)]">{p.xs.toFixed(1)}</td>
                    <td className="py-2.5 px-2 text-center text-[var(--text-secondary)]">{p.s.toFixed(1)}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-[var(--accent)] bg-[var(--surface-3)]/50">{p.m.toFixed(1)}</td>
                    <td className="py-2.5 px-2 text-center text-[var(--text-secondary)]">{p.l.toFixed(1)}</td>
                    <td className="py-2.5 px-2 text-center text-[var(--text-secondary)]">{p.xl.toFixed(1)}</td>
                    <td className="py-2.5 px-2 text-center text-[var(--text-secondary)]">{p.xxl.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 5: QC & Packaging */}
      {activeTab === "qc" && (
        <div className="space-y-4 animate-fadeIn">
          <Card variant="subtle" className="p-5 border-[var(--border)] space-y-4 text-xs">
            <span className="font-mono text-xs font-bold uppercase text-[var(--text-primary)] block border-b border-[var(--border)] pb-2.5">
              QUALITY CONTROL & MANUFACTURING STANDARDS
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">INSPECTION LEVEL:</span>
                <p className="font-semibold text-[var(--text-primary)]">{techPack.qc.inspectionAql}</p>
                <p className="text-[11px] text-[var(--text-secondary)]">{techPack.qc.factoryTolerances}</p>
              </div>

              <div className="p-3 rounded bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">PACKAGING SPECIFICATION:</span>
                <p className="font-semibold text-[var(--text-primary)]">{techPack.qc.packagingSpec}</p>
                <span className="font-mono text-[10px] text-[var(--accent)] block">Symbols: {techPack.qc.washCareSymbols}</span>
              </div>
            </div>

            <div className="p-3 rounded bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
              <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase block">GARMENT CARE PROTOCOL:</span>
              <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)]">
                {techPack.qc.careInstructions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
              <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase block">FACTORY NOTES:</span>
              <p className="text-[var(--text-secondary)] leading-relaxed">{techPack.factoryNotes}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 6: Raw Document Spec */}
      {activeTab === "document" && (
        <Card variant="subtle" className="p-4 border-[var(--border)] space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
            <span className="font-mono text-xs font-bold uppercase text-[var(--text-primary)]">
              RAW MANUFACTURING TECH PACK (MARKDOWN)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyMarkdown}
                leftIcon={isCopied ? <CheckCheck className="h-3 w-3 text-[var(--accent)]" /> : <Copy className="h-3 w-3" />}
                className="h-7 text-[10px]"
              >
                {isCopied ? "Copied" : "Copy Spec"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport("MARKDOWN")}
                leftIcon={<Download className="h-3 w-3" />}
                className="h-7 text-[10px]"
              >
                Download .md
              </Button>
            </div>
          </div>

          <pre className="p-4 rounded-[var(--radius-sm)] bg-black/90 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto max-h-[600px] leading-relaxed whitespace-pre-wrap">
            {techPack.rawMarkdownSpec}
          </pre>
        </Card>
      )}
    </div>
  );
}
