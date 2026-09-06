/**
 * Slots Studio — Animation Architecture Foundation
 *
 * Guidelines:
 * - Motion (motion): Used for React UI transitions, layout animation, modals, drawers, tabs, and interactive state changes.
 * - Anime.js (animejs): Used for cinematic timelines, SVG paths, and complex hero sequences.
 * - All animations must respect `prefers-reduced-motion`.
 */

export const ANIMATION_DURATIONS = {
  micro: 0.14,
  ui: 0.24,
  panel: 0.36,
  hero: 0.8,
  cinematic: 1.4,
} as const;

export const ANIMATION_EASINGS = {
  default: [0.16, 1, 0.3, 1],
  gentle: [0.38, 0.005, 0.215, 1],
  sharp: [0.77, 0, 0.175, 1],
} as const;

export const transitionPresets = {
  default: {
    duration: ANIMATION_DURATIONS.ui,
    ease: ANIMATION_EASINGS.default,
  },
  micro: {
    duration: ANIMATION_DURATIONS.micro,
    ease: ANIMATION_EASINGS.default,
  },
  panel: {
    duration: ANIMATION_DURATIONS.panel,
    ease: ANIMATION_EASINGS.gentle,
  },
};
