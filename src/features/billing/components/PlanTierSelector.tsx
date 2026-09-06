"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  type SubscriptionPlan,
  type SubscriptionPlanId,
  type BillingInterval,
} from "@/lib/billing/types";
import { Check, Sparkles, Zap, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlanTierSelectorProps {
  plans: SubscriptionPlan[];
  activePlanId: SubscriptionPlanId;
  activeBillingInterval: BillingInterval;
  onChangePlan: (planId: SubscriptionPlanId, interval: BillingInterval) => Promise<void>;
  isChangingPlan: boolean;
}

export function PlanTierSelector({
  plans,
  activePlanId,
  activeBillingInterval,
  onChangePlan,
  isChangingPlan,
}: PlanTierSelectorProps) {
  const [interval, setInterval] = useState<BillingInterval>(activeBillingInterval);

  const handleSelectPlan = async (planId: SubscriptionPlanId) => {
    await onChangePlan(planId, interval);
  };

  return (
    <div className="space-y-6">
      {/* Interval Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-[var(--surface-2)] p-3 rounded-[var(--radius-md)] border border-[var(--border)]">
        <div>
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            SELECT WORKSPACE TIER
          </h3>
          <p className="text-[11px] text-[var(--text-secondary)]">
            Scale your product generation slots and multi-seat permissions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-black/60 p-1 rounded-[var(--radius-sm)] border border-[var(--border)]">
          <button
            type="button"
            onClick={() => setInterval("MONTHLY")}
            className={cn(
              "px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-mono font-semibold transition-all",
              interval === "MONTHLY"
                ? "bg-[var(--surface-3)] text-white border border-[var(--border-strong)]"
                : "text-[var(--text-muted)] hover:text-white"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setInterval("ANNUAL")}
            className={cn(
              "px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-mono font-semibold transition-all flex items-center gap-1.5",
              interval === "ANNUAL"
                ? "bg-[var(--accent)] text-black font-bold"
                : "text-[var(--text-muted)] hover:text-white"
            )}
          >
            <span>Annual</span>
            <span className="text-[9px] bg-black/30 px-1 py-0.2 rounded font-mono">SAVE 17%</span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const isCurrent = plan.id === activePlanId;
          const price = interval === "ANNUAL" ? plan.annualPrice : plan.monthlyPrice;

          return (
            <Card
              key={plan.id}
              variant={plan.isPopular ? "default" : "subtle"}
              className={cn(
                "p-6 flex flex-col justify-between relative transition-all border",
                plan.isPopular
                  ? "border-[var(--accent)] bg-black/60 shadow-[0_0_25px_rgba(183,255,0,0.08)]"
                  : isCurrent
                  ? "border-[var(--border-strong)] bg-[var(--surface-1)]"
                  : "border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--border-strong)]"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-black px-3 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase">
                  RECOMMENDED
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-lg font-bold text-white tracking-tight">
                    {plan.name}
                  </h4>
                  {isCurrent ? (
                    <Badge variant="success">CURRENT PLAN</Badge>
                  ) : plan.id === "ENTERPRISE_STUDIO" ? (
                    <Building2 className="h-5 w-5 text-[var(--accent)]" />
                  ) : plan.id === "PRO_STUDIO" ? (
                    <Sparkles className="h-5 w-5 text-[var(--accent)]" />
                  ) : (
                    <Zap className="h-5 w-5 text-[var(--text-muted)]" />
                  )}
                </div>

                <p className="text-xs text-[var(--text-secondary)] min-h-[32px]">
                  {plan.tagline}
                </p>

                <div className="pt-2 border-t border-[var(--border)]/60">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-3xl font-bold text-white">
                      {price === 0 ? "Free" : `$${price}`}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {interval === "ANNUAL" ? "/ year" : "/ month"}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[var(--accent)] font-semibold mt-1">
                    {`${plan.monthlyCredits.toLocaleString()} AI Credits / month`}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-3 border-t border-[var(--border)]/60">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                      <Check className="h-3.5 w-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-[var(--border)]/60">
                {isCurrent ? (
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    Current Active Plan
                  </Button>
                ) : (
                  <Button
                    variant={plan.isPopular ? "primary" : "secondary"}
                    size="sm"
                    className="w-full"
                    disabled={isChangingPlan}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {plan.id === "FREE_STUDIO" ? "Simulate Downgrade" : `Simulate Switch to ${plan.name}`}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
