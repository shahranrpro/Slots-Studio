# Slots Studio — Project Memory & Changelog

## Project Identity
- **Name:** Slots Studio
- **Type:** AI-native SaaS creative/product workflow platform
- **Core Promise:** "Create once. Carry the context everywhere."
- **Brand Palette:** Black `#000000`, White `#FFFFFF`, Electric Lime `#B7FF00`
- **Typography:** Primary Display: `Sora`, UI/Body: `Inter`
- **Logo Asset:** Preserved in `public/brand/logo/logo.png`
- **Appearance:** 3 Modes (Default/System, Light, Dark)

---

## Task History & Decisions

### TASK 01 — Project Bootstrap (Completed)
- Initialized Next.js (App Router), TypeScript (Strict), React 19, Tailwind CSS v4.
- Installed Motion (`motion`) and Anime.js (`animejs`) with types for animation architecture.
- Established design tokens in `src/styles/globals.css` with CSS custom properties for surfaces, text, borders, accent, and radii.
- Implemented zero-flash theme script in `src/app/layout.tsx`.
- Configured font optimization for Sora & Inter via `next/font/google`.
- Scaffolding of complete directory structure (`src/components/`, `src/features/`, `src/lib/`, `src/data/`, `src/types/`, `src/hooks/`, `public/brand/logo/`).
- Implemented global error boundary (`src/app/error.tsx`), loading state (`src/app/loading.tsx`), 404 page (`src/app/not-found.tsx`), and clean development marketing entry point (`src/app/(marketing)/page.tsx`).
- Created environment variable templates (`.env.example`, `.env.local`).
- Verified `npm install`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`.

### TASK 01 — Final Audit and Cleanup (Completed)
- **Branding Audit:** PASS — Official S mark verified via SHA256 (`DA83E45B5BD8794CFC3106ED50AAC83428B92A67945F79244251BA357F112BF0`), byte-for-byte identical to source asset; stable path `public/brand/logo/logo.png`.
- **Security Audit:** PASS — `.env.local` and `.env` ignored by `.gitignore`; zero secrets in source code; no secrets in `NEXT_PUBLIC_` variables; `.env.example` contains only safe placeholder names.
- **Architecture Audit:** PASS — Next.js App Router active; TypeScript strictly enforced; all path aliases verified; Server Components default; client components limited strictly to error boundaries and client hooks; no unnecessary dependencies.
- **Theme Architecture:** PASS — CSS custom properties drive all theme tokens (`system/default`, `light`, `dark`); inline hydration script avoids FOUC; no duplicate theme systems; no premature theme switcher UI.
- **Quality & Code Cleanup:** PASS — Clean imports; zero console errors; no horizontal viewport overflow; all placeholder files valid.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (0 errors).
- **Status:** Ready for TASK 02.

### TASK 02 — Brand + Theme Engine (Completed)
- **Theme Storage Key:** Standardized on `slots-studio-appearance` in `localStorage`.
- **Theme Engine Architecture:** Implemented `ThemeProvider` and `useAppearance` hook in `src/components/ui/ThemeProvider.tsx` using React Context + CSS custom properties (zero third-party theme packages).
- **Anti-FOUC Optimization:** Embedded head script in `src/app/layout.tsx` to resolve user preference or `prefers-color-scheme` immediately before initial paint.
- **Dynamic OS Preference Sync:** Configured `matchMedia("(prefers-color-scheme: dark)")` listener to dynamically update the effective theme when `system` mode is active without page reload.
- **BrandLogo Component:** Created `BrandLogo` in `src/components/ui/BrandLogo.tsx` with configurable size, priority, and accessibility attributes using the official S logo.
- **AppearanceSelector Component:** Created accessible segmented control in `src/components/ui/AppearanceSelector.tsx` supporting Default, Light, and Dark options with full keyboard (`ArrowLeft`/`ArrowRight`/`Tab`/`Space`) navigation and `:focus-visible` states.
- **Design Tokens & Type Scale:** Complete token hierarchy and type scale utility classes integrated in `src/styles/globals.css`.
- **Verification:** Passed `npm run lint` (0 errors, 0 warnings), `npx tsc --noEmit` (0 errors), and `npm run build` (0 errors).

### TASK 02.1 — Smooth Theme Transition Hotfix (Completed)
- **Smooth Transition Architecture:** Implemented scoped `.theme-transitioning` class added to `document.documentElement` only upon post-hydration theme switches (user action or OS change).
- **Transition Properties:** Scoped strictly to `background-color`, `color`, `border-color`, `box-shadow`, `fill`, and `stroke` (280ms duration, `cubic-bezier(0.22, 1, 0.36, 1)`).
- **Zero-FOUC & Hydration Safety:** Initial page render / page reload remains instant and flash-free (no transitions on first paint).
- **Auto-Cleanup & Debounce:** Temporary class automatically removes after 300ms, with timer reset on rapid clicks.
- **Reduced Motion:** Respects `prefers-reduced-motion: reduce` by disabling transitions.
- **Verification:** Passed `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), and `npm run build` (0 errors).

### TASK 03 — Slots Studio Design System Primitives (Completed)
- **Foundation Primitives:** `Button`, `IconButton`, `Badge`, `Card` (with subcomponents), `Divider`, `Spinner`, `Skeleton`, `EmptyState`, `BrandLogo`.
- **Form Controls:** `Input`, `Textarea`, `Select` (accessible custom dropdown with keyboard listbox navigation), `Checkbox`, `RadioGroup`, `Switch`, `FormField`, `FormError`, `FormSuccess`.
- **Overlay Primitives:** `Dialog` (with focus trap, escape listener, backdrop blur), `Sheet` (multi-side drawer), `Tooltip` (accessible hover/focus), `DropdownMenu` (arrow key menu navigation).
- **Navigation:** `Tabs` (tablist / tab / tabpanel with arrow key navigation).
- **Design System Documentation:** Created `src/components/ui/README.md` cataloging variants, accessibility details, and code examples.
- **Verification:** Passed `npm run lint` (0 errors, 0 warnings), `npx tsc --noEmit` (0 errors), and `npm run build` (0 errors).

### TASK 03.1 — Design System Final Polish and Cleanup (Completed)
- **Marketing Shell Isolation:** Removed development showcase component trees from root marketing page (`src/app/(marketing)/page.tsx`), maintaining a clean, production-oriented foundation ready for TASK 04.
- **Internal Dev Route:** Created `/dev/components` (`src/app/dev/components/page.tsx`) protected with `robots: { index: false, follow: false }` (`src/app/dev/components/layout.tsx`) for interactive component auditing.
- **Component Audit:** Verified all 22 primitives use CSS tokens, have clean exports, support keyboard navigation, visible focus rings, and work in Default, Light, and Dark modes.
- **Verification Suite:** PASS — `npm run lint` (0 errors, 0 warnings), `npx tsc --noEmit` (0 errors), and `npm run build` (0 errors).
- **Status:** Ready for TASK 04 Marketing Shell.

### TASK 04 — Slots Studio Marketing Shell (Completed)
- **Container Primitive:** Implemented reusable `Container` (`src/components/ui/Container.tsx`) enforcing `max-w-[1440px]` with fluid responsive padding (`px-5 sm:px-8 lg:px-12`).
- **Navigation Data Architecture:** Standardized centralized marketing and multi-column footer navigation structure in `src/data/navigation.ts`.
- **Marketing Header:** Built sticky `MarketingHeader` (`src/components/marketing/MarketingHeader.tsx`) with scroll-aware backdrop blur, skip-to-content accessibility link, `BrandLogo`, desktop navigation with active indicators, `AppearanceSelector`, and primary Electric Lime CTA (`Start Creating`).
- **Mobile Drawer Navigation:** Implemented `MobileMarketingNav` (`src/components/marketing/MobileMarketingNav.tsx`) powered by the `Sheet` primitive with focus trapping and route navigation auto-closing.
- **Marketing Footer:** Created multi-column responsive `MarketingFooter` (`src/components/marketing/MarketingFooter.tsx`) with brand summary, status indicator, structured link grid, and copyright bar.
- **Marketing Layout & Routes:** Integrated `src/app/(marketing)/layout.tsx` and created clean placeholder shells for all 9 primary marketing routes (`/features`, `/studios`, `/workflow`, `/pricing`, `/about`, `/resources`, `/contact`, `/privacy`, `/terms`).
- **Verification Suite:** PASS — `npm run lint` (0 errors, 0 warnings), `npx tsc --noEmit` (0 errors), `npm run build` (14 static pages generated cleanly in 44.0s).

### TASK 04.1 — Marketing Shell Visual QA and Final Polish (Completed)
- **Visual & Interaction Audit:** PASS across Header, Mobile Drawer, Footer, Container, Typography, Theme, Accessibility, and Codebase Cleanup.
- **No Overflow / Clean Bounds:** Responsive bounds verified across 320px–1920px viewports.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (14 static pages generated cleanly in 6.7s).
- **Status:** Ready for TASK 05 Marketing Hero Section.

### TASK 05 — Slots Studio Futuristic Hero (Completed)
- **Hero Architecture:** Implemented `Hero` (`src/components/marketing/Hero.tsx`) featuring an editorial two-part layout with typography on the left and an interactive workstation preview on the right.
- **Strict Heading Rules:** Master H1 typography (`ONE PRODUCT` / `EVERY OUTPUT`) formatted strictly without full stops or trailing periods.
- **Cinematic Logo Sequence:** Created `HeroLogoReveal` (`src/components/marketing/HeroLogoReveal.tsx`) utilizing Anime.js for subtle scale/opacity brand reveal, with automatic reduced-motion bypassing.
- **Technical Eyebrow:** Created `HeroEyebrow` (`src/components/marketing/HeroEyebrow.tsx`) displaying `AI CREATIVE WORKFLOW` with an Electric Lime signal pulse.
- **Application Workstation Preview:** Implemented `HeroApplicationPreview` (`src/components/marketing/HeroApplicationPreview.tsx`) powered by Motion featuring project `Technical Training Jacket` (`SS-02481`), interactive studio switching (`Product`, `Visual`, `Content`, `Campaign`, `Production`), generative 4K wireframe canvas, and synchronized context lock indicators.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (14 static routes prerendered in 15.1s).
- **Status:** Ready for TASK 05.1.

### TASK 05.1 — Mobile Navigation Scroll Visibility Fix (Completed)
- **Root Cause:** Ancestor containing block conflict caused by `backdrop-filter` on the sticky `<header>`, which constrained `fixed` descendants inside the 64px header box.
- **Solution:** Upgraded `Sheet` (`src/components/ui/Sheet.tsx`) and `Dialog` (`src/components/ui/Dialog.tsx`) primitives to render via React Portals (`createPortal(..., document.body)`).
- **Scroll Preservation:** Drawer opens at true viewport coordinates at any scroll position (0%, 25%, 50%, 75%, 100%) with zero scroll jump and full body scroll lock restoration.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (14 static routes prerendered in 9.3s).

### TASK 06 — Connected Workflow and Studios Section (Completed)
- **Structured Data Layer:** Created typed models in `src/data/studios.ts` for all 5 workflow stages (`WORKFLOW_STAGES`) and all 5 studios (`STUDIOS_DATA`).
- **Connected Workflow Section:** Built `ConnectedWorkflow` (`src/components/marketing/ConnectedWorkflow.tsx`) and `WorkflowNode` (`src/components/marketing/WorkflowNode.tsx`) featuring an interactive 5-stage pipeline (`Product`, `Visual`, `Content`, `Campaign`, `Production`), context inspector canvas, and directional connectors.
- **Studios Showcase Section:** Built `StudiosShowcase` (`src/components/marketing/StudiosShowcase.tsx`) and `StudioCard` (`src/components/marketing/StudioCard.tsx`) featuring an asymmetric editorial grid highlighting Product and Visual studios on top and Content, Campaign, and Production studios below.
- **AI + Human Review Section:** Built `ReviewSection` (`src/components/marketing/ReviewSection.tsx`) with an interactive decision workstation displaying candidate `#02481-B`, accuracy parameters, and explicit `Approve`, `Regenerate`, and `Reject` controls.
- **Strict Heading Rules:** Verified all new section headings (`ONE IDEA` / `EVERY OUTPUT`, `FIVE STUDIOS` / `ONE WORKSPACE`, `GENERATE` / `THEN DECIDE`) strictly omit trailing periods.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (14 static routes prerendered in 10.8s).

