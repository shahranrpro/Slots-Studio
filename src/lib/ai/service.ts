/**
 * Slots Studio — AI Concept Generation Service
 *
 * Provides authoritative interface for studio generation requests, isolating
 * underlying provider adapters from the application UI.
 */

import {
  type ConceptProvider,
  type ConceptGenerationRequest,
  type ConceptGenerationResult,
  type ConceptVariant,
} from "./types";
import { DevConceptProviderAdapter } from "./adapters/devProvider";

// Active provider instance (replaceable with production adapters in future tasks)
let activeProvider: ConceptProvider = new DevConceptProviderAdapter();

export function setConceptProvider(provider: ConceptProvider): void {
  activeProvider = provider;
}

export function getActiveConceptProvider(): ConceptProvider {
  return activeProvider;
}

/**
 * Generates concept variants from structured product brief parameters.
 */
export async function generateProductConcepts(
  request: ConceptGenerationRequest
): Promise<ConceptGenerationResult> {
  return activeProvider.generateConcepts(request);
}

/**
 * Refines a selected concept variant creating a traceable child version.
 */
export async function refineProductConcept(
  baseVariant: ConceptVariant,
  instructions: string,
  context: ConceptGenerationRequest
): Promise<ConceptVariant> {
  return activeProvider.refineConcept(baseVariant, instructions, context);
}
