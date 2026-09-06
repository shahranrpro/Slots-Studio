import React from "react";
import type { Metadata } from "next";
import { Container, Card, CardHeader, CardTitle, CardDescription, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Studios Overview",
  description: "The 5 dedicated creative studios powered by Slots Studio OS.",
};

const STUDIOS = [
  {
    id: "product",
    name: "Product Studio",
    tag: "Concept & Specification",
    description: "Define product silhouettes, materials, functional parameters, and technical briefs with instant generative exploration.",
  },
  {
    id: "visual",
    name: "Visual Studio",
    tag: "Photography & Rendering",
    description: "Generate photorealistic e-commerce studio imagery, editorial lookbooks, and high-impact lifestyle visuals.",
  },
  {
    id: "content",
    name: "Content Studio",
    tag: "Copywriting & Storytelling",
    description: "Draft technical product descriptions, advertising copy, brand messaging, and packaging labels aligned with brand voice.",
  },
  {
    id: "campaign",
    name: "Campaign Studio",
    tag: "Multi-Channel Packaging",
    description: "Package creative outputs into omnichannel marketing kits, social media suites, and launch timelines.",
  },
  {
    id: "production",
    name: "Production Studio",
    tag: "Manufacturing & Tech Packs",
    description: "Export high-resolution assets, detailed tech packs, vector trims, and production-ready manufacturing packages.",
  },
];

export default function StudiosPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="space-y-12 max-w-5xl">
        <div className="space-y-3">
          <Badge variant="accent">Studio Suite</Badge>
          <h1 className="font-display type-h1 font-bold tracking-tight text-[var(--text-primary)]">
            Five Purpose-Built Creative Studios
          </h1>
          <p className="type-body-lg text-[var(--text-secondary)]">
            Each studio operates as a specialized workflow engine while sharing a single source of
            product truth.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STUDIOS.map((s) => (
            <Card key={s.id} id={s.id} variant="interactive">
              <CardHeader>
                <div className="flex items-center justify-between pb-2">
                  <Badge variant="outline">{s.tag}</Badge>
                </div>
                <CardTitle>{s.name}</CardTitle>
                <CardDescription>{s.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