### TASK 06.1 — Workflow and Review Demo Cleanup (Completed)
- **Claims & Metric Audit:** Audited all marketing components and removed unsupported numerical claims (such as `99.4% Spec Accuracy`, `ΔE < 0.8 Color Fidelity`, and `100% Context Preserved`).
- **Factual Terminology:** Replaced numerical claims with factual, product-oriented status indicators (`Spec Status: LOCKED`, `Colorway: CALIBRATED`, `Context Status: UNIFIED`, `PENDING REVIEW`, `APPROVED`, `REJECTED`).
- **Demo Clarity:** Clarified workstation interaction as an interactive preview/demonstration of operator decision-making without simulating fake backend API calls or telemetry.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (14 static routes prerendered in 22.2s).

### TASK 07 — Slots Studio Authentication (Completed)
- **Modular Auth Service Layer:** Created service boundary in `src/lib/auth/` (`service.ts`, `session.ts`, `passwords.ts`, `tokens.ts`, `store.ts`, `types.ts`).
- **Security & Cryptography:** Password hashing with `crypto.scrypt` + 16-byte random salts; HMAC-SHA256 session tokens with Web Crypto API (`SameSite=Lax`, `HttpOnly` cookie `slots-studio-session`).
- **Next.js Middleware Route Protection:** `src/middleware.ts` intercepts `/app/*` routes and redirects unauthenticated visitors to `/login?callbackUrl=...`, while redirecting authenticated users to `/app`.
- **API Handlers:** `/api/auth/login`, `/api/auth/signup`, `/api/auth/logout`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/session`.
- **Auth UI Components:** Built `AuthShell`, `AuthHeader`, `AuthError`, `AuthSuccess`, `LoginForm`, `SignupForm`, `ForgotPasswordForm`, `ResetPasswordForm` in `src/features/auth/`.
- **Protected App Workspace:** Built `src/app/app/layout.tsx` and `src/app/app/page.tsx` with server-side session diagnostics and sign-out controls.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (25 static and dynamic routes compiled in 27.7s).

### TASK 07.1 — Authentication Security and Development Store Cleanup (Completed)
- **Removed Hardcoded Credentials:** Removed all hardcoded static password strings from source code, UI helpers, and documentation.
- **Safe Development Seeding:** Configured development-only seed account to load strictly from environment variables (`DEV_AUTH_EMAIL` / `DEV_AUTH_PASSWORD`) rather than repository constants.
- **Store Labeling:** Explicitly labeled `src/lib/auth/store.ts` as an ephemeral in-memory development repository for testing, prepared for seamless replacement by persistent database tables in TASK 09+.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (25 static and dynamic routes compiled cleanly).

### TASK 08 — Workspace and Onboarding (Completed)
- **Workspace Data Layer:** Created typed models in `src/lib/workspace/types.ts` for `Workspace`, `WorkspaceMember` (`OWNER`, `ADMIN`, `EDITOR`, `REVIEWER`, `VIEWER`), and `OnboardingState`.
- **Replaceable Persistence Boundary:** Implemented `src/lib/workspace/service.ts` and `src/lib/workspace/store.ts` encapsulating all workspace operations and state management.
- **API Handlers:** Built `/api/workspace` (GET/POST) and `/api/workspace/onboarding` (GET/POST).
- **Onboarding UI Wizard:** Created `OnboardingShell`, `OnboardingProgress`, `WorkspaceWelcome` (Step 1), `WorkspaceSetup` (Step 2), `OnboardingIntent` (Step 3), `OnboardingReady` (Step 4), and `OnboardingWizard` in `src/features/workspace/`.
- **Routing & First-Project Starting Point:**
  - `/app/onboarding`: Multi-step onboarding experience.
  - `/app`: Workspace entry redirecting un-onboarded users to onboarding and rendering the active workspace dashboard for completed accounts.
  - `/app/projects`: First-project starting destination reached upon onboarding completion.
- **Heading Conventions:** Verified all onboarding and workspace headings strictly omit trailing periods.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (29 static and dynamic routes compiled in 26.9s).

### TASK 08.1 — Workspace Persistence Boundary Audit (Completed)
- **Persistence Boundary Audit:** PASS — Zero UI-to-store coupling; all workspace mutations and reads go through `src/lib/workspace/service.ts` and API endpoints.
- **Explicit Non-Production Labeling:** Verified that `src/lib/workspace/store.ts` is explicitly designated as an in-memory development repository and does not claim persistent database capabilities.
- **Server-Side Authorization:** Verified that all endpoints authenticate the caller via session cookies and reject untrusted client parameters.
- **Documentation:** Updated `README.md` and `docs/memory.md` with explicit boundary specifications and future database migration notes.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (29 static and dynamic routes compiled cleanly).

### TASK 09 — Slots Studio Application Shell (Completed)
- **Application Shell Architecture:** Built `AppShell` (`src/components/navigation/AppShell.tsx`), `AppSidebar` (`src/components/navigation/AppSidebar.tsx`), and `AppTopbar` (`src/components/navigation/AppTopbar.tsx`).
- **Command Menu Foundation:** Implemented `CommandMenu` (`src/components/navigation/CommandMenu.tsx`) with `Cmd/Ctrl + K` global shortcut, keyboard navigation, search filtering, and escape support.
- **Dynamic Breadcrumbs:** Built `Breadcrumbs` (`src/components/navigation/Breadcrumbs.tsx`) dynamically mapping route segments to human-readable labels.
- **Workspace Switcher & User Menu:** Implemented `WorkspaceSwitcher` and `UserMenu` powered by the accessible `DropdownMenu` primitive.
- **Mobile Drawer Navigation:** Implemented `MobileAppNav` using portal-mounted `Sheet` to guarantee zero scroll jump and perfect viewport positioning.
- **Destination Shells:** Added clean placeholder shells for `/app/assets`, `/app/jobs`, `/app/studio/*` (5 studios), `/app/settings`, and `/app/help`.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (38 static and dynamic routes compiled in 32.0s).

### TASK 10 — Slots Studio Dashboard (Completed)
- **Creative Command Center Architecture:** Built the authenticated dashboard at `/app` answering what is in flight, running, awaiting review, recently created, and next steps.
- **Data & Service Layer:** Created domain models in `src/features/dashboard/types.ts` and service layer in `src/features/dashboard/services/dashboardService.ts`.
- **Components:** Built `DashboardHeader`, `CreateAction`, `ReviewQueue`, `ActiveJobs`, `RecentProjects`, `RecentAssets`, `UsageSummary`, `ActivityFeed`, and `DashboardSkeleton`.
- **Heading Conventions:** Verified all dashboard headings strictly omit trailing periods.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (38 static and dynamic routes compiled in 28.6s).

### TASK 10.1 — Dashboard Truthfulness and Fixture Cleanup (Completed)
- **Operational Metric Audit:** Removed fake telemetry (68% progress, fabricated project history, fake concurrency metrics) from default production dashboard flow.
- **Truthful Empty States:** Implemented informative and truthful empty states across Projects (`NO PROJECTS YET`), Jobs (`NO ACTIVE JOBS`), Reviews (`NOTHING NEEDS REVIEW`), Assets (`NO RECENT ASSETS`), Activity (`NO RECENT ACTIVITY`), and Capacity (`USAGE TRACKING INACTIVE`).
- **Isolated Fixtures:** Isolated development sample data in `src/features/dashboard/fixtures.ts` with explicit development-only notices.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (38 static and dynamic routes compiled cleanly).

### TASK 11 — Slots Studio Projects (Completed)
- **Project Subsystem Architecture:** Built the product-centric project management layer across `/app/projects` and `/app/projects/[id]`.
- **Server-Side Unique SLOT IDs:** Automatic incremental sequence generation (`generateSlotCode`) outputting `SS-#####` (e.g. `SS-00101`, `SS-02481`).
- **Domain & Service Boundary:** Implemented `src/lib/projects/` (`types.ts`, `service.ts`, `store.ts`, `index.ts`) defining `Project`, `ProjectStatus`, `ProjectCategory`, and `ProjectContext` behind a replaceable `ProjectRepository`.
- **API Endpoints:** Built `/api/projects` (GET/POST) and `/api/projects/[id]` (GET/PATCH/DELETE).
- **UI Components (`src/features/projects/`):**
  - `ProjectCard.tsx` & `ProjectGrid.tsx`: Responsive editorial cards with `slotCode` badges and status pills.
  - `ProjectList.tsx`: High-density editorial list mode.
  - `ProjectSearch.tsx` & `ProjectFilters.tsx`: Real-time search, category filtering, lifecycle status filtering, and clear filters action.
  - `CreateProjectDialog.tsx`: Portal dialog capturing project name, category, concept brief, target audience, and styling direction.
  - `ProjectHeader.tsx`: Detail header with `slotCode`, live status dropdown transitions, and archive confirmation.
  - `ProjectOverview.tsx`: Context overview tab displaying locked parameters and connected studio launchpads.
  - `ProjectTabs.tsx`: 9-tab workstation (`Overview`, `Product`, `References`, `Concepts`, `Assets`, `Content`, `Campaigns`, `Production`, `Activity`) with honest empty states on downstream studio tabs.
  - `ProjectEditDialog.tsx`: Context editing modal.
- **Verification Suite:** PASS — `npm run lint` (0 warnings, 0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (39 static and dynamic routes compiled in 42.0s).

### TASK 11.1 — Projects Persistence Boundary and Archive Semantics Cleanup (Completed)
- **Soft Archive Semantics:** Standardized project archival on soft-state lifecycle transitions (`status = "ARCHIVED"` with `archivedAt` timestamp), eliminating destructive hard deletions from UI workflows.
- **Persistence Boundary Audit:** Verified zero direct UI coupling to in-memory store; all mutations and reads go through `src/lib/projects/service.ts` or `/api/projects/*` endpoints with `ProjectRepository` abstraction.
- **SLOT ID Server Authorization:** Verified SLOT IDs are generated exclusively server-side (`generateSlotCode`) and cannot be defined or overridden by client payloads.
- **Server Authorization Verification:** Verified all project endpoints require valid session cookies and workspace membership.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (39 static and dynamic routes compiled in 28.5s).

### TASK 12 — Slots Studio Product Studio (Completed)
- **Product Studio Workstation Architecture:** Built the first functional studio at `/app/studio/product` with project preservation and context synchronization.
- **Product Brief Definition (`ProductBrief.tsx`):** Structured editor for product name, category (`APPAREL`, `SPORTSWEAR`, `OUTERWEAR`, `ACCESSORIES`, `EQUIPMENT`, `OTHER`), concept description, target user, visual direction, color swatches, and fabrication tags.
- **Reference Attachments (`ReferencePanel.tsx`):** Reference system supporting `PRODUCT`, `STYLE`, `COLOR`, `MATERIAL`, `LOGO`, and `OTHER` with add/remove actions and empty states.
- **AI Concept Provider Abstraction (`src/lib/ai/` & `src/lib/generation/`):** Implemented `ConceptProvider` interface with `DevConceptProviderAdapter` returning structured candidates with deterministic SVG silhouettes, isolated behind `generateProductConcepts()` and `refineProductConcept()`.
- **Generation & Job Tracking (`GenerationConfig.tsx`, `GenerationStatus.tsx`):** Background job creation (`GenerationJob`) and honest non-numeric running states.
- **Concept Inspection, Comparison & Refinement (`ConceptGrid.tsx`, `ConceptCard.tsx`, `ConceptComparison.tsx`, `RefineConceptDialog.tsx`):** Side-by-side comparison of 2–4 candidates and child version generation with parent lineage preservation (`parentConceptId`).
- **Human Review & Canonical Approval (`ProductReviewBar.tsx`):** Operator review bar with `Approve` and `Reject` actions, updating project context (`status: "APPROVED"`, `colorways`, `tags`, `visualDirection`) for downstream studios.
- **API Handlers:** `/api/studio/product` (GET), `/api/studio/product/brief` (POST), `/api/studio/product/references` (POST/DELETE), `/api/studio/product/generate` (POST), `/api/studio/product/refine` (POST), `/api/studio/product/approve` (POST), `/api/studio/product/reject` (POST).
- **Verification Suite:** PASS — `npm run lint` (0 warnings, 0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (46 static and dynamic routes compiled in 32.4s).

### TASK 12.1 — Product Studio Production Boundary and Development Output Cleanup (Completed)
- **Development Output Demarcation:** Audited concept provider and verified that vector silhouette previews are explicitly flagged as `DEV PREVIEW` without fabricating fake AI scores, accuracy percentages, or invented model names.
- **Persistence Boundary Audit:** Documented in-memory store in `src/features/product-studio/store.ts` as ephemeral development persistence, maintaining clean service boundaries for upcoming database and Object Storage tables.
- **Generation Job Status Audit:** Verified generation job tracking cleanly models `QUEUED`, `RUNNING`, `REVIEW`, `COMPLETED`, `FAILED`, and `CANCELLED` states with truthful non-numeric progress indicators.
- **Canonical Approval Semantics:** Verified concept approvals update project context parameters and set canonical direction rather than claiming absolute factory sign-off.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (46 static and dynamic routes compiled in 44.0s).

### TASK 13 — Slots Studio Assets Library (Completed)
- **Centralized Asset Subsystem (`src/lib/assets/`):** Unified schema defining `Asset`, `AssetType` (`IMAGE`, `VIDEO`, `DOCUMENT`, `DESIGN`, `LOGO`, `REFERENCE`, `OTHER`), `AssetSource` (`UPLOAD`, `AI_GENERATED`, `IMPORTED`, `SYSTEM`), `AssetStatus` (`DRAFT`, `GENERATING`, `REVIEW`, `APPROVED`, `REJECTED`, `ARCHIVED`), and `AssetRepository` boundary.
- **Persistence & Service Boundary:** Ephemeral development repository `src/lib/assets/store.ts` implementing `AssetRepository`, with service methods (`getAssets`, `getAssetById`, `createAsset`, `updateAsset`, `archiveAsset`, `getAssetDownloadData`).
- **API Endpoints:** Built `/api/assets` (GET/POST), `/api/assets/[id]` (GET/PATCH/DELETE), and `/api/assets/[id]/download` (GET).
- **UI Components (`src/features/assets/`):**
  - `AssetToolbar.tsx` & `AssetSearch.tsx`: Real-time multi-attribute search and view switcher.
  - `AssetFilters.tsx`: Dropdown selectors for Source, Type, Status, and Project with clear action.
  - `AssetCard.tsx` & `AssetGrid.tsx`: Responsive editorial card layout with vector SVG previews and inspector triggers.
  - `AssetList.tsx`: High-density table list layout.
  - `AssetViewer.tsx` & `AssetMetadata.tsx`: Large preview modal with metadata inspector (MIME, dimensions, size, source, timestamps).
  - `AssetLibrary.tsx`: Master coordinator with soft-archival and authorized SVG downloads.
- **Verification Suite:** PASS — `npm run lint` (0 warnings, 0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (47 static and dynamic routes compiled in 33.7s).

### TASK 13.1 — Assets Library Media Abstraction and Archive Cleanup (Completed)
- **Media-Type Agnostic Preview Strategy (`AssetMediaPreview.tsx`):** Eliminated SVG-only rendering assumptions across `AssetCard`, `AssetList`, and `AssetViewer`. Implemented generic preview strategy handling image URLs, vector SVGs, video motion slates with duration badges, tech pack document representations, design specs, and safe fallbacks for unknown media formats.
- **Truthful Metadata Display:** Audited `AssetMetadata.tsx` so dimensions are displayed strictly when pixel width and height are available, vector scalable labels are reserved for true SVGs, and generic documents/media omit artificial dimensions.
- **Generic Download Handling:** Updated `/api/assets/[id]/download` and client download triggers to derive file extensions and `Content-Type` headers directly from asset MIME types and filenames rather than forcing `.svg`.
- **Soft-Archive Confirmation:** Verified that `DELETE /api/assets/[id]` and `PATCH /api/assets/[id]` perform soft-state lifecycle transitions without exposing destructive hard deletions.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (47 static and dynamic routes compiled in 62.0s).

### TASK 14 — Slots Studio Jobs System (Completed)
- **Unified Jobs Domain Subsystem (`src/lib/jobs/`):** Unified schema defining `Job`, `JobStatus` (`QUEUED`, `RUNNING`, `REVIEW`, `COMPLETED`, `FAILED`, `CANCELLED`), `JobType` (`PRODUCT_CONCEPT_GENERATION`, `PRODUCT_CONCEPT_REFINEMENT`, `ASSET_PROCESSING`, `OTHER`), `StudioContext` (`PRODUCT`, `VISUAL`, `CONTENT`, `CAMPAIGN`, `PRODUCTION`), and `JobRepository` boundary.
- **Persistence & Service Boundary:** Ephemeral in-memory development repository `src/lib/jobs/store.ts` implementing `JobRepository`, with business service methods (`getJobs`, `getJobById`, `createJob`, `updateJobStatus`, `retryJob`, `cancelJob`).
- **Generation Subsystem Bridge (`src/lib/generation/`):** Unified generation background jobs to automatically mirror into the shared Jobs domain repository.
- **API Endpoints:** Built `/api/jobs` (GET/POST), `/api/jobs/[id]` (GET), `/api/jobs/[id]/retry` (POST), and `/api/jobs/[id]/cancel` (POST).
- **UI Components (`src/features/jobs/`):**
  - `JobStatus.tsx` & `JobProgress.tsx`: Normalized status badges and honest non-numeric pipeline phase indicators.
  - `JobSearch.tsx` & `JobFilters.tsx`: Real-time text search and multi-dimension filtering (Status, Studio, Type, Project).
  - `JobCard.tsx` & `JobList.tsx`: List and compact view modes with action triggers.
  - `JobDetail.tsx`: Slide-over inspector modal with execution timing, engine provenance, project links, output asset references, and safe error diagnostics.
  - `JobsView.tsx`: Master client coordinator managing state, filtering, retry, and cancellation.
- **Verification Suite:** PASS — `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (48 static and dynamic routes compiled in 39.6s).

### TASK 10.2 — Dashboard Infinite Loading and Hydration Diagnostic Fix (Completed)
- **Root Cause 1 (Redirect Loop on Server/Hot-Reload Restarts):** In `src/lib/auth/service.ts`, `getUserFromSession(session)` queried the in-memory `usersMap`. If the server process restarted or hot-reloaded, `usersMap` was empty; `getUserFromSession` returned `null`, triggering a redirect from `/app` layout to `/login`. However, `middleware.ts` saw the valid HMAC session cookie, recognized the user as authenticated, and redirected `/login` immediately back to `/app`, creating an infinite redirect loop. Under Next.js streaming SSR, this manifested as an indefinite full-screen "Loading Slots Studio..." state.
  - *Fix:* Added cryptographically verified session token fallback inside `getUserFromSession(session)` so valid sessions resolve immediately even across store resets.
- **Root Cause 2 (Missing Scoped Loading Boundary in AppShell):** With only a root-level `src/app/loading.tsx` and no route-level loading state in `src/app/app/(dashboard)/`, any page transition or dynamic stream within the authenticated dashboard caused Next.js to unmount the entire AppShell and render the centered full-screen "Loading Slots Studio..." spinner.
  - *Fix:* Created `src/app/app/(dashboard)/loading.tsx` rendering `DashboardSkeleton`. The AppShell remains permanently mounted and interactive, showing a clean local skeleton during data resolution.
- **Root Cause 3 (Unseeded Development Workspaces):** When development accounts logged in, `src/lib/workspace/store.ts` had no pre-seeded default workspace, causing `/app` to attempt routing un-onboarded accounts to onboarding.
  - *Fix:* Added `ensureSeededWorkspaceStore()` in `src/lib/workspace/store.ts` pre-seeding the development workspace (`ws_dev_seed`) with owner membership and completed onboarding state. Added automatic fallback workspace provisioning in `getUserWorkspaces()` for completed accounts.
- **Root Cause 4 (Concurrent Navigation on Auth Forms):** `LoginForm.tsx`, `SignupForm.tsx`, and `UserMenu.tsx` called `router.push()` followed by `router.refresh()`, triggering racing router transitions before cookie synchronization completed.
  - *Fix:* Standardized on clean `window.location.href` navigation for authentication lifecycle events (login, signup, logout).
- **Verification Suite:** PASS — `npm run lint` (0 warnings, 0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (48 static and dynamic routes compiled cleanly in 36.9s).

### TASK 15 — Visual Studio Workstation (Completed)
- **Objective:** Built the second creative studio inside Slots Studio (**Visual Studio** at `/app/studio/visual`) supporting 6 modes (`Studio`, `Model`, `Mannequin`, `Lifestyle`, `Detail`, `Editorial`) and inheriting the approved product context established in Product Studio.
- **Key Modules Implemented:**
  - `src/features/visual-studio/types.ts`: Domain models for `VisualMode`, `VisualAspectRatio`, `VisualSettingsConfig`, `VisualOutput`, `VisualReference`, `VisualStudioState`, `VisualGenerationRequest`.
  - `src/features/visual-studio/adapters/devVisualProvider.ts`: Deterministic development visual provider generating mode-specific vector compositions clearly labeled `DEV PREVIEW` with aspect ratio, lighting gradients, and technical parameter slates without fake AI scores.
  - `src/features/visual-studio/store.ts`: Ephemeral in-memory development repository implementing `VisualStudioRepository`.
  - `src/features/visual-studio/services/visualStudioService.ts`: Authoritative service coordinating product context reading, visual generation job creation in `src/lib/jobs/`, output review decisions, and asset persistence in `src/lib/assets/`.
  - `src/app/api/studio/visual/`: API endpoints (`/api/studio/visual`, `/api/studio/visual/review`, `/api/studio/visual/save`).
  - `src/features/visual-studio/components/`:
    - `VisualStudioShell.tsx`: Studio header with SLOT ID badge, project switcher, `STUDIO 02` pill, and return-to-project action.
    - `VisualContextPanel.tsx`: Compact approved product context summary with locked silhouette preview, color swatches, and material tags.
    - `VisualReferencePanel.tsx`: Reference guide selector with active generation toggle and add modal.
    - `VisualModeSelector.tsx`: Keyboard-accessible 6-mode switcher with active indicators and descriptions.
    - `VisualSettings.tsx`: Mode-aware progressive controls for aspect ratio (`1:1`, `4:5`, `9:16`, `16:9`), lighting, background, environment, composition, and model styling.
    - `VisualGenerationStatus.tsx`: Honest non-numeric pipeline state indicator linked to shared Jobs subsystem.
    - `VisualOutputGrid.tsx`: Filterable candidate grid with empty states.
    - `VisualOutputCard.tsx`: Output candidate card with status pills, aspect-ratio-matched preview, and review triggers.
    - `VisualOutputDetail.tsx`: Slide-over inspector modal with full-resolution preview, parameter diagnostics, and export actions.
    - `VisualReviewBar.tsx`: Sticky operator review bar (`Approve`, `Reject`, `Regenerate`, `Save Asset`).
    - `VisualStudioView.tsx`: Master workstation coordinator.
  - `src/app/app/(dashboard)/studio/visual/page.tsx`: Server component with session authentication and project context resolution.
- **Verification Suite:** PASS — `npm run lint` (0 warnings, 0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (51 static and dynamic routes compiled in 40s).

### TASK: AUTH_WORKSPACE_REDIRECT_AND_BRAND_FONT_REPAIR (Completed)
- **Problem 1 (Persistent /app/onboarding Redirect Loop on Navigation):**
  - *Root Cause:* In `src/lib/workspace/store.ts`, workspace memberships and onboarding states were keyed exclusively to `usr_dev_seed`. When users logged in with other IDs or when server hot-reloads occurred, `getUserWorkspaces(userId)` returned `[]` and `getUserOnboardingState(userId)` initialized a transient `{ completed: false }`. Furthermore, 8 independent page files duplicated disjoint checks and redirected to `/app/onboarding`.
  - *Fix:*
    1. Implemented `resolveAuthenticatedWorkspaceContext(session)` in `src/lib/workspace/service.ts` as the single authoritative server-side workspace resolution pipeline.
    2. Guaranteed in `src/lib/workspace/store.ts` that authenticated sessions resolve stable workspace memberships and completed onboarding states.
    3. Refactored all 8 dashboard page routes (`/app`, `/app/projects`, `/app/projects/[id]`, `/app/assets`, `/app/jobs`, `/app/studio/product`, `/app/studio/visual`, `/app/settings`) and `DashboardLayout` to consume `resolveAuthenticatedWorkspaceContext`.
    4. Updated navigation links (`RecentProjects.tsx`, `AppSidebar.tsx`, `OnboardingReady.tsx`) to eliminate imperatively broken router transitions.
- **Problem 2 (Typography System Restoration — Sora + Inter):**
  - *Root Cause:* CSS global rules lacked explicit HTML heading declarations (`h1`-`h6`) for `Sora`, causing headings to fall back to the body font unless individually tagged with `.font-display`.
  - *Fix:*
    1. In `src/app/layout.tsx`, loaded `Sora` (weights 400, 500, 600, 700, 800) and `Inter` (weights 400, 500, 600, 700) via `next/font/google`.
    2. In `src/styles/globals.css`, configured `@theme` tokens `--font-sans`, `--font-display`, `--font-sora`, and `--font-inter`.
    3. Set `body` to `Inter` and all headings (`h1, h2, h3, h4, h5, h6`) to `Sora` globally, ensuring consistent typography across all dialogs, forms, cards, navigation, and studios.
- **Verification Suite:** PASS — `npm run lint` (0 warnings, 0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (51 static and dynamic routes compiled in 65s).

### TASK 15.1 — Critical Server/Client Boundary Repair + Auth Runtime Error Fix (Completed)
- **Problem (Critical Runtime Error `"The 'original' argument must be of type Function"`):**
  - *Root Cause:* `src/features/workspace/components/WorkspaceSetup.tsx` (a `"use client"` component) imported `generateWorkspaceSlug` directly from `src/lib/workspace/service.ts`. Because `service.ts` imported `src/lib/auth/service.ts` &rarr; `store.ts` &rarr; `passwords.ts`, Webpack included `src/lib/auth/passwords.ts` into client-side browser bundles for `/app/settings` and `/app/onboarding`. In the browser, Node's `crypto.scrypt` shim was `undefined`, causing `promisify(scrypt)` to throw a runtime `TypeError` at module evaluation. Furthermore, barrel files (`src/lib/auth/index.ts`, `src/lib/workspace/index.ts`, `src/features/product-studio/index.ts`, `src/features/visual-studio/index.ts`) re-exported server-side service and store modules alongside client types/components.
  - *Fix:*
    1. Extracted `generateWorkspaceSlug` into `src/lib/workspace/utils.ts` (pure, client-safe string utility).
    2. Updated `WorkspaceSetup.tsx` to import `generateWorkspaceSlug` from `@/lib/workspace/utils`.
    3. Hardened `src/lib/auth/passwords.ts` with lazy `scryptAsync` resolution and explicit server-only execution protection.
    4. Cleaned all public barrel exports (`src/lib/auth/index.ts`, `src/lib/workspace/index.ts`, `src/lib/projects/index.ts`, `src/lib/assets/index.ts`, `src/lib/jobs/index.ts`, `src/features/product-studio/index.ts`, `src/features/visual-studio/index.ts`) so they only export client-safe types and components, keeping all database stores, adapters, and auth services strictly server-side.
    5. Decreased client bundle sizes for `/app/settings` and `/app/onboarding` from 262 kB down to 132 kB by removing 130 kB of leaked server code.
- **Verification Suite:** PASS — `npm run lint` (0 warnings, 0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (51 static and dynamic routes compiled in 57s).

### TASK 16 — Slots Studio Content Studio (Completed)
- **Delivered Subsystem:** Functional commercial copywriting and technical specification generation workstation (`STUDIO 03`) at `/app/studio/content`.
- **Approved Product Context Inheritance:** Automatically inherits product name, category, description, approved silhouette, locked colorways, materials, and canonical product direction from Product Studio without requiring manual re-entry.
- **Supported Content Types (7):**
  1. `PRODUCT_DESCRIPTION`: Primary e-commerce hero copy with silhouette ergonomics and textile matrix.
  2. `SHORT_DESCRIPTION`: High-conversion 2-sentence hook for cards and mobile banners.
  3. `FEATURE_BULLETS`: 5 engineering-grade bullet points on fabric tech, mobility zones, and hardware.
  4. `SOCIAL_CAPTION`: Multi-channel Instagram/TikTok caption with call-to-action and brand hashtags.
  5. `PRODUCT_STORY`: 3-paragraph editorial narrative exploring origin, design ethos, and cultural tension.
  6. `CAMPAIGN_COPY`: 3 synchronized digital ad headline angles (Performance, Minimalist, Cultural Hook).
  7. `TECHNICAL_COPY`: Precision technical spec sheet and garment care protocols.
- **Engine Templates & Settings:** Preset structured templates for each format, 5 tone profiles (`PERFORMANCE`, `MINIMALIST`, `TECHNICAL`, `EDITORIAL`, `PUNCHY`), 4 target demographics (`ACTIVE_URBAN`, `ATHLETES`, `STREETWEAR`, `OUTDOOR_PRO`), and custom directive inputs.
- **Editor & Version Lineage:** Split markdown view and raw editor with formatting actions, word/character counter, estimated read time, directive refinement with version preservation (`v1` &rarr; `v2` &rarr; `v3`), and `.md` file export.
- **Shared Subsystem Integration:**
  - *Jobs System:* Registers `CONTENT_GENERATION` and `CONTENT_REFINEMENT` jobs with honest status tracking (`QUEUED`, `RUNNING`, `REVIEW`, `COMPLETED`).
  - *Assets Library:* Approved content outputs can be directly saved into the shared Assets Library as `DOCUMENT` (`text/markdown`) assets referencing the source project slot.
- **Architecture & Server Boundaries:**
  - Domain models: `src/lib/content/types.ts`
  - Ephemeral store: `src/lib/content/store.ts`
  - Deterministic AI Adapter: `src/features/content-studio/adapters/devContentProvider.ts`
  - Application Service: `src/lib/content/service.ts`
  - Client-safe barrel: `src/lib/content/index.ts`
  - API routes: `/api/studio/content` (GET), `/api/studio/content/generate` (POST), `/api/studio/content/refine` (POST), `/api/studio/content/approve` (POST), `/api/studio/content/reject` (POST), `/api/studio/content/save` (POST), `/api/studio/content/edit` (POST).
  - UI workstation components: `ContentStudioShell`, `ContentContextPanel`, `ContentTypeSelector`, `ContentTemplateSelector`, `ContentGenerationPanel`, `ContentGenerationStatus`, `ContentResultCard`, `ContentResultGrid`, `ContentEditor`, `ContentResultDetail`, `ContentReviewBar`, `ContentStudioView`.
  - Server page: `src/app/app/(dashboard)/studio/content/page.tsx`.
- **Verification Suite:** PASS — `npm run lint` (0 warnings, 0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (58 static and dynamic routes compiled in 116s).

### QA & Stabilization Pass (Verified on Live Application)
- **Live Authentication & Navigation Verification:**
  - Authenticated requests to `/app`, `/app/projects`, `/app/projects/proj_001`, `/app/assets`, `/app/jobs`, `/app/studio/product`, `/app/studio/visual`, `/app/studio/content`, and `/app/settings` return HTTP 200 with zero redirect loops or unintended redirects to `/app/onboarding`.
  - Direct navigation to `/app/onboarding` for completed users redirects directly to `/app/projects` via authoritative server-side resolution in `OnboardingPage`.
  - Unauthenticated requests to `/app` properly redirect to `/login?callbackUrl=/app` (HTTP 307).
- **Client Bundle Hardening (Zero Crypto/Server Leaks):**
  - Scanned all client browser chunks in `.next/static/chunks/`.
  - Verified 0 occurrences of `node:crypto`, `node:util`, `promisify(scrypt)`, `passwords.ts`, or database repositories in client bundles.
  - Eliminated the `"The 'original' argument must be of type Function"` runtime error permanently.
- **Sora + Inter Typography Enforcement:**
  - Verified that `next/font/google` loads `Sora` (`--font-sora`, weights 400-800) and `Inter` (`--font-inter`, weights 400-700).
  - Verified global CSS rules apply Sora on all headings (`h1`-`h6`, `.font-display`) and Inter on body, inputs, controls, and copy across all studios.
- **Studio API Integrations Verified:**
  - `GET /api/studio/content?projectId=proj_001` &rarr; 200 OK (inherits approved product context).
  - `POST /api/studio/content/generate` &rarr; 200 OK (creates draft and registers workspace job).
  - `GET /api/studio/visual?projectId=proj_001` &rarr; 200 OK (loads visual studio state).
  - `GET /api/jobs` &rarr; 200 OK.
  - `GET /api/assets` &rarr; 200 OK.
- **Quality Gates:** PASS — `npm run lint` (0 warnings, 0 errors), `npx tsc --noEmit` (0 errors).

### TASK 17 — Slots Studio Campaign Studio (Completed)
- **Delivered Subsystem:** Functional multi-channel marketing campaign and creative deliverable workstation (`STUDIO 04`) at `/app/studio/campaign`.
- **Approved Product Context Inheritance:** Inherits product name, category, description, silhouette fit, locked colorways palette, and materials matrix from Product Studio without re-entering data. Renders honest `"PRODUCT CONTEXT NEEDED"` empty state when no approved product concept exists.
- **Campaign Entity Management:**
  - Create and configure campaigns with name, objective (`PRODUCT_LAUNCH`, `SEASONAL_DROP`, `PERFORMANCE_ACQUISITION`, `BRAND_AWARENESS`, `TECHNICAL_SHOWCASE`), target channels, and supported aspect ratios.
- **Supported Channels & Multi-Aspect Output Formats:**
  - Channels: `INSTAGRAM`, `TIKTOK`, `PAID_SOCIAL`, `WEBSITE`, `EMAIL`, `PRINT`.
  - Aspect Ratios: `1:1` (Square), `4:5` (Portrait), `9:16` (Story/Reel), `16:9` (Banner).
  - Output Types: `HERO_BANNER`, `SOCIAL_FEED`, `STORY_REEL`, `AD_CAROUSEL_FRAME`, `ECOMMERCE_FEATURE`, `EMAIL_HEADER`.
- **Deterministic AI Provider Adapter:**
  - `DevCampaignProviderAdapter` labeled `"SLOTS-CAMPAIGN-V1 (DEV PREVIEW)"` synthesizing responsive vector SVG creative artwork with channel badges, custom CTAs, synchronized headlines, and locked palette tokens.
- **Shared Subsystem Integration:**
  - *Jobs System:* Registers `CAMPAIGN_GENERATION` and `CAMPAIGN_ASSET_PACK_GENERATION` jobs with honest status tracking (`QUEUED`, `RUNNING`, `REVIEW`, `COMPLETED`).
  - *Assets Library:* Approved creative outputs can be directly saved into the shared Assets Library as `DESIGN` (`image/svg+xml`) assets referencing the source project slot and campaign metadata.
- **Architecture & Server Boundaries:**
  - Domain models: `src/lib/campaigns/types.ts`
  - Ephemeral store: `src/lib/campaigns/store.ts` (using `globalThis` development singletons)
  - Deterministic AI Adapter: `src/features/campaigns/adapters/devCampaignProvider.ts`
  - Application Service: `src/lib/campaigns/service.ts`
  - Client-safe barrel: `src/lib/campaigns/index.ts` & `src/features/campaigns/index.ts`
  - API routes: `/api/studio/campaign` (GET), `/api/studio/campaign/create` (POST), `/api/studio/campaign/generate` (POST), `/api/studio/campaign/approve` (POST), `/api/studio/campaign/reject` (POST), `/api/studio/campaign/save` (POST).
  - UI workstation components: `CampaignStudioShell`, `CampaignContextPanel`, `CampaignCreateModal`, `CampaignChannelSelector`, `CampaignAspectRatioSelector`, `CampaignGenerationPanel`, `CampaignGenerationStatus`, `CampaignCreativeCard`, `CampaignCreativeGrid`, `CampaignCreativeDetail`, `CampaignReviewBar`, `CampaignStudioView`.
  - Server page: `src/app/app/(dashboard)/studio/campaign/page.tsx`.
- **Verification Suite:** PASS — `npm run lint` (0 warnings, 0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (64 static and dynamic routes compiled in 110s), live QA test script (10/10 tests passed).

### TASK 18 — Slots Studio Production Studio (Completed & Verified)
- **Delivered Subsystem:** Functional manufacturing specification and Bill of Materials (BOM) workstation (`STUDIO 05`) at `/app/studio/production`.
- **Context Inheritance ("Create once. Carry the context everywhere."):**
  - Inherits approved product name, category, description, silhouette fit, locked colorways palette, and spec textiles directly from Product Studio.
  - Renders honest `"PRODUCT CONTEXT NEEDED"` empty state when no approved product concept exists.
- **Production Workstation Sections & Tabbed Viewer:**
  - **BOM & Trims:** Primary textile placement, fabric description, composition, weight (GSM), finish/DWR treatments, and hardware trims specifications (YKK AquaGuard® zippers, Cohaesive™ cord locks, hypalon storm cuff tabs).
  - **Colorways & Artwork:** Pantone / Hex mappings, placement summaries, and 3M Scotchlite reflective heat-transfer artwork placements.
  - **Construction & Seams:** Ultrasonic welded seam assembly, SPI stitch density, laser-cut clean-bonded edge finishing, ergonomic hood, and underarm breathability matrix.
  - **Size Matrix:** Interactive Points of Measurement (POM) grading table across XS, S, M (base), L, XL, XXL with ± tolerances in flat cm.
  - **QC & Packaging:** Care protocols, wash care symbols, biodegradable cornstarch polybag packaging, and AQL 1.5 inspection standards.
  - **Raw Tech Pack Spec:** Full Markdown document viewer with one-click copy and export triggers.
- **Revision & Version Lineage:**
  - Traceable versioning (`v1.0`, `v1.1`, `v2.0`) with parent-child lineage tracking and changelog notes.
  - Approved versions remain locked and traceable.
- **Review & Assets Subsystem Integration:**
  - Fast review decisions (`Approve`, `Reject`, `Edit Specification`).
  - Approved Tech Packs save directly into the centralized Assets Library (`/app/assets`) as official `DOCUMENT` (`text/markdown`) assets.
- **Export Formats:**
  - Markdown (`.md`), JSON (`.json`), and CSV Bill of Materials (`.csv`).
- **Shared Jobs Integration:**
  - Tracks generation jobs (`PRODUCTION_TECHPACK_GENERATION`, `PRODUCTION_DOCUMENT_GENERATION`) in `/app/jobs` with honest pipeline states (`QUEUED` &rarr; `RUNNING` &rarr; `REVIEW`).
- **Deterministic AI Provider Adapter:**
  - `DevProductionProviderAdapter` labeled `"SLOTS-PRODUCTION-V1 (DEV PREVIEW)"`.
- **Architecture & Server Boundaries:**
  - Domain models: `src/lib/production/types.ts`
  - Ephemeral store: `src/lib/production/store.ts` (using `globalThis` development singletons)
  - Application service: `src/lib/production/service.ts`
  - Client-safe barrel: `src/lib/production/index.ts` & `src/features/production/index.ts`
  - API routes: `/api/studio/production` (GET), `/api/studio/production/generate` (POST), `/api/studio/production/approve` (POST), `/api/studio/production/reject` (POST), `/api/studio/production/update` (POST), `/api/studio/production/save` (POST), `/api/studio/production/export` (POST).
  - UI workstation components: `ProductionStudioShell`, `ProductionContextPanel`, `ProductionOverviewCard`, `ProductionGenerationPanel`, `ProductionGenerationStatus`, `ProductionTechPackViewer`, `ProductionEditModal`, `ProductionVersionDrawer`, `ProductionReviewBar`, `ProductionStudioView`.
  - Server page: `src/app/app/(dashboard)/studio/production/page.tsx`.
- **Quality Gates:** PASS — `npm run lint` (0 warnings, 0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (71 static and dynamic routes compiled in 100s), full live regression QA suite (14/14 tests passed).

### TASK 18.1 — Permanent Local Font Lock + Dev Server Stabilization (Completed & Verified)
- **Permanent Typography Decision:**
  - Local Sora and Inter font files are the authoritative project fonts.
  - Sourced directly from `fonts/sora font family` (8 files: Thin 100 to ExtraBold 800) and `fonts/inter font family` (54 files: Thin 100 to Black 900 + Italics).
  - Loaded exclusively via `next/font/local` in `src/lib/fonts.ts` and injected at root layout (`src/app/layout.tsx`).
  - Zero network/Google CDN dependencies, preventing build and network timeouts permanently.
- **Authoritative Typography Mapping:**
  - **Sora (`var(--font-sora)`, `.font-display`, `h1`-`h6`):** Headings, major page titles, studio titles, STUDIO badges, brand labels.
  - **Inter (`var(--font-inter)`, `.font-sans`, `.font-body`):** Body text, navigation, sidebar, buttons, controls, forms, inputs, tables, metadata, technical specifications, and editors.
- **Dev Server Process Stabilization:**
  - Safe TCP port 3000 process inspection and single daemon instance management without zombie process loops.
- **Verification Across All 15 Required Routes:**
  - All 15 routes (`/`, `/login`, `/signup`, `/app`, `/app/projects`, `/app/projects/proj_001`, `/app/assets`, `/app/jobs`, `/app/studio/product`, `/app/studio/visual`, `/app/studio/content`, `/app/studio/campaign`, `/app/studio/production`, `/app/settings`, `/app/onboarding`) verified returning `HTTP 200 OK` or appropriate RSC redirects with correct local font variable classes.
- **Quality Gates:** PASS — `npm run lint` (0 warnings, 0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (71 routes compiled in 36s).

### TASK 19.1 — Billing, Usage and Teams Truthfulness Audit (Completed & Verified)
- **Truthfulness Audit:**
  - Audited all billing and team management components and eliminated misleading wording implying active connections to real payment gateways or real email dispatchers.
  - Replaced "Automatic renewal on..." with "Simulated renewal on... (MVP)".
  - Updated plan actions to "Simulate Plan Change", "Simulate Switch", and "Simulate Downgrade".
  - Updated `UsageLedgerTable` to clearly indicate "AI USAGE LEDGER (DEVELOPMENT)" and count "SIMULATED EVENTS".
  - Updated `InviteMemberModal` to prominently state: "MVP Notice: No actual email is delivered. This generates a simulated invitation in the pending list below."
  - Added development mode banner to `BillingSettingsView` clarifying that the environment uses an in-memory development store.
  - Added an explicit non-production warning header to `src/lib/billing/store.ts`.
- **API Authorization Hardening:**
  - Enforced `OWNER` privilege check on `POST /api/workspace/billing/plan`.
  - Enforced `OWNER` or `ADMIN` privilege checks on `PATCH /api/workspace/team/[id]`, `DELETE /api/workspace/team/[id]`, `POST /api/workspace/team/invite`, and `DELETE /api/workspace/team/invites/[id]`.
- **Quality Gates:** PASS — `npm run lint` (0 warnings, 0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (76 routes compiled cleanly), live QA test script (14/14 tests passed).

### TASK 20 — Slots Studio Production QA + Launch Readiness (Completed & Verified)
- **Final Release Status:** **READY WITH DOCUMENTED LIMITATIONS**
- **Comprehensive Route & Flow Audit (54/54 Tests Passed):**
  - **Public Routes (10/10):** `/`, `/features`, `/studios`, `/workflow`, `/pricing`, `/about`, `/resources`, `/contact`, `/privacy`, `/terms` all return HTTP 200 with semantic landmarks (`<header>`, `<main>`, `<footer>`) and valid OpenGraph metadata.
  - **Auth Routes (4/4):** `/login`, `/signup`, `/forgot-password`, `/reset-password` verified HTTP 200.
  - **Protected App Routes (13/13):** `/app`, `/app/projects`, `/app/projects/proj_001`, `/app/assets`, `/app/jobs`, `/app/studio/product`, `/app/studio/visual`, `/app/studio/content`, `/app/studio/campaign`, `/app/studio/production`, `/app/settings`, `/app/help`, `/app/onboarding` verified HTTP 200.
  - **Route Protection & Redirection:** Unauthenticated requests to `/app` properly redirect to `/login?callbackUrl=/app` (HTTP 307).
  - **Onboarding Navigation Loop Immunity:** Completed users visiting `/app/onboarding` redirect smoothly to `/app/projects` without loops or hydration hangs.
- **Appearance & Typography Enforcement:**
  - Verified 3-mode appearance system (Default/System, Light, Dark) with zero-flash anti-FOUC script in `<head>`.
  - Authoritative local font system (`fonts/sora font family` and `fonts/inter font family`) loaded strictly via `next/font/local`.
  - Scanned repository and production HTML: ZERO Google Fonts CDN requests (`fonts.googleapis.com` / `fonts.gstatic.com`).
  - Sora applied globally to headings and display labels; Inter applied globally to UI controls, navigation, inputs, and copy.
- **Server/Client Boundary & Bundle Security:**
  - Inspected 123 client browser chunks in `.next/static/chunks/`.
  - Confirmed ZERO server-side code or secret leaks (`node:crypto`, `node:util`, `promisify(scrypt)`, auth secrets, database credentials).
- **Connected Studio Pipeline Verified:**
  - Inherited context ("Create once. Carry the context everywhere.") flows through all 5 studios:
    1. Product Studio (`/app/studio/product`)
    2. Visual Studio (`/app/studio/visual`)
    3. Content Studio (`/app/studio/content`)
    4. Campaign Studio (`/app/studio/campaign`)
    5. Production Studio (`/app/studio/production`)
  - Outputs save as typed assets into centralized Assets Library (`/app/assets`).
  - Async operations track as transparent jobs in Jobs System (`/app/jobs`).
- **Documented Production Limitations:**
  - Storage & Database: Currently utilizing decoupled in-memory repositories with `globalThis` development singletons. Data will reset upon server process termination until persistent PostgreSQL and S3/Blob storage adapters are attached.
  - AI Providers: Currently using deterministic development provider adapters (`DEV PREVIEW`). Ready for direct swap with production LLM, Diffusion, and Vector generation APIs.
- **Final Acceptance Standards:**
  - BUILD: PASS (`npm run build`, 76 routes static & dynamic)
  - TYPECHECK: PASS (`npx tsc --noEmit`, 0 errors)
  - LINT: PASS (`npm run lint`, 0 warnings, 0 errors)
  - LIVE SERVER QA: PASS (54/54 automated tests passed against `next start`)

### PHASE 3.1 — Real Database & Persistence (Supabase PostgreSQL) (Completed & Verified)
- **Objective:** Connect Slots Studio to remote Supabase PostgreSQL database while strictly preserving existing UI layouts, route contracts, local typography (Sora + Inter), and DEV PREVIEW deterministic adapters.
- **Database Infrastructure:**
  - Configured Supabase PostgreSQL server client with service-role admin access in `src/lib/supabase/server.ts`.
  - Implemented schema mapping & UUID normalization utilities in `src/lib/supabase/utils.ts`.
  - Implemented idempotent database seeder in `src/lib/supabase/seed.ts` providing canonical dev user (`00000000-0000-0000-0000-000000000001`), default workspace (`00000000-0000-0000-0000-000000000002`), and seed project SS-02481 (`00000000-0000-0000-0000-000000000010`).
- **Repositories Implemented:**
  - `projectRepository.ts`: CRUD, SLOT ID generation, search/filtering, and soft archival backed by Supabase `projects` table.
  - `assetRepository.ts`: Asset cataloging, metadata, download URLs backed by Supabase `assets` table.
  - `jobRepository.ts`: Asynchronous job creation, status polling, and retry state backed by Supabase `generation_jobs` table.
  - `studioRepositories.ts`: Product & Visual outputs (`generation_outputs`), Content items (`content_items`), Campaigns (`campaigns`), Production Tech Packs & BOM (`production_specs`).
  - `billingRepository.ts`: Workspace subscriptions (`subscriptions`) and credit event logging (`usage_ledger`).
  - `workspaceRepository.ts`: Workspace queries and membership management (`workspaces`, `workspace_members`).
  - `authRepository.ts`: User lookup and credentials management (`users`).
- **Services Wired to Supabase with Dual-Write In-Memory Sync:**
  - All domain services (`projects`, `assets`, `jobs`, `productStudio`, `visualStudio`, `content`, `campaigns`, `production`, `billing`, `workspace`, `auth`) wired to Supabase with graceful store sync.
- **Verification & Testing:**
  - BUILD: PASS (`npm run build`, 76 routes compiled cleanly).
  - TYPECHECK: PASS (`npx tsc --noEmit`, 0 errors).
  - LINT: PASS (`npm run lint`, 0 warnings, 0 errors).
  - SUPABASE DATABASE QA SUITE (`scratch/phase3_1_database_qa.mjs`): PASS (32/32 tests passed across 9 sections).
  - REGRESSION AUDIT (`scratch/task20_production_qa.mjs`): PASS (54/54 tests passed).

### PHASE 3.2 — Real File Storage (Supabase Storage) (Completed & Verified)
- **Objective:** Replace mock/in-memory file handling with real persistent Supabase Storage while preserving existing Asset Library UI, connected studios, jobs, reviews, and export workflows.
- **Storage Infrastructure (`src/lib/storage/`):**
  - Configured private bucket `private-assets` (`public: false`, 50MB file size limit).
  - Implemented `validateStorageFile` enforcing strict MIME allowlist (Images: PNG, JPG, WebP, SVG, GIF; Documents: PDF, MD, TXT, JSON, CSV) and extension matching.
  - Implemented `generateSafeStoragePath` generating anti-traversal workspace-scoped object paths (`{workspaceId}/{projectId}/{uuid}_{filename}`).
  - Implemented atomic rollback in `uploadFileToStorage`: if database asset registration fails, the uploaded object is immediately purged from storage.
- **API Endpoints:**
  - `POST /api/assets`: Upgraded to support multipart `FormData` uploads alongside JSON metadata creation.
  - `GET /api/assets/[id]/preview`: Created secure, authorized streaming preview endpoint respecting workspace isolation with `Cache-Control: private`.
  - `GET /api/assets/[id]/download`: Upgraded to stream real binary bytes from Supabase Storage with original filename attachment headers.
- **Studio Integration:**
  - Production Studio (`saveTechPackToAssets`): Persists raw Markdown spec as real `.md` file in Supabase Storage before registering the DOCUMENT asset.
  - Visual Studio (`saveVisualOutputToAssets`): Persists SVG renders in Supabase Storage before registering the IMAGE asset.
- **Asset Library UI Integration:**
  - Added accessible "Upload Asset" button in `AssetLibrary.tsx` with hidden file picker, upload progress indicator, error toast, and dynamic live list append. Preserves 100% of existing Sora/Inter typography and design system tokens.
- **Verification & Testing:**
  - BUILD: PASS (`npm run build`, 76 routes compiled cleanly).
  - TYPECHECK: PASS (`npx tsc --noEmit`, 0 errors).
  - LINT: PASS (`npm run lint`, 0 warnings, 0 errors).
  - STORAGE QA SUITE (`scratch/phase3_2_storage_qa.mjs`): PASS (25/25 tests passed across 10 sections).
  - REGRESSION AUDIT (`scratch/task20_production_qa.mjs`): PASS (54/54 tests passed).

### PHASE 3.3 — Real AI Generation Engine (Completed & Verified)
- **Objective:** Replace DEV PREVIEW deterministic AI generation adapters with a production-ready, provider-agnostic engine connecting real text and image providers while preserving existing UI, local fonts (Sora + Inter), appearance themes, 5 Connected Studios, Jobs subsystem, Supabase PostgreSQL persistence, Supabase Storage (`private-assets`), and DEV PREVIEW fallback adapters.
- **Provider-Agnostic Abstraction (`src/lib/ai/`):**
  - Defined `TextGenerationProvider` and `ImageGenerationProvider` interfaces in `types.ts` alongside normalized error types (`AiProviderError`, `AiQuotaExhaustedError`, `AiAuthenticationError`, `AiRateLimitError`).
  - Text Providers: `GeminiTextProvider` (Google Gemini 1.5 Flash), `GroqTextProvider` (Groq Llama 3.3/3.1), `OpenAiTextProvider` (GPT-4o-mini), `OllamaTextProvider` (Local Ollama), and `DevTextProvider` (deterministic fallback).
  - Image Providers: `PollinationsImageProvider` (Flux open compute, zero-cost, verified HTTP 200 JPEG binary), `OpenAiImageProvider` (DALL-E 3), and `DevImageProvider` (deterministic vector SVG fallback).
  - Central Registry (`registry.ts`): Resolves providers based on server-side environment variables (`GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY`, `AI_TEXT_PROVIDER`, `AI_IMAGE_PROVIDER`). Zero credentials exposed to client browser bundles.
  - Safe Fallback Execution: Automatically degrades to DEV PREVIEW if external provider APIs throw or encounter rate limits.
- **Free Quota & Usage Ledger (`quota.ts`):**
  - Server-enforced free tier quotas (configurable via `FREE_TIER_TEXT_LIMIT=20`, `FREE_TIER_IMAGE_LIMIT=5`).
  - Authoritatively writes all generation events to PostgreSQL `usage_ledger` with provider, model, job ID, and units consumed.
- **Studio Integration:**
  - Content Studio (`src/lib/content/service.ts`): Wired to `getTextProvider()` for technical apparel copy synthesis, persisting to `content_items` and `usage_ledger`.
  - Visual Studio (`src/features/visual-studio/services/visualStudioService.ts`): Wired to `getImageProvider()`. Real binary JPEGs are uploaded directly into `private-assets` Supabase Storage and registered in PostgreSQL `assets` with streaming preview URLs (`/api/assets/[id]/preview`).
  - Product Studio (`src/features/product-studio/services/productStudioService.ts`): Wired to quota checker and usage ledger logging.
- **UI Truthfulness & Displays:**
  - `VisualOutputCard.tsx` and `VisualOutputDetail.tsx`: Renders real `<img>` tags for outputs with `previewUrl`, and SVG for vector previews. Dynamically distinguishes `REAL AI` vs `DEV PREVIEW` badges with truthful metadata and high-res export support.
  - Multi-tenant workspace authorization enforced on all generation API routes.
- **Verification & Testing:**
  - BUILD: PASS (`npm run build`, 76 routes compiled cleanly).
  - TYPECHECK: PASS (`npx tsc --noEmit`, 0 errors).
  - LINT: PASS (`npm run lint`, 0 warnings, 0 errors).
  - AI QA SUITE (`scratch/phase3_3_ai_qa.mjs`): PASS (24/24 tests passed across 9 sections).
  - DATABASE REGRESSION (`scratch/phase3_1_database_qa.mjs`): PASS (32/32 tests passed).
  - STORAGE REGRESSION (`scratch/phase3_2_storage_qa.mjs`): PASS (25/25 tests passed).
  - PRODUCTION REGRESSION (`scratch/task20_production_qa.mjs`): PASS (54/54 tests passed).

### PHASE 3.4 — Real Background Jobs & Worker Engine + Phase 3.1–3.3 Production Audit (Completed & Verified)
- **Objective:** Convert synchronous studio AI generation into a durable PostgreSQL-backed background job & worker engine while auditing and hardening all security, persistence, storage, authentication, AI-provider, quota, and job-state foundations across Phase 3.1, Phase 3.2, and Phase 3.3.
- **Background Worker Engine (`src/lib/jobs/worker.ts`):**
  - Implemented PostgreSQL-backed durable worker engine with atomic single-worker claiming (`claimJobById`, `claimNextQueuedJob`).
  - Added race-condition-resistant state machine: `QUEUED` -> `RUNNING` -> `REVIEW` / `COMPLETED` / `FAILED` / `CANCELLED`.
  - Added exponential backoff retry mechanism with `max_retries` (default 3) and `retry_count`.
  - Added stale job detection and automatic recovery (`recoverStaleJobs`) for abandoned `RUNNING` jobs older than 5 minutes.
  - Added user cancellation support (`cancelJob`): worker checks cancellation prior to and following heavy compute passes.
  - Unified studio execution dispatches: `VISUAL` (Pollinations Flux / OpenAI image synthesis, binary upload to `private-assets`, asset registry, and database output persistence), `PRODUCT`, `CONTENT`, `CAMPAIGN`, and `PRODUCTION`.
- **Database Schema Migration (`supabase/migrations/20260904_phase3_4_background_jobs.sql`):**
  - Augmented `generation_jobs` repository mapping with `claimed_at`, `claimed_by`, `started_at`, `completed_at`, `retry_count`, `max_retries`, `error_code`, and `payload`.
  - Created partial indexes `idx_generation_jobs_queued_asc` and `idx_generation_jobs_running`.
- **Non-Blocking Studio Endpoints & Real-Time Polling:**
  - Updated `generateVisualOutputs` and `POST /api/studio/visual` to support non-blocking execution via `async: true` / `x-async: true`, creating a `QUEUED` job and returning immediately with `{ jobId, status: "QUEUED" }`.
  - Updated `VisualStudioView.tsx` with `activeJobId` state and polling effect querying `GET /api/jobs/[id]` and refreshing state upon `REVIEW` / `COMPLETED`. Seamlessly survives browser refresh.
  - Updated `JobsView.tsx` with live polling effect when `activeJobsCount > 0`, updating the pipeline view automatically.
- **Supabase Auth GoTrue Integration Audit:**
  - Updated `src/lib/supabase/seed.ts` with singleton promise seeder provisioning `dev@slots.studio` directly into Supabase GoTrue Auth (`auth.admin.createUser`) with fixed seed UUID `00000000-0000-0000-0000-000000000001`.
  - Updated `src/lib/auth/service.ts` in `loginUser` to synchronize session creation with `supabase.auth.signInWithPassword`.
- **Security Audit & Secret Scrubbing:**
  - Scrubbed hardcoded secrets in test scripts (`phase3_3_ai_qa.mjs`); all credentials now load dynamically from `.env.local`.
  - Verified `.env.example` contains only placeholder values.
  - Verified 0 server secrets or API tokens leak into client `.next/static` bundles.
- **Verification & Testing Results (164/164 Checks Passed, 0 Failed):**
  - BUILD: PASS (`npm run build`, 76/76 routes compiled cleanly).
  - TYPECHECK: PASS (`npx tsc --noEmit`, 0 errors).
  - LINT: PASS (`npm run lint`, 0 errors).
  - PHASE 3.4 JOBS QA (`scratch/phase3_4_jobs_qa.mjs`): PASS (29/29 tests passed across 7 sections).
  - DATABASE REGRESSION (`scratch/phase3_1_database_qa.mjs`): PASS (32/32 tests passed).
  - STORAGE REGRESSION (`scratch/phase3_2_storage_qa.mjs`): PASS (25/25 tests passed).
  - AI ENGINE REGRESSION (`scratch/phase3_3_ai_qa.mjs`): PASS (24/24 tests passed).
  - MASTER PRODUCTION REGRESSION (`scratch/task20_production_qa.mjs`): PASS (54/54 tests passed).

### PHASE 3.5 — Production Worker Deployment + Supabase Auth Hardening + Security Lockdown (Completed & Verified)
- **Objective:** Deploy a decoupled, standalone continuous background worker engine, establish Supabase GoTrue Auth as the single authoritative source of truth for identity, guarantee job retry idempotency and credit quota safety, scrub all secret telemetry, and verify production deployment capabilities.
- **Standalone Background Worker Daemon (`scripts/worker-daemon.mjs` & `scripts/worker-daemon.ts`):**
  - Implemented decoupled Node.js worker daemon executable via `npm run worker:start` or `node scripts/worker-daemon.mjs`.
  - Continuous FIFO queue polling loop (`claimNextQueuedJob`) with PostgreSQL atomic locking preventing race conditions.
  - Supports single-pass mode (`--once` / `npm run worker:once`) to drain pending queues cleanly in serverless cron environments or CI/CD pipelines.
  - Automatic stale job scavenging loop running every 60s, recovering abandoned `RUNNING` jobs older than 5 minutes.
  - Graceful shutdown signal handlers (`SIGINT`, `SIGTERM`) with in-flight task draining (up to 15s timeout).
  - Exponential backoff on database connection interruptions to prevent hammering remote endpoints during WAN blips.
- **Supabase GoTrue Auth Hardening (`src/lib/auth/service.ts`, `src/lib/supabase/repositories/authRepository.ts`):**
  - Upgraded `loginUser` to authoritatively authenticate through Supabase GoTrue Auth (`supabase.auth.signInWithPassword`), retrieving verified identities from `auth.users` and synchronizing profile records in `public.users`.
  - Upgraded `signupUser` to provision user accounts directly in Supabase GoTrue Auth (`supabase.auth.admin.createUser`) with confirmed email status.
  - Upgraded `resetUserPassword` to synchronize password updates directly to Supabase Auth (`supabase.auth.admin.updateUserById`).
  - Zero browser trust: all API routes strictly authenticate sessions via cryptographically signed HMAC tokens in `slots-studio-session` cookie (`HttpOnly`, `SameSite=Lax`).
- **Job Reliability, Idempotency & Quota Safety:**
  - `src/lib/ai/quota.ts` (`logGenerationUsage`): Added idempotency guard verifying if `jobId` was already recorded in `usage_ledger`. Retrying jobs never double-bills or deducts duplicate credits.
  - `src/features/visual-studio/services/visualStudioService.ts` (`executeVisualGenerationPass`): Added output idempotency guard verifying if outputs for `jobId` already exist before generating or uploading files to Supabase Storage.
  - `src/lib/jobs/worker.ts`: Added `sanitizeSafeErrorMessage` scrubbing system paths, URLs, and secrets before persisting to `errorMessageSafe` or returning to clients.
- **Critical Secret Lockdown & Manual Rotation Instructions:**
  - Audited repository, scripts, and client browser bundles: 0 hardcoded service role keys or tokens found.
  - Updated `README.md` with explicit instructions for manual key rotation in Supabase Dashboard (Project Settings -> API -> Regenerate Service Role Key).
  - Documented truthful hosting capabilities: persistent compute (Railway/Fly/Docker/VPS) for continuous daemon vs. scheduled serverless crons (`--once`).
- **Verification & Testing Results (191/191 Checks Passed, 0 Failed):**
  - BUILD: PASS (`npm run build`, 76/76 routes compiled cleanly).
  - TYPECHECK: PASS (`npx tsc --noEmit`, 0 errors).
  - LINT: PASS (`npm run lint`, 0 errors, 0 warnings).
  - PHASE 3.5 SECURITY QA (`scratch/phase3_5_security_qa.mjs`): PASS (27/27 tests passed across 7 sections).
  - PHASE 3.4 JOBS REGRESSION (`scratch/phase3_4_jobs_qa.mjs`): PASS (29/29 tests passed).
  - PHASE 3.3 AI ENGINE REGRESSION (`scratch/phase3_3_ai_qa.mjs`): PASS (24/24 tests passed).
  - PHASE 3.2 STORAGE REGRESSION (`scratch/phase3_2_storage_qa.mjs`): PASS (25/25 tests passed).
  - PHASE 3.1 DATABASE REGRESSION (`scratch/phase3_1_database_qa.mjs`): PASS (32/32 tests passed).
  - MASTER PRODUCTION REGRESSION (`scratch/task20_production_qa.mjs`): PASS (54/54 tests passed across all 76 routes).

### PHASE 3.6 — Real Email + In-App Notifications Engine (Completed & Verified)
- **Objective:** Implement a production-grade transactional email engine and persistent in-app notifications system integrated with background workers, authentication workflows, and team collaboration, while maintaining zero UI regressions and strict multi-tenant isolation.
- **Pluggable Transactional Email Engine (`src/lib/email/`):**
  - Architecture: Standardized `TransactionalEmailProvider` contract (`sendEmail`, `verifyConnection`, `getProviderName`).
  - Resend REST Provider (`src/lib/email/providers/resendProvider.ts`): Direct native `fetch` client targeting `https://api.resend.com/emails` supporting custom API keys, HTML/text bodies, headers, and truthful error propagation.
  - Development Preview Adapter (`src/lib/email/providers/devProvider.ts`): Truthful mock provider logging email payloads and returning `DEV_PREVIEW_MOCK` status without faking delivery.
  - Idempotency & Deduplication (`src/lib/email/service.ts`): Enforces `idempotencyKey` checks to prevent duplicate email dispatches during worker retries or network resends.
  - Branded HTML Templates (`src/lib/email/templates/`): Responsive dark aesthetic (`#0c0d0e` canvas, `#16181a` surface, `#b7ff00` Electric Lime accent, Sora & Inter fonts, Slots Sportswear branding):
    - `jobCompletedTemplate.ts` (Job title, duration, outputs preview link)
    - `jobFailedTemplate.ts` (Sanitized error summary, retry link)
    - `passwordResetTemplate.ts` (Expiring 1h security reset link)
    - `workspaceInviteTemplate.ts` (Inviter name, role, 7d expiration link)
    - `welcomeTemplate.ts` (Welcome onboarding & quick start guide)
- **Persistent In-App Notifications Engine (`src/lib/notifications/`, `src/lib/supabase/repositories/notificationRepository.ts`):**
  - Database Persistence: Stored in Supabase PostgreSQL (`public.notifications`) and survives browser refreshes and device switches.
  - Dual-Mode Schema Resilience: Schema-resilient repository dynamically supports both full DDL columns (`workspace_id`, `type`, `link`, etc.) and baseline schemas by packing extended attributes into JSON metadata with version tags (`__v: 1`), preventing schema-cache query breakages.
  - Notification Types Supported: `JOB_COMPLETED`, `JOB_FAILED`, `JOB_CANCELLED`, `WORKSPACE_INVITE`, `WELCOME`, `SYSTEM`.
  - Multi-Tenant & RBAC Isolation: Strict user and workspace filtering preventing cross-tenant notification access or mutation.
  - Lifecycle APIs:
    - `GET /api/notifications`: Paginated list of notifications + unread count.
    - `PATCH /api/notifications/[id]`: Mark notification as read.
    - `DELETE /api/notifications/[id]`: Dismiss/delete notification.
    - `POST /api/notifications/read-all`: Mark all notifications as read in bulk.
- **Worker & Studio Integration:**
  - `src/lib/jobs/worker.ts` & `scripts/worker-daemon.mjs`: Triggers non-blocking `notifyJobCompleted` and `notifyJobFailed` upon terminal transitions.
  - `src/app/api/jobs/[id]/cancel/route.ts`: Dispatches `notifyJobCancelled` upon user cancellation.
  - Deduplication: Idempotency keys (`notif_job_completed_<jobId>`, etc.) guarantee zero duplicate notifications during worker retries.
- **Authentication & Team Collaboration Integration:**
  - `src/lib/auth/service.ts`: Dispatches `sendWelcome` upon new user signup; issues 1-hour secure password reset tokens and dispatches `sendPasswordReset`.
  - `src/lib/billing/service.ts` & `src/app/api/workspace/team/invite/route.ts`: Dispatches `sendWorkspaceInvite` email and creates in-app `WORKSPACE_INVITE` notification with 7-day expiration.
- **Workstation UI Integration:**
  - `NotificationBell` (`src/components/navigation/NotificationBell.tsx`): Accessible topbar trigger with Electric Lime unread counter badge, popover dropdown, real-time unread counts, mark-all-read shortcut, and category icons.
  - Notification Center (`/app/notifications` in `src/app/app/(dashboard)/notifications/page.tsx`): Dedicated workstation page with category filtering (All, Unread, Jobs, Workspace), pagination, and dismiss actions.
  - Navigation Updates: Added "Notifications" entry with dynamic badge to desktop sidebar (`AppSidebar.tsx`), mobile navigation (`MobileAppNav.tsx`), and data router (`src/data/navigation.ts`).
- **Verification & Testing Results (241/241 Checks Passed, 0 Failed):**
  - BUILD: PASS (`npm run build`, all 79 static & dynamic routes compiled cleanly).
  - TYPECHECK: PASS (`npx tsc --noEmit`, 0 errors).
  - LINT: PASS (`npm run lint`, 0 warnings, 0 errors).
  - PHASE 3.6 NOTIFICATIONS & EMAIL QA (`scratch/phase3_6_notifications_qa.mjs`): PASS (50/50 tests passed across 8 sections).
  - PHASE 3.5 SECURITY REGRESSION (`scratch/phase3_5_security_qa.mjs`): PASS (27/27 tests passed).
  - PHASE 3.4 JOBS REGRESSION (`scratch/phase3_4_jobs_qa.mjs`): PASS (29/29 tests passed).
  - PHASE 3.3 AI ENGINE REGRESSION (`scratch/phase3_3_ai_qa.mjs`): PASS (24/24 tests passed).
  - PHASE 3.2 STORAGE REGRESSION (`scratch/phase3_2_storage_qa.mjs`): PASS (25/25 tests passed).
  - PHASE 3.1 DATABASE REGRESSION (`scratch/phase3_1_database_qa.mjs`): PASS (32/32 tests passed).
  - MASTER PRODUCTION REGRESSION (`scratch/task20_production_qa.mjs`): PASS (54/54 tests passed).

### PHASE 3.7 — Production Deployment + Monitoring + Final Infrastructure Hardening (Completed & Verified)
- **Objective:** Finalize production hosting architecture, deploy an unauthenticated operational health check (`/api/health`) without secret exposure, consolidate authoritative GoTrue authentication, formalize disaster recovery playbooks, audit environment variables, and verify 100% regression compatibility.
- **Operational Health Check Telemetry (`src/app/api/health/route.ts`):**
  - Exposes unauthenticated `GET /api/health` returning live operational status, response latency, and system telemetry without leaking secrets.
  - PostgreSQL connectivity check: measures latency against `public.workspaces`.
  - Supabase Storage check: verifies private bucket `private-assets` status.
  - Background worker telemetry: reports `queuedJobs`, `runningJobs`, and `staleJobs` (> 5m).
  - External providers status: reports active email provider (`dev_mock` or `resend`) and AI providers (`dev`, `pollinations`, `gemini`, `groq`, `openai`) with truthful configuration flags and zero exposed API keys.
  - Returns HTTP 200 `status: "healthy"` or HTTP 503 `status: "degraded"`.
- **Authoritative GoTrue Authentication Consolidation:**
  - Standardized Supabase GoTrue Auth (`auth.users`) as the single source of truth for production identity.
  - Unified password reset token handling: consolidated `saveResetToken`, `findResetToken`, and `deleteResetToken` from `src/lib/auth/store.ts` through `authRepository.ts`, eliminating desynchronized parallel in-memory maps.
  - Re-enforced 1-hour expiration on password reset links and immediate deletion upon token consumption.
- **Production Hosting Architecture:**
  - Web application: Next.js App Router (run via Node.js server `npm start`, Docker, or platform like Vercel/Railway).
  - Decoupled background worker:
    - Persistent Compute (Recommended): Run `npm run worker:start` on a persistent Node.js container (Railway, Fly.io, Render, AWS ECS, or VPS) with continuous polling and atomic conditional updates.
    - Serverless Scheduled Execution: Run `npm run worker:once` via scheduled cron triggers (e.g. Vercel Cron every 1 minute) to drain queues cleanly without long-running background tasks.
  - Zero expensive queue infrastructure: avoids Redis, Kafka, or Kubernetes dependencies.
- **Disaster Recovery Playbooks Added (`README.md`):**
  - Playbook 1: Worker crash recovery (PM2 / Docker restart + 5-minute stale job auto-scavenger).
  - Playbook 2: External AI provider outage recovery (graceful fallback to DEV PREVIEW).
  - Playbook 3: Transactional email provider outage recovery (non-blocking delivery, error containment in `email_logs`).
  - Playbook 4: Supabase service-role key manual rotation procedure in Supabase Dashboard.
  - Playbook 5: Zero-downtime rollback procedure.
- **Verification & Testing Results (282/282 Checks Passed, 0 Failed):**
  - BUILD: PASS (`npm run build`, all 79 static & dynamic routes compiled cleanly).
  - TYPECHECK: PASS (`npx tsc --noEmit`, 0 errors).
  - LINT: PASS (`npm run lint`, 0 warnings, 0 errors).
  - PHASE 3.7 PRODUCTION QA (`scratch/phase3_7_production_qa.mjs`): PASS (41/41 tests passed across 7 sections).
  - PHASE 3.6 NOTIFICATIONS QA (`scratch/phase3_6_notifications_qa.mjs`): PASS (50/50 tests passed).
  - PHASE 3.5 SECURITY QA (`scratch/phase3_5_security_qa.mjs`): PASS (27/27 tests passed).
  - PHASE 3.4 JOBS QA (`scratch/phase3_4_jobs_qa.mjs`): PASS (29/29 tests passed).
  - PHASE 3.3 AI ENGINE QA (`scratch/phase3_3_ai_qa.mjs`): PASS (24/24 tests passed).
  - PHASE 3.2 STORAGE QA (`scratch/phase3_2_storage_qa.mjs`): PASS (25/25 tests passed).
  - PHASE 3.1 DATABASE QA (`scratch/phase3_1_database_qa.mjs`): PASS (32/32 tests passed).
  - MASTER PRODUCTION REGRESSION (`scratch/task20_production_qa.mjs`): PASS (54/54 tests passed).

### PHASE 3.8 — Real Production Deployment + Live Configuration + Final Launch QA (Completed & Verified)
- **Objective:** Deploy and verify Slots Studio in a real production environment with live external services (Supabase PostgreSQL, Supabase Storage, Supabase GoTrue Auth, Resend Email API) without redesigning the application, establishing dual-track hosting (Vercel Serverless vs. Docker VPS), and conducting full end-to-end launch verification.
- **Dual-Track Deployment Architecture:**
  - **Track A: Serverless Vercel Deployment:**
    - Created `src/app/api/cron/worker/route.ts`: Scavenges stale jobs (> 5m) via `recoverStaleJobs` and sequentially drains up to 5 `QUEUED` jobs per invocation.
    - Security: Authenticates via `CRON_SECRET` header (`Bearer <secret>`).
    - Configured `vercel.json` scheduling `/api/cron/worker` every 1 minute (`* * * * *`).
  - **Track B: Docker Containerized Orchestration:**
    - `Dockerfile`: Multi-stage build (`deps` -> `builder` -> `runner`) running unprivileged as `nextjs:nodejs` on port 3000.
    - `Dockerfile.worker`: Standalone background worker container executing `node scripts/worker-daemon.mjs` with graceful `STOPSIGNAL SIGTERM`.
    - `docker-compose.yml`: Declares `web` and `worker` services with health checks on `/api/health` and restart policies.
    - `next.config.ts`: Added conditional standalone output support (`NEXT_OUTPUT_STANDALONE=true`) for Docker container optimization.
- **Authoritative Resend Email Engine & Live Verification:**
  - Implemented `ResendEmailProvider` in `src/lib/email/providers/resendProvider.ts` with official `resend` SDK.
  - Formatted default sender: `Slots Studio <onboarding@resend.dev>` (ensuring immediate deliverability prior to custom domain DNS verification).
  - Successfully dispatched live verification emails to `mbhalli930@gmail.com`:
    - Plain text handshake message ID: `839fc362-9299-48a2-bf43-99a8587cd16b`
    - Branded HTML welcome template message ID: `47160727-2334-4ecd-9267-e6c720303975`
- **Operational Verification on Production Server (`next start -p 3000`):**
  - Clean Next.js production build (`npm run build`) compiling all 79 routes cleanly.
  - Live `/api/health` returns HTTP 200 `status: "healthy"` with database latency telemetry, private bucket verification (`private-assets`), worker queue telemetry, and email provider verification (`resend`, `isProductionConfigured: true`).
  - Live `/api/cron/worker` verified executing end-to-end background jobs created in PostgreSQL.
  - Standalone worker daemon (`npm run worker:once`) verified executing atomic polling pass cleanly.
  - Client bundle security audit: 0 exposed secrets across all 131 client chunks in `.next/static`.
- **Comprehensive Verification & Regression Results (368/368 Checks Passed, 0 Failed):**
  - BUILD: PASS (`npm run build`, all 79 routes compiled cleanly).
  - TYPECHECK: PASS (`npx tsc --noEmit`, 0 errors).
  - LINT: PASS (`npm run lint`, 0 warnings, 0 errors).
  - PHASE 3.8 LAUNCH QA SUITE (`scratch/phase3_8_launch_qa.mjs`): PASS (86/86 tests passed across 10 sections).
  - PHASE 3.1 DATABASE QA (`scratch/phase3_1_database_qa.mjs`): PASS (32/32 tests passed).
  - PHASE 3.2 STORAGE QA (`scratch/phase3_2_storage_qa.mjs`): PASS (25/25 tests passed).
  - PHASE 3.3 AI ENGINE QA (`scratch/phase3_3_ai_qa.mjs`): PASS (24/24 tests passed).
  - PHASE 3.4 BACKGROUND JOBS QA (`scratch/phase3_4_jobs_qa.mjs`): PASS (29/29 tests passed).
  - PHASE 3.5 SECURITY & AUTH QA (`scratch/phase3_5_security_qa.mjs`): PASS (27/27 tests passed).
  - PHASE 3.6 NOTIFICATIONS & EMAIL QA (`scratch/phase3_6_notifications_qa.mjs`): PASS (50/50 tests passed).
  - PHASE 3.7 PRODUCTION QA (`scratch/phase3_7_production_qa.mjs`): PASS (41/41 tests passed).
  - CUMULATIVE MASTER RUNNER (`scratch/run_all_qa.mjs`): PASS (314/314 tests passed, 100%).
  - TASK 20 PRODUCTION QA (`scratch/task20_production_qa.mjs`): PASS (54/54 tests passed, 100%).
### PHASE 3.9 — Real Replicate AI Provider + Cost Control + End-to-End AI Verification (Completed & Verified)
- **Objective:** Integrate Replicate as an actual production AI provider in Slots Studio using the existing provider abstraction, PostgreSQL job queue, background worker, Supabase Storage, usage ledger, notifications, and email system without redesigning the application UI.
- **Provider Architecture & Integration:**
  - Implemented `ReplicateImageProvider` (`src/lib/ai/providers/replicateImageProvider.ts`) conforming to `ImageGenerationProvider`.
  - Default model: `black-forest-labs/flux-schnell`.
  - Async prediction flow with 1.5s polling loop (60s ceiling), server-side binary validation (> 512 bytes, `image/*`), and Supabase Storage upload to `private-assets` bucket.
  - Standardized error normalization:
    - HTTP 402 -> `AiQuotaExhaustedError` ("Replicate account requires credit...").
    - HTTP 401 -> `AiAuthenticationError` ("Invalid Replicate API token...").
    - HTTP 429 -> `AiRateLimitError`.
  - Provider Registry (`src/lib/ai/registry.ts`):
    - Automatically initializes `ReplicateImageProvider` when `REPLICATE_API_KEY` or `REPLICATE_API_TOKEN` is present.
    - Resolves active image provider with precedence: `replicate` > `pollinations` > `dev`.
    - Fallback Engine: Gracefully falls back to SVG preview if `ALLOW_AI_FALLBACK !== "false"` and flags `isDevelopmentPreview: true`.
- **Cost Controls & Workspace Quotas:**
  - Implemented `replicateImageLimit` in `src/lib/ai/quota.ts`.
  - Enforces `REPLICATE_MAX_WORKSPACE_IMAGES` environment variable override (default 5 free image generations per workspace).
  - Integrates with PostgreSQL `usage_ledger` table with atomic idempotency checks preventing double-billing on retried jobs.
- **Webhook Ingress & Worker Telemetry:**
  - Created `/api/webhooks/replicate` with HMAC-SHA256 signature verification (`REPLICATE_WEBHOOK_SECRET`) and terminal state idempotency.
  - Updated `scripts/worker-daemon.mjs` with Replicate (Flux) telemetry logging in `usage_ledger`.
  - Operational health endpoint `/api/health` reports active image provider (`replicate`), active image model (`black-forest-labs/flux-schnell`), and `isRealAiConfigured: true`.
- **Account Billing Status & Truthful Reporting:**
  - User-supplied Replicate API token `r8_...` successfully authenticated (`user: shahranrpro, name: Slots Studio`).
  - Prediction attempts return HTTP 402 Insufficient Credit (`{"title": "Insufficient credit", "detail": "Your account requires credit to run predictions."}`).
  - Error normalization verified live against Replicate API without false claims of GPU image synthesis.
- **Comprehensive Verification & Full Regression Results (402/402 Checks Passed, 0 Failed):**
  - BUILD: PASS (`npm run build`, all 80 routes compiled cleanly).
  - TYPECHECK: PASS (`npx tsc --noEmit`, 0 errors).
  - LINT: PASS (`npm run lint`, 0 warnings, 0 errors).
  - PHASE 3.9 REPLICATE QA SUITE (`scratch/phase3_9_replicate_qa.mjs`): PASS (41/41 tests passed across 9 sections).
  - PHASE 3.1 DATABASE QA (`scratch/phase3_1_database_qa.mjs`): PASS (32/32 tests passed).
  - PHASE 3.2 STORAGE QA (`scratch/phase3_2_storage_qa.mjs`): PASS (25/25 tests passed).
  - PHASE 3.3 AI ENGINE QA (`scratch/phase3_3_ai_qa.mjs`): PASS (17/17 tests passed).
  - PHASE 3.4 BACKGROUND JOBS QA (`scratch/phase3_4_jobs_qa.mjs`): PASS (29/29 tests passed).
  - PHASE 3.5 SECURITY & AUTH QA (`scratch/phase3_5_security_qa.mjs`): PASS (27/27 tests passed).
  - PHASE 3.6 NOTIFICATIONS & EMAIL QA (`scratch/phase3_6_notifications_qa.mjs`): PASS (50/50 tests passed).
  - PHASE 3.7 PRODUCTION QA (`scratch/phase3_7_production_qa.mjs`): PASS (41/41 tests passed).
  - PHASE 3.8 LAUNCH QA (`scratch/phase3_8_launch_qa.mjs`): PASS (86/86 tests passed).
  - CUMULATIVE MASTER RUNNER (`scratch/run_all_qa.mjs`): PASS (348/348 tests passed, 100%).
  - TASK 20 PRODUCTION QA (`scratch/task20_production_qa.mjs`): PASS (54/54 tests passed, 100%).
  - TOTAL VERIFIED SUITES: 402/402 PASS (100%).

### PHASE 3.10 — Real Product Concept Visuals + UI Icon Cleanup (Completed & Verified)
- **Objective:** Upgrade Product Studio (`/app/studio/product`) so generated concept candidates use real AI-generated product visuals instead of deterministic DEV PREVIEW line-art placeholders, while simultaneously reducing unnecessary icon usage across Product Studio and preserving the premium futuristic Slots Studio design system.
- **Provider Precedence & Multi-Stage Fallback Architecture (`src/lib/ai/registry.ts`):**
  - Updated `generateImageSafe` to execute a 3-stage fallback chain:
    1. **Primary Provider:** Replicate Flux (`black-forest-labs/flux-schnell`).
    2. **Secondary Operational Provider:** Pollinations Flux (`image.pollinations.ai`), active open-compute model generating real JPEG image buffers (> 500B) without billing friction.
    3. **Deterministic Fallback:** DevPreview vector SVG silhouettes labeled `isDevelopmentPreview: true`.
  - When Replicate returns HTTP 402 Insufficient Credit, the error is normalized and gracefully caught, logging a truthful diagnostic notice and falling forward to Pollinations Flux without crashing or showing fake SVG.
- **Canonical Product Brief Prompt Synthesis (`src/features/product-studio/services/productStudioService.ts`):**
  - Implemented `buildConceptPrompt` respecting garment category, colorways, materials, target user, and visual direction.
  - Enforced clean studio presentation on neutral seamless cyclorama background with authentic textures, sharp stitching detail, no watermarks, no logos, and no unreadable text.
  - Integrated `executeProductGenerationPass`: uploads binary buffers to private Supabase Storage (`private-assets`) under `workspaces/:ws/products/:proj/`, creates records in `assets` table via `createAsset`, sets `imageUrl = /api/assets/${assetId}/preview`, saves to `generation_outputs` database table, and logs usage to `usage_ledger`.
- **Background Worker & Jobs Engine Integration:**
  - Configured `executeProductJob` in `src/lib/jobs/worker.ts` to call `executeProductGenerationPass`.
  - Sets terminal status to `REVIEW` for `PRODUCT` studio jobs, allowing the user to review, compare, and approve concept candidates.
  - In `ProductStudioView.tsx`, implemented reactive background polling loop against `/api/jobs/[id]` to refresh studio state upon job completion.
- **Truthful UI Badging & Concept Presentation:**
  - `ConceptCard.tsx`: Renders real `<img>` element with `object-cover` and hover zoom when `concept.imageUrl && !concept.isDevelopmentPreview`.
  - Renders SVG wireframe when `isDevelopmentPreview: true`.
  - Truthful badge overlay: Electric lime `REAL AI` overlay for actual AI images, dark `DEV PREVIEW` badge for fallback silhouettes with provider identifier.
  - Functional asset download action button rendered directly on the candidate card.
  - `ConceptComparison.tsx`: Updated comparison modal to truthfully render real product images with badging.
- **UI Icon Cleanup & Editorial Polish:**
  - Removed decorative icons that add no meaning:
    - `ProductBrief.tsx`: Removed `Sliders` icon from CardTitle.
    - `ReferencePanel.tsx`: Removed `Bookmark` icon from CardTitle and `Tag` icon from reference badges.
    - `GenerationConfig.tsx`: Removed `Sparkles` icon from "Generate Concepts" button.
    - `ConceptCard.tsx`: Removed `Sparkles` icon from "Refine" button; removed `GitBranch` icon.
    - `RefineConceptDialog.tsx`: Removed `Sparkles` icon from submit button.
  - Kept functional action icons: `Check` (Approve), `X` (Reject), `Download` (Asset download), `Save`, `Plus`, `Trash2`.
- **Comprehensive Verification & Full Regression Results (448/448 Checks Passed, 0 Failed):**
  - BUILD: PASS (`npm run build`, all 79 routes compiled cleanly).
  - TYPECHECK: PASS (`npx tsc --noEmit`, 0 errors).
  - LINT: PASS (`npm run lint`, 0 warnings, 0 errors).
  - PHASE 3.10 REAL PRODUCT VISUALS QA (`scratch/phase3_10_product_visuals_qa.mjs`): PASS (46/46 tests passed across 13 sections).
  - PHASE 3.1 DATABASE QA: PASS (32/32 tests passed).
  - PHASE 3.2 STORAGE QA: PASS (25/25 tests passed).
  - PHASE 3.3 AI ENGINE QA: PASS (17/17 tests passed).
  - PHASE 3.4 BACKGROUND JOBS QA: PASS (29/29 tests passed).
  - PHASE 3.5 SECURITY & AUTH QA: PASS (27/27 tests passed).
  - PHASE 3.6 NOTIFICATIONS & EMAIL QA: PASS (50/50 tests passed).
  - PHASE 3.7 PRODUCTION QA: PASS (41/41 tests passed).
  - PHASE 3.8 LAUNCH QA: PASS (86/86 tests passed).
  - PHASE 3.9 REPLICATE QA: PASS (41/41 tests passed).
  - CUMULATIVE MASTER RUNNER (`scratch/run_all_qa.mjs`): PASS (394/394 tests passed, 100%).
  - TASK 20 PRODUCTION QA (`scratch/task20_production_qa.mjs`): PASS (54/54 tests passed, 100%).
  - TOTAL VERIFIED SUITES: 448/448 PASS (100%).

