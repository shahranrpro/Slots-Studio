import React from "react";
import type { Metadata } from "next";
import { Container, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button } from "@/components/ui";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing & Plans",
  description: "Transparent pricing designed for emerging designers and enterprise brands.",
};

const PLANS = [
  {
    name: "Creator",
    badge: "For Solo Designers",
    price: "$49",
    period: "/month",
    description: "Full access to Product and Visual Studio for independent creators.",
    features: [
      "5 Active Product Slots",
      "Standard Resolution Visuals",
      "Content Studio Basic",
      "Community Support",
    ],
    cta: "Start Free Trial",
    variant: "outline" as const,
  },
  {
    name: "Studio",
    badge: "Most Popular",
    price: "$199",
    period: "/month",
    description: "Unlimited generation across all 5 studios for growing creative teams.",
    features: [
      "Unlimited Product Slots",
      "4K Ultra-HD Visual Studio",
      "Full Campaign Studio Packaging",
      "Collaborative Team Workspaces",
      "Priority Generative Queue",
    ],
    cta: "Get Started",
    variant: "primary" as const,
  },
  {
    name: "Enterprise",
    badge: "Custom Scale",
    price: "Custom",
    period: "",
    description: "Dedicated infrastructure, custom AI models, and custom ERP integrations.",
    features: [
      "Custom Brand Fine-Tuning",
      "Dedicated Compute Clusters",
      "Custom Tech Pack Pipelines",
      "SSO & Enterprise Security",
      "Dedicated Technical Account Manager",
    ],
    cta: "Contact Enterprise",
    variant: "outline" as const,
  },
];

export default function PricingPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="space-y-12 max-w-5xl">
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <Badge variant="accent">Pricing</Badge>
          <h1 className="font-display type-h1 font-bold tracking-tight text-[var(--text-primary)]">
            Simple, Transparent Pricing
          </h1>
          <p className="type-body-lg text-[var(--text-secondary)]">
            Choose the plan that fits your creative velocity. No hidden usage fees.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={plan.variant === "primary" ? "border-[var(--accent)]" : undefined}
            >
              <CardHeader>
                <div className="flex items-center justify-between pb-2">
                  <Badge variant={plan.variant === "primary" ? "accent" : "outline"}>
                    {plan.badge}
                  </Badge>
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-extrabold text-[var(--text-primary)]">
                    {plan.price}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">{plan.period}</span>
                </div>

                <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant={plan.variant} className="w-full justify-center">
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
