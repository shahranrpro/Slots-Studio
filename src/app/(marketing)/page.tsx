import React from "react";
import { Hero } from "@/components/marketing/Hero";
import { ConnectedWorkflow } from "@/components/marketing/ConnectedWorkflow";
import { StudiosShowcase } from "@/components/marketing/StudiosShowcase";
import { ReviewSection } from "@/components/marketing/ReviewSection";

export default function MarketingHomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ConnectedWorkflow />
      <StudiosShowcase />
      <ReviewSection />
    </div>
  );
}
