import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { type Subscription, type SubscriptionPlan } from "@/lib/billing/types";
import { CreditCard, Check, ArrowUpRight } from "lucide-react";

export interface PlanOverviewCardProps {
  subscription: Subscription;
  currentPlan: SubscriptionPlan;
  onOpenUpgradeModal: () => void;
}

export function PlanOverviewCard({
  subscription,
  currentPlan,
  onOpenUpgradeModal,
}: PlanOverviewCardProps) {
  const isAnnual = subscription.billingInterval === "ANNUAL";
  const price = isAnnual ? currentPlan.annualPrice : currentPlan.monthlyPrice;
  const renewalFormatted = new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card variant="subtle" className="p-6 border-[var(--border-strong)] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <CreditCard className="h-4 w-4 text-[var(--accent)]" />
            <h2 className="font-display text-lg font-bold text-white tracking-tight">
              CURRENT SUBSCRIPTION
            </h2>
            <Badge variant="success" dot>
              {subscription.status}
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Active workspace plan with dedicated GPU quota and asset export licenses.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenUpgradeModal}
          rightIcon={<ArrowUpRight className="h-4 w-4" />}
        >
          Simulate Plan Change
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier Info */}
        <div className="space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Plan Tier
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-white">{currentPlan.name}</span>
            <span className="text-xs font-mono text-[var(--accent)] font-semibold">
              {isAnnual ? "/ yr" : "/ mo"}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">{currentPlan.tagline}</p>
        </div>

        {/* Pricing & Renewal */}
        <div className="space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Billing & Renews On
          </p>
          <p className="font-display text-2xl font-bold text-white">
            {price === 0 ? "Free" : `$${price}`}
          </p>
          <p className="text-xs font-mono text-[var(--text-muted)]">
            {`Simulated renewal on ${renewalFormatted} (MVP)`}
          </p>
        </div>

        {/* Slot Limits */}
        <div className="space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Active Slot Limit
          </p>
          <p className="font-display text-2xl font-bold text-white">
            {currentPlan.slotLimit >= 100 ? "Unlimited" : `${currentPlan.slotLimit} Slots`}
          </p>
          <p className="text-xs font-mono text-emerald-400">
            {`${currentPlan.monthlyCredits.toLocaleString()} AI Credits / cycle`}
          </p>
        </div>
      </div>

      {/* Plan Features Included */}
      <div className="pt-4 border-t border-[var(--border)]/60">
        <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-3">
          INCLUDED PLAN CAPABILITIES
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentPlan.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <Check className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
