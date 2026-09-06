/**
 * Slots Studio — AI Generation Engine Provider Abstraction Types
 * 
 * Supports provider-agnostic text and image generation with honest labeling,
 * strict server-side credentials, usage tracking, and DEV PREVIEW fallback.
 */

// ============================================================================
// 1. TEXT AI GENERATION INTERFACES
// ============================================================================

export interface TextAiRequest {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  context?: Record<string, unknown>;
}

export interface TextAiUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface TextAiResult {
  success: boolean;
  text: string;
  provider: string;
  model: string;
  usage?: TextAiUsage;
  isDevelopmentPreview?: boolean;
  error?: string;
}

export interface TextGenerationProvider {
  readonly id: string;
  readonly name: string;
  readonly defaultModel: string;
  isAvailable(): boolean;
  generateText(request: TextAiRequest): Promise<TextAiResult>;
}

// ============================================================================
// 2. IMAGE AI GENERATION INTERFACES
// ============================================================================

export type ImageAspectRatio = "1:1" | "4:5" | "9:16" | "16:9";

export interface ImageAiRequest {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: ImageAspectRatio;
  width?: number;
  height?: number;
  seed?: number;
  style?: string;
  context?: Record<string, unknown>;
}

export interface ImageAiResult {
  success: boolean;
  buffer?: Buffer;
  contentType?: string; // e.g. "image/jpeg", "image/png", "image/svg+xml"
  url?: string;
  svgContent?: string;
  provider: string;
  model: string;
  isDevelopmentPreview?: boolean;
  error?: string;
}

export interface ImageGenerationProvider {
  readonly id: string;
  readonly name: string;
  readonly defaultModel: string;
  isAvailable(): boolean;
  generateImage(request: ImageAiRequest): Promise<ImageAiResult>;
}

// ============================================================================
// 3. NORMALIZED AI ERRORS
// ============================================================================

export class AiProviderError extends Error {
  public readonly provider: string;
  public readonly statusCode?: number;
  public readonly isRetryable: boolean;

  constructor(message: string, provider: string, statusCode?: number, isRetryable = false) {
    super(message);
    this.name = "AiProviderError";
    this.provider = provider;
    this.statusCode = statusCode;
    this.isRetryable = isRetryable;
  }
}

export class AiQuotaExhaustedError extends AiProviderError {
  constructor(message: string, provider: string) {
    super(message, provider, 429, false);
    this.name = "AiQuotaExhaustedError";
  }
}

export class AiAuthenticationError extends AiProviderError {
  constructor(message: string, provider: string) {
    super(message, provider, 401, false);
    this.name = "AiAuthenticationError";
  }
}

export class AiRateLimitError extends AiProviderError {
  constructor(message: string, provider: string) {
    super(message, provider, 429, true);
    this.name = "AiRateLimitError";
  }
}

// ============================================================================
// 4. PRODUCT CONCEPT TYPES (Backward Compatibility)
// ============================================================================

export interface ConceptGenerationRequest {
  projectId: string;
  productName: string;
  category: string;
  description: string;
  targetUser?: string;
  visualDirection?: string;
  colors?: string[];
  materials?: string[];
  references?: { id: string; name: string; type: string }[];
  variantsCount: number;
}

export interface ConceptVariant {
  id: string;
  candidateCode: string; // e.g. "CANDIDATE-01", "CANDIDATE-02"
  title: string;
  summary: string;
  silhouetteDescription: string;
  svgWireframe: string; // Deterministic SVG visual silhouette for development preview
  colorPalette: string[];
  suggestedMaterials: string[];
  isDevelopmentPreview: boolean;
  parentConceptId?: string;
  refinementNotes?: string;
}

export interface ConceptGenerationResult {
  success: boolean;
  variants: ConceptVariant[];
  provider: string;
  model: string;
  error?: string;
}

export interface ConceptProvider {
  name: string;
  generateConcepts(request: ConceptGenerationRequest): Promise<ConceptGenerationResult>;
  refineConcept(
    baseVariant: ConceptVariant,
    instructions: string,
    context: ConceptGenerationRequest
  ): Promise<ConceptVariant>;
}
