"use client";

import React, { useState } from "react";
import { OnboardingShell } from "./OnboardingShell";
import { WorkspaceWelcome } from "./WorkspaceWelcome";
import { WorkspaceSetup } from "./WorkspaceSetup";
import { OnboardingIntent } from "./OnboardingIntent";
import { OnboardingReady } from "./OnboardingReady";
import { type CreationIntent, type TeamStructure, type OnboardingState } from "@/lib/workspace/types";

export interface OnboardingWizardProps {
  initialState: OnboardingState;
  userName?: string;
}

export function OnboardingWizard({ initialState, userName }: OnboardingWizardProps) {
  const [step, setStep] = useState<number>(initialState.currentStep || 1);
  const [workspaceName, setWorkspaceName] = useState<string>(initialState.workspaceId ? "Default Workspace" : "");
  const [intent, setIntent] = useState<CreationIntent>(initialState.answers.creationIntent || "Products");
  const [team, setTeam] = useState<TeamStructure>(initialState.answers.teamStructure || "Small Team");

  return (
    <OnboardingShell currentStep={step}>
      {step === 1 && (
        <WorkspaceWelcome
          userName={userName}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <WorkspaceSetup
          initialName={workspaceName}
          onBack={() => setStep(1)}
          onSuccess={(createdName) => {
            setWorkspaceName(createdName);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <OnboardingIntent
          initialIntent={intent}
          initialTeam={team}
          onBack={() => setStep(2)}
          onNext={(answers) => {
            setIntent(answers.creationIntent);
            setTeam(answers.teamStructure);
            setStep(4);
          }}
        />
      )}

      {step === 4 && (
        <OnboardingReady
          workspaceName={workspaceName}
          intent={intent}
          team={team}
        />
      )}
    </OnboardingShell>
  );
}
