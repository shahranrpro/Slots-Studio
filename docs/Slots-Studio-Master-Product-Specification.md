# SLOTS STUDIO --- MASTER PRODUCT SPECIFICATION

**Document:** Product Requirements + Information Architecture + Design
System + Database Schema + Component System + TASK 01--20\
**Product:** Slots Studio\
**Status:** Product foundation / implementation-ready specification\
**Primary stack:** Next.js + TypeScript + React + Tailwind CSS +
Motion + Anime.js\
**Brand colors:** Black `#000000`, White `#FFFFFF`, Electric Lime
`#B7FF00`

------------------------------------------------------------------------

# 0. PRODUCT DECISION SUMMARY

Slots Studio is a futuristic AI-native SaaS workspace for turning a
product idea or product reference into a connected set of creative,
content, campaign, and production outputs.

The product is inspired by the *connected workflow* concept seen in
modern product-creation platforms, but the Slots Studio brand,
interface, copy, information architecture, and implementation must be
original.

## Core product promise

> **Create once. Carry the context everywhere.**

A user should not have to repeatedly explain the same product to
different tools.

``` text
PRODUCT IDEA
    ↓
PRODUCT STUDIO
    ↓
VISUAL STUDIO
    ↓
CONTENT STUDIO
    ↓
CAMPAIGN STUDIO
    ↓
PRODUCTION STUDIO
    ↓
REVIEW
    ↓
EXPORT
```

## Important distinction

Slots Studio is **not** primarily an AI image generator.

It is an **AI-powered creative/product workflow operating system**.

The AI generates drafts and assets; the human reviews, edits, approves,
rejects, regenerates, and exports.

------------------------------------------------------------------------

# 1. THREE-MODE APPEARANCE SYSTEM

The application supports exactly three appearance modes:

1.  **Default**
2.  **Light**
3.  **Dark**

## Default

Default follows the user's operating-system preference.

``` text
Default
  ├─ OS Light → Slots Studio Light
  └─ OS Dark  → Slots Studio Dark
```

Default must not be treated as a fourth visual theme.

## Light

Primary canvas:

`#FFFFFF`

Primary text:

`#000000`

Secondary surfaces use restrained neutral derivatives of black/white.

Electric Lime `#B7FF00` remains the brand accent.

## Dark

Primary canvas:

`#000000`

Primary text:

`#FFFFFF`

Secondary surfaces use very dark neutral derivatives.

Electric Lime `#B7FF00` remains the brand accent.

## Settings UI

``` text
Appearance

○ Default
○ Light
○ Dark
```

Recommended control:

``` text
[ ◐ Default ] [ ☼ Light ] [ ◑ Dark ]
```

Do not use a large colorful theme picker.

## Persistence

Store preference locally first:

``` text
appearance = "system" | "light" | "dark"
```

If authentication is available, persist the preference to the user
profile as well.

## Theme requirements

-   no flash of incorrect theme on first paint
-   CSS variables must drive the theme
-   components must not hard-code dark/light colors
-   images must be tested against both modes
-   focus states must remain visible in both modes
-   reduced-motion preference is independent from appearance preference

------------------------------------------------------------------------

# 2. PRODUCT REQUIREMENTS DOCUMENT

## 2.1 Product vision

Slots Studio should feel like a professional creative operating system
where product teams can move from idea to usable output without
switching between disconnected AI tools.

The product should feel:

-   futuristic
-   premium
-   technical
-   precise
-   creative
-   fast
-   focused
-   confident
-   intelligent
-   original

Avoid making it feel like:

-   a generic admin dashboard
-   a generic AI chatbot
-   a template marketplace
-   a social-media editor clone
-   an image-generation-only tool

------------------------------------------------------------------------

# 2.2 Target users

## Persona A --- Product creator

Needs to turn an idea into product concepts and visual directions.

Primary needs:

-   fast ideation
-   reference upload
-   concept generation
-   iteration
-   organization
-   approval

## Persona B --- Creative designer

Needs to generate and manage product visuals.

Primary needs:

-   references
-   visual direction
-   variations
-   asset management
-   comparison
-   exports

## Persona C --- Ecommerce / marketing operator

Needs to turn approved products into commercial content.

Primary needs:

-   product descriptions
-   SEO copy
-   social content
-   campaign assets
-   multiple aspect ratios

## Persona D --- Production / sourcing user

Needs structured product information for production handoff.

Primary needs:

-   technical data
-   measurements
-   materials
-   artwork
-   tech-pack starting points
-   approvals

## Persona E --- Small team / studio

Needs shared projects and repeatable workflows.

Primary needs:

-   team workspace
-   roles
-   projects
-   review
-   jobs
-   asset library

------------------------------------------------------------------------

# 2.3 Jobs-to-be-done

### Job 1

"When I have a product idea, I want to quickly turn it into several
credible concepts so I can choose a direction."

### Job 2

"When I approve a product direction, I want the same product context
available to every downstream studio."

### Job 3

"When I need marketing material, I want to generate multiple commercial
outputs from the approved product rather than starting over."

### Job 4

"When AI generates something, I want to know what is draft, what is
ready for review, and what has been approved."

### Job 5

"When I return to a project later, I want the entire product history and
assets in one place."

------------------------------------------------------------------------

# 2.4 Core product principles

## Principle 1 --- Context continuity

Product context follows the user through every studio.

## Principle 2 --- Review before release

AI output is never silently treated as production-ready.

## Principle 3 --- Project-centric architecture

The product is organized around projects/products, not isolated
generations.

## Principle 4 --- One source of truth

The approved product record is the source for downstream content and
assets.

## Principle 5 --- Async-first generation

Long AI operations become Jobs.

## Principle 6 --- Human control

Every important AI result can be:

-   reviewed
-   edited
-   approved
-   rejected
-   regenerated
-   archived

## Principle 7 --- Minimal cognitive load

The interface should reveal advanced controls progressively instead of
showing everything at once.

------------------------------------------------------------------------

# 2.5 MVP scope

## MVP must include

-   landing page
-   authentication
-   onboarding
-   workspace
-   dashboard
-   project creation
-   project detail
-   Product Studio
-   reference upload
-   generation job model
-   asset library
-   review states
-   Jobs page
-   appearance settings
-   account settings

## Post-MVP

-   Visual Studio
-   Content Studio
-   Campaign Studio
-   Production Studio
-   team collaboration
-   billing
-   usage credits
-   advanced permissions
-   provider routing
-   analytics

------------------------------------------------------------------------

# 2.6 Non-goals for MVP

Do not attempt all of the following in the first build:

-   full enterprise permissions
-   complex billing rules
-   every AI provider
-   advanced video generation
-   full production ERP
-   complete marketplace integrations
-   real-time multiplayer editing
-   custom model training

Build the workflow foundation first.

------------------------------------------------------------------------

# 2.7 Core workflow

``` text
User
 ↓
Workspace
 ↓
Create Project
 ↓
Project Brief
 ↓
References
 ↓
Product Studio
 ↓
Generate Concepts
 ↓
Review
 ├─ Approve
 ├─ Edit
 ├─ Reject
 └─ Regenerate
 ↓
Approved Product Context
 ↓
Visual / Content / Campaign / Production
```

------------------------------------------------------------------------

# 2.8 Project lifecycle

``` text
DRAFT
  ↓
ACTIVE
  ↓
IN_REVIEW
  ↓
APPROVED
  ↓
IN_PRODUCTION
  ↓
COMPLETED
```

Alternative terminal state:

``` text
ARCHIVED
```

------------------------------------------------------------------------

# 2.9 Generation lifecycle

``` text
QUEUED
  ↓
RUNNING
  ↓
REVIEW
  ↓
APPROVED
```

Failure:

``` text
RUNNING
  ↓
FAILED
  ↓
RETRY
```

Cancellation:

``` text
QUEUED/RUNNING
  ↓
CANCELLED
```

------------------------------------------------------------------------

# 2.10 Review system

Every generated asset should have:

-   status
-   created time
-   creator
-   generation job
-   prompt/reference context
-   project
-   optional notes
-   review history

Actions:

``` text
[ Approve ]
[ Reject ]
[ Regenerate ]
[ Edit ]
[ Download ]
[ Add to Project ]
```

Approved assets should be visually distinguishable without relying only
on color.

------------------------------------------------------------------------

# 3. INFORMATION ARCHITECTURE

## 3.1 Marketing routes

``` text
/
├── /features
├── /studios
├── /workflow
├── /pricing
├── /about
├── /resources
├── /contact
├── /privacy
└── /terms
```

## 3.2 Auth routes

``` text
/auth
├── /login
├── /signup
├── /forgot-password
├── /reset-password
└── /verify
```

## 3.3 Application routes

``` text
/app
├── /dashboard
├── /projects
├── /projects/[projectId]
├── /studio
│   ├── /product
│   ├── /visual
│   ├── /content
│   ├── /campaign
│   └── /production
├── /assets
├── /jobs
├── /settings
│   ├── /profile
│   ├── /appearance
│   ├── /workspace
│   ├── /notifications
│   ├── /security
│   └── /billing
└── /help
```

------------------------------------------------------------------------

# 3.4 Main navigation

Desktop:

``` text
SLOTS STUDIO

OVERVIEW
Dashboard

WORKSPACE
Projects
Assets
Jobs

STUDIOS
Product
Visual
Content
Campaign
Production

SYSTEM
Settings
Help
```

Primary action:

``` text
+ Create
```

## Mobile navigation

``` text
Home
Projects
Create
Jobs
Profile
```

------------------------------------------------------------------------

# 3.5 Project information architecture

``` text
Project
├── Overview
├── Product
├── References
├── Concepts
├── Assets
├── Content
├── Campaigns
├── Production
├── Jobs
├── Activity
└── Settings
```

------------------------------------------------------------------------

# 3.6 Project overview

The overview must answer five questions immediately:

1.  What is this project?
2.  What is its current status?
3.  What has been created?
4.  What is currently running?
5.  What should I do next?

Example:

``` text
TECHNICAL TRAINING JACKET

SLOT SS-02481
ACTIVE

[ Continue Working ]

Product Concept      APPROVED
Visual Assets        18
Content              04
Campaigns            02
Production           01
Active Jobs          02

NEXT ACTION
Review generated lifestyle images
```

------------------------------------------------------------------------

# 4. USER EXPERIENCE

## 4.1 New user onboarding

Step 1:

``` text
Welcome to Slots Studio.
```

Step 2:

``` text
What are you creating?

Product
Collection
Campaign
Brand Asset
Other
```

Step 3:

``` text
Create your first project.
```

Step 4:

``` text
Add a reference or describe your idea.
```

Step 5:

``` text
Generate first concept.
```

Success moment:

``` text
YOUR FIRST SLOT IS READY.
```

------------------------------------------------------------------------

# 4.2 Dashboard

Dashboard sections:

1.  greeting
2.  Create button
3.  active jobs
4.  recent projects
5.  recent assets
6.  review queue
7.  usage
8.  activity

Do not overcrowd the dashboard.

------------------------------------------------------------------------

# 4.3 Create flow

Opening Create should present a focused choice:

``` text
CREATE

What are you making?

[ Product ]
[ Collection ]
[ Campaign ]
[ Visual ]
[ Content ]
```

After selection, preserve the choice as context.

------------------------------------------------------------------------

# 4.4 Product Studio

Primary workflow:

``` text
Brief
 ↓
References
 ↓
Generate
 ↓
Compare
 ↓
Refine
 ↓
Review
 ↓
Approve
```

Inputs:

-   product name
-   category
-   description
-   target user
-   visual direction
-   colors
-   materials
-   reference images
-   logo/brand assets

------------------------------------------------------------------------

# 4.5 Visual Studio

Modes:

-   studio
-   model
-   mannequin
-   lifestyle
-   detail
-   editorial

Output controls:

-   aspect ratio
-   background
-   environment
-   lighting
-   composition
-   model direction

------------------------------------------------------------------------

# 4.6 Content Studio

Content types:

-   product description
-   features
-   specifications
-   SEO title
-   SEO description
-   social caption
-   ad headline
-   ad body
-   marketplace description
-   email copy

------------------------------------------------------------------------

# 4.7 Campaign Studio

Campaign object:

``` text
Campaign
├── Product
├── Goal
├── Audience
├── Channels
├── Visual Direction
├── Copy
└── Assets
```

Supported formats:

``` text
1:1
4:5
9:16
16:9
```

------------------------------------------------------------------------

# 4.8 Production Studio

Production data:

-   material
-   color
-   size range
-   measurements
-   construction
-   trims
-   artwork
-   print
-   embroidery
-   packaging
-   QC notes
-   approvals

Important:

Production output is a starting point and must be reviewable.

------------------------------------------------------------------------

# 5. DESIGN SYSTEM

# 5.1 Brand colors

## Core

``` text
Black
#000000

White
#FFFFFF

Electric Lime
#B7FF00
```

No random brand colors.

Neutral UI colors may be derived from black/white for accessibility and
hierarchy, but the brand palette remains three-color.

------------------------------------------------------------------------

# 5.2 Dark theme tokens

``` text
--background: #000000
--surface-1: #080808
--surface-2: #101010
--surface-3: #171717

--text-primary: #FFFFFF
--text-secondary: rgba(255,255,255,.72)
--text-muted: rgba(255,255,255,.48)

--border: rgba(255,255,255,.12)
--border-strong: rgba(255,255,255,.22)

--accent: #B7FF00
--accent-foreground: #000000
```

# 5.3 Light theme tokens

``` text
--background: #FFFFFF
--surface-1: #FAFAFA
--surface-2: #F3F3F3
--surface-3: #EAEAEA

--text-primary: #000000
--text-secondary: rgba(0,0,0,.70)
--text-muted: rgba(0,0,0,.48)

--border: rgba(0,0,0,.12)
--border-strong: rgba(0,0,0,.22)

--accent: #B7FF00
--accent-foreground: #000000
```

------------------------------------------------------------------------

# 5.4 Lime usage

Electric Lime is an accent, not the dominant background.

Use it for:

-   primary CTA
-   active navigation
-   selection
-   progress
-   AI activity
-   important status
-   focus indicators where contrast allows
-   tiny graphic accents
-   generation state

Avoid lime text on white when contrast is insufficient.

------------------------------------------------------------------------

# 5.5 Typography

Primary:

**Sora**

Use for:

-   display
-   H1
-   H2
-   H3
-   major CTA
-   product names
-   campaign statements

Secondary:

**Inter**

Use for:

-   body
-   navigation
-   controls
-   descriptions
-   technical metadata
-   forms

Optional:

**Barlow Condensed**

Use sparingly for technical/campaign labels only.

No decorative/script fonts.

------------------------------------------------------------------------

# 5.6 Type scale

``` text
Display XL: clamp(3.5rem, 8vw, 8rem)
Display L:  clamp(3rem, 6vw, 6rem)
H1:         clamp(2.5rem, 5vw, 4.5rem)
H2:         clamp(2rem, 4vw, 3.25rem)
H3:         clamp(1.5rem, 3vw, 2.25rem)
H4:         1.5rem
Body Large: 1.125rem
Body:       1rem
Body Small: .875rem
Caption:    .75rem
```

------------------------------------------------------------------------

# 5.7 Spacing

Use a 4px base system.

``` text
4
8
12
16
20
24
32
40
48
64
80
96
128
160
```

Large marketing sections should have generous spacing.

Application UI should be tighter.

------------------------------------------------------------------------

# 5.8 Radius

Avoid excessive rounded SaaS cards.

Recommended:

``` text
radius-sm: 6px
radius-md: 10px
radius-lg: 14px
radius-xl: 20px
```

Use larger radius only where it improves hierarchy.

------------------------------------------------------------------------

# 5.9 Borders

Default borders are thin and restrained.

Dark:

``` text
rgba(255,255,255,.12)
```

Light:

``` text
rgba(0,0,0,.12)
```

Active:

``` text
#B7FF00
```

------------------------------------------------------------------------

# 5.10 Shadows

Avoid large soft shadows.

Prefer subtle elevation:

``` text
0 8px 30px rgba(0,0,0,.08)
```

Dark mode may use borders instead of shadows.

------------------------------------------------------------------------

# 5.11 Buttons

Variants:

``` text
Primary
Secondary
Outline
Ghost
Danger
```

Primary:

``` text
background: #B7FF00
color: #000000
```

Dark-mode primary may also use lime as the main action.

Light mode must preserve strong contrast.

Motion:

``` text
hover → small translate / arrow shift
press → subtle scale
focus → visible focus ring
```

------------------------------------------------------------------------

# 5.12 Cards

Card types:

-   ProjectCard
-   AssetCard
-   StudioCard
-   JobCard
-   MetricCard
-   ReviewCard
-   EmptyStateCard

Cards should not all look identical.

------------------------------------------------------------------------

# 5.13 Icons

Use a single consistent line-icon system.

Lucide is preferred for general interface icons.

Rules:

-   monochrome by default
-   consistent stroke
-   no mixed icon packs
-   decorative icons should not compete with content

------------------------------------------------------------------------

# 6. MOTION SYSTEM

Motion should communicate hierarchy and state.

## Motion.dev

Use Motion for:

-   React component transitions
-   hover states
-   page transitions
-   modal/drawer entry
-   layout changes
-   shared element transitions
-   scroll-based UI
-   reorderable layouts
-   reduced-motion-aware interaction

## Anime.js

Use Anime.js for:

-   hero cinematic sequences
-   logo/S mark sequences
-   complex SVG timelines
-   controlled decorative sequences
-   multi-stage visual reveals

## Rule

``` text
Motion.dev = interface motion
Anime.js  = cinematic / timeline motion
```

Do not use both for the same small interaction.

------------------------------------------------------------------------

# 6.1 Motion durations

``` text
Micro:     100–160ms
UI:        180–280ms
Panel:     280–450ms
Hero:      500–1000ms
Cinematic: 800–1800ms
```

Avoid blocking the user.

------------------------------------------------------------------------

# 6.2 Reduced motion

When `prefers-reduced-motion` is active:

-   remove decorative motion
-   disable autoplay visual sequences
-   keep content visible
-   preserve essential state changes
-   use instant or very short transitions

------------------------------------------------------------------------

# 7. DATABASE SCHEMA

Recommended database:

**PostgreSQL**

The schema should be designed for SaaS multi-tenancy from the beginning.

## Core relationships

``` text
User
 ↓
Membership
 ↓
Workspace
 ↓
Project
 ├── Product
 ├── References
 ├── Assets
 ├── Jobs
 ├── Content
 ├── Campaigns
 └── Production
```

------------------------------------------------------------------------

# 7.1 users

``` text
users
- id UUID PK
- email
- name
- avatar_url
- created_at
- updated_at
```

------------------------------------------------------------------------

# 7.2 workspaces

``` text
workspaces
- id UUID PK
- name
- slug
- owner_id FK users.id
- created_at
- updated_at
```

------------------------------------------------------------------------

# 7.3 workspace_members

``` text
workspace_members
- id UUID PK
- workspace_id FK
- user_id FK
- role
- created_at
```

Roles:

``` text
OWNER
ADMIN
EDITOR
REVIEWER
VIEWER
```

------------------------------------------------------------------------

# 7.4 user_preferences

``` text
user_preferences
- id UUID PK
- user_id FK UNIQUE
- appearance ENUM(system, light, dark)
- reduced_motion BOOLEAN
- created_at
- updated_at
```

------------------------------------------------------------------------

# 7.5 projects

``` text
projects
- id UUID PK
- workspace_id FK
- slot_code UNIQUE
- name
- description
- status
- category
- created_by FK
- created_at
- updated_at
- archived_at
```

Example:

``` text
SS-02481
```

------------------------------------------------------------------------

# 7.6 products

``` text
products
- id UUID PK
- project_id FK UNIQUE
- name
- category
- description
- target_user
- visual_direction
- materials_json
- colors_json
- measurements_json
- status
- approved_asset_id FK nullable
- created_at
- updated_at
```

------------------------------------------------------------------------

# 7.7 references

``` text
references
- id UUID PK
- project_id FK
- asset_id FK
- reference_type
- note
- created_at
```

Types:

``` text
PRODUCT
LOGO
MATERIAL
STYLE
COLOR
CAMPAIGN
OTHER
```

------------------------------------------------------------------------

# 7.8 assets

``` text
assets
- id UUID PK
- workspace_id FK
- project_id FK nullable
- uploaded_by FK nullable
- name
- asset_type
- mime_type
- storage_key
- thumbnail_key
- width
- height
- size_bytes
- source
- status
- metadata_json
- created_at
- updated_at
```

Asset sources:

``` text
UPLOAD
AI_GENERATED
IMPORTED
SYSTEM
```

Asset statuses:

``` text
DRAFT
GENERATING
REVIEW
APPROVED
REJECTED
ARCHIVED
```

------------------------------------------------------------------------

# 7.9 generation_jobs

``` text
generation_jobs
- id UUID PK
- workspace_id FK
- project_id FK
- created_by FK
- job_type
- provider
- status
- progress
- input_json
- output_json
- error_code
- error_message_safe
- started_at
- completed_at
- created_at
```

Statuses:

``` text
QUEUED
RUNNING
REVIEW
COMPLETED
FAILED
CANCELLED
```

------------------------------------------------------------------------

# 7.10 generation_outputs

``` text
generation_outputs
- id UUID PK
- generation_job_id FK
- asset_id FK
- rank
- metadata_json
- created_at
```

------------------------------------------------------------------------

# 7.11 reviews

``` text
reviews
- id UUID PK
- asset_id FK
- reviewer_id FK
- decision
- note
- created_at
```

Decisions:

``` text
APPROVED
REJECTED
CHANGES_REQUESTED
```

------------------------------------------------------------------------

# 7.12 content_items

``` text
content_items
- id UUID PK
- project_id FK
- type
- title
- body
- status
- created_by FK
- approved_by FK nullable
- created_at
- updated_at
```

Types:

``` text
DESCRIPTION
FEATURES
SPECIFICATIONS
SEO_TITLE
SEO_DESCRIPTION
SOCIAL_CAPTION
AD_COPY
MARKETPLACE
EMAIL
OTHER
```

------------------------------------------------------------------------

# 7.13 campaigns

``` text
campaigns
- id UUID PK
- workspace_id FK
- project_id FK
- name
- objective
- audience
- status
- created_by FK
- created_at
- updated_at
```

------------------------------------------------------------------------

# 7.14 campaign_assets

``` text
campaign_assets
- id UUID PK
- campaign_id FK
- asset_id FK
- channel
- aspect_ratio
- status
- created_at
```

Channels:

``` text
INSTAGRAM
FACEBOOK
TIKTOK
GOOGLE
WEBSITE
EMAIL
BANNER
OTHER
```

------------------------------------------------------------------------

# 7.15 production_specs

``` text
production_specs
- id UUID PK
- project_id FK UNIQUE
- materials_json
- construction_json
- measurements_json
- trims_json
- decoration_json
- packaging_json
- qc_json
- status
- created_at
- updated_at
```

------------------------------------------------------------------------

# 7.16 activity_logs

``` text
activity_logs
- id UUID PK
- workspace_id FK
- project_id FK nullable
- user_id FK nullable
- action
- entity_type
- entity_id
- metadata_json
- created_at
```

Never store secrets or private file contents in activity logs.

------------------------------------------------------------------------

# 7.17 subscriptions

``` text
subscriptions
- id UUID PK
- workspace_id FK
- provider
- provider_customer_id
- provider_subscription_id
- plan
- status
- current_period_start
- current_period_end
- created_at
- updated_at
```

------------------------------------------------------------------------

# 7.18 usage_ledger

``` text
usage_ledger
- id UUID PK
- workspace_id FK
- user_id FK nullable
- job_id FK nullable
- event_type
- units
- metadata_json
- created_at
```

This provides an auditable usage history.

------------------------------------------------------------------------

# 7.19 notifications

``` text
notifications
- id UUID PK
- user_id FK
- type
- title
- body
- read_at
- created_at
```

------------------------------------------------------------------------

# 8. FILE STORAGE ARCHITECTURE

Never store large binaries directly in PostgreSQL.

Use:

``` text
Next.js
 ↓
Storage service
 ↓
Object storage
```

Database stores references only.

Recommended storage key:

``` text
/workspaces/{workspaceId}/projects/{projectId}/assets/{assetId}/original
```

Private assets must not be exposed through permanent public URLs.

------------------------------------------------------------------------

# 9. NEXT.JS APPLICATION ARCHITECTURE

Use App Router.

Recommended structure:

``` text
src/
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── studio/
│   │   ├── assets/
│   │   ├── jobs/
│   │   └── settings/
│   ├── api/
│   ├── layout.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   └── not-found.tsx
│
├── components/
├── features/
├── lib/
├── data/
├── animations/
├── hooks/
├── types/
└── styles/
```

Use Server Components by default.

Use Client Components only for:

-   interactive controls
-   drag/drop
-   animation requiring client state
-   file upload
-   live generation state
-   dialogs
-   theme controls

------------------------------------------------------------------------

# 10. COMPONENT SYSTEM

## 10.1 Foundation components

``` text
Button
IconButton
Text
Heading
Label
Badge
Divider
Container
Stack
Grid
Tooltip
Spinner
Skeleton
```

## 10.2 Form components

``` text
Input
Textarea
Select
Combobox
Checkbox
RadioGroup
Switch
Slider
FileDropzone
FormField
FormError
FormSuccess
```

## 10.3 Navigation

``` text
AppSidebar
MobileNav
Topbar
Breadcrumbs
CommandMenu
UserMenu
WorkspaceSwitcher
StudioNav
```

## 10.4 Project components

``` text
ProjectCard
ProjectHeader
ProjectStatus
ProjectProgress
ProjectTabs
ProjectOverview
ProjectActivity
ProjectEmptyState
```

## 10.5 Asset components

``` text
AssetCard
AssetGrid
AssetPreview
AssetViewer
AssetToolbar
AssetFilters
AssetStatusBadge
AssetMetadata
```

## 10.6 Job components

``` text
JobCard
JobList
JobProgress
JobStatus
JobTimeline
JobRetry
JobDetails
```

## 10.7 Studio components

``` text
StudioShell
StudioHeader
PromptPanel
ReferencePanel
GenerationPanel
GenerationGrid
GenerationResult
ReviewBar
ApprovalPanel
OutputToolbar
```

## 10.8 Marketing components

``` text
Hero
LogoMark
FeatureGrid
WorkflowSection
StudioShowcase
Testimonial
PricingCards
FAQ
CTASection
Footer
```

------------------------------------------------------------------------

# 11. REUSABLE UI STATES

Every important interactive component should support:

``` text
DEFAULT
HOVER
FOCUS
ACTIVE
DISABLED
LOADING
SUCCESS
ERROR
EMPTY
```

Every data-driven screen should support:

``` text
LOADING
EMPTY
ERROR
READY
```

------------------------------------------------------------------------

# 12. AI SERVICE ARCHITECTURE

Do not couple UI directly to a single AI provider.

Use:

``` text
UI
 ↓
Application Service
 ↓
AI Adapter
 ↓
Provider
```

Example:

``` text
generateProductConcept()
      ↓
GenerationService
      ↓
ProductConceptProvider
      ↓
Provider A / Provider B
```

This allows provider changes without rewriting the UI.

------------------------------------------------------------------------

# 13. JOB SYSTEM

AI operations should be asynchronous.

Example:

``` text
User clicks Generate
 ↓
Create generation_job
 ↓
Return job ID
 ↓
Worker/provider processes job
 ↓
Update progress
 ↓
Create assets
 ↓
Set status REVIEW
 ↓
Notify user
```

UI can poll or subscribe to job state depending on the eventual
infrastructure.

------------------------------------------------------------------------

# 14. SECURITY REQUIREMENTS

## Authentication

-   secure session handling
-   protected app routes
-   server-side authorization

## Authorization

Every workspace resource must be checked against workspace membership.

Never trust:

``` text
projectId
assetId
workspaceId
```

from the browser without server authorization.

## Upload security

-   allowlist file types
-   enforce size limits server-side
-   sanitize filenames
-   generate storage keys
-   never execute uploads
-   store private assets outside public static folders
-   scan/validate where appropriate
-   log upload results

## Error security

Never expose stack traces to users.

------------------------------------------------------------------------

# 15. ACCESSIBILITY

Required:

-   semantic HTML
-   keyboard navigation
-   visible focus
-   accessible labels
-   adequate contrast
-   reduced motion
-   alt text
-   correct button/link semantics
-   dialog focus management
-   form errors associated with fields

------------------------------------------------------------------------

# 16. RESPONSIVE SYSTEM

Breakpoints should be treated as layout behavior, not device labels.

Minimum validation:

``` text
Small mobile
Large mobile
Tablet
Laptop
Desktop
Wide desktop
```

The desktop application can use a persistent sidebar.

Mobile should use bottom navigation and sheets/drawers where
appropriate.

------------------------------------------------------------------------

# 17. LANDING PAGE INFORMATION ARCHITECTURE

``` text
NAV
 ↓
HERO
 ↓
WHAT IS SLOTS STUDIO
 ↓
CONNECTED WORKFLOW
 ↓
STUDIOS
 ↓
PRODUCT EXAMPLE
 ↓
AI + HUMAN REVIEW
 ↓
ASSET / OUTPUT SYSTEM
 ↓
PRICING
 ↓
FAQ
 ↓
CTA
 ↓
FOOTER
```

Hero message direction:

> **ONE PRODUCT.\
> EVERY OUTPUT.**

Supporting message:

> Create, refine, and move product ideas from concept to commercial
> output inside one AI-powered studio.

Primary CTA:

``` text
Start Creating
```

Secondary:

``` text
Explore the Studio
```

------------------------------------------------------------------------

# 18. APPLICATION VISUAL LANGUAGE

Dark mode should feel like a black creative workstation.

Light mode should feel like a clean technical editorial workspace.

Both must be the same product, not two unrelated designs.

## Dark

``` text
BLACK CANVAS
WHITE TYPE
LIME SIGNALS
THIN DIVIDERS
```

## Light

``` text
WHITE CANVAS
BLACK TYPE
LIME SIGNALS
SOFT NEUTRAL SURFACES
```

The S logo remains the brand anchor.

------------------------------------------------------------------------

# 19. COMMAND MENU

Provide a keyboard-friendly command menu later in MVP/post-MVP.

Example:

``` text
⌘ K

Search projects...
────────────────

Create project
Open Product Studio
Open Assets
View Jobs
Appearance
Settings
```

Shortcuts:

``` text
⌘/Ctrl + K
Create
Search
Escape
```

------------------------------------------------------------------------

# 20. PHASED DEVELOPMENT --- TASK 01 → TASK 20

Each task must be completed and verified before the next task.

------------------------------------------------------------------------

## TASK 01 --- Project Bootstrap

### Goal

Create the clean Next.js foundation.

### Build

-   Next.js App Router
-   TypeScript
-   Tailwind
-   linting
-   formatting
-   environment structure
-   basic aliases
-   public asset structure
-   base layout

### Exit criteria

-   app runs
-   production build passes
-   TypeScript passes
-   lint passes
-   no unnecessary dependencies

------------------------------------------------------------------------

## TASK 02 --- Brand + Theme Engine

### Goal

Implement Slots Studio visual foundation.

### Build

-   S logo asset
-   Sora
-   Inter
-   theme tokens
-   dark theme
-   light theme
-   system/default theme
-   appearance selector

### Theme modes

``` text
Default
Light
Dark
```

### Exit criteria

-   all three modes work
-   no theme flash
-   settings persist
-   components use tokens rather than hard-coded theme colors

------------------------------------------------------------------------

## TASK 03 --- Design System Primitives

### Build

-   Button
-   IconButton
-   Input
-   Textarea
-   Select
-   Badge
-   Card
-   Dialog
-   Sheet
-   Tabs
-   Tooltip
-   Skeleton
-   EmptyState
-   Toast
-   Dropdown

### Exit criteria

Every primitive works in all three appearance modes.

------------------------------------------------------------------------

## TASK 04 --- Marketing Shell

### Build

-   landing layout
-   header
-   footer
-   mobile navigation
-   responsive container
-   typography hierarchy
-   CTA system

### Exit criteria

Marketing shell is responsive and accessible.

------------------------------------------------------------------------

## TASK 05 --- Landing Page Hero

### Build

-   futuristic hero
-   S logo animation
-   headline
-   CTA
-   application preview
-   subtle Anime.js cinematic sequence

### Exit criteria

-   fast first paint
-   reduced-motion version
-   mobile layout
-   light/dark/default appearance support

------------------------------------------------------------------------

## TASK 06 --- Workflow + Studios Marketing Sections

### Build

-   connected workflow section
-   studio cards
-   product-to-output diagram
-   review system section
-   responsive motion

### Animation

Motion.dev for UI/scroll behavior.

Anime.js only for larger timeline sequences.

### Exit criteria

The landing page clearly explains what Slots Studio does without
requiring a product demo.

------------------------------------------------------------------------

## TASK 07 --- Authentication

### Build

-   signup
-   login
-   logout
-   password recovery
-   session protection
-   protected `/app`

### Exit criteria

Unauthenticated users cannot access protected workspace pages.

------------------------------------------------------------------------

## TASK 08 --- Workspace + Onboarding

### Build

-   workspace creation
-   onboarding
-   user profile
-   workspace membership foundation
-   first-project CTA

### Exit criteria

A new user can sign up and reach a usable workspace.

------------------------------------------------------------------------

## TASK 09 --- Application Shell

### Build

-   desktop sidebar
-   mobile navigation
-   topbar
-   workspace switcher
-   user menu
-   command menu foundation
-   breadcrumbs

### Exit criteria

Navigation works across all application routes.

------------------------------------------------------------------------

## TASK 10 --- Dashboard

### Build

-   greeting
-   recent projects
-   active jobs
-   review queue
-   recent assets
-   usage summary
-   create button

### Exit criteria

Dashboard is useful with both real and empty states.

------------------------------------------------------------------------

## TASK 11 --- Projects

### Build

-   project list
-   search
-   filters
-   create project
-   project detail
-   SLOT ID
-   project status
-   project tabs

### Exit criteria

User can create, open, edit, archive and revisit projects.

------------------------------------------------------------------------

## TASK 12 --- Product Studio

### Build

-   product brief
-   reference upload
-   product context
-   concept generation UI
-   generation results
-   compare
-   refine
-   review
-   approve

### Exit criteria

A product can move from brief → concept → review → approval.

------------------------------------------------------------------------

## TASK 13 --- Assets Library

### Build

-   asset grid
-   asset viewer
-   filters
-   search
-   project filtering
-   metadata
-   statuses
-   download
-   archive

### Exit criteria

Every generated/uploaded asset can be found and managed.

------------------------------------------------------------------------

## TASK 14 --- Jobs System

### Build

-   job model
-   job list
-   job detail
-   progress
-   statuses
-   retry
-   cancellation
-   error states

### Exit criteria

Long-running work never blocks the main UI.

------------------------------------------------------------------------

## TASK 15 --- Visual Studio

### Build

-   generation workspace
-   reference panel
-   visual settings
-   output grid
-   review
-   save to project

### Modes

``` text
Studio
Model
Mannequin
Lifestyle
Detail
Editorial
```

### Exit criteria

Visual outputs are connected to the project's product context.

------------------------------------------------------------------------

## TASK 16 --- Content Studio

### Build

-   content generation
-   templates
-   editor
-   regenerate
-   approve
-   copy/export

### Exit criteria

Approved product context can generate multiple content types without
re-entering the product.

------------------------------------------------------------------------

## TASK 17 --- Campaign Studio

### Build

-   campaign creation
-   channels
-   aspect ratios
-   creative outputs
-   campaign asset management
-   review

### Exit criteria

A campaign can be created from an existing product.

------------------------------------------------------------------------

## TASK 18 --- Production Studio

### Build

-   production specification
-   measurements
-   materials
-   construction
-   decoration
-   artwork
-   packaging
-   QC
-   tech-pack export foundation

### Exit criteria

A product can produce a structured production handoff draft.

------------------------------------------------------------------------

## TASK 19 --- Billing + Usage + Teams

### Build

-   subscription model
-   plans
-   usage ledger
-   credit/usage display
-   workspace members
-   roles
-   invitations
-   billing settings

### Exit criteria

Usage is auditable and workspace access is role-aware.

------------------------------------------------------------------------

## TASK 20 --- Production QA + Launch

### QA

Test:

-   Chrome
-   Edge
-   Safari where available
-   mobile
-   tablet
-   desktop
-   keyboard
-   reduced motion
-   dark
-   light
-   default/system
-   slow network
-   upload failures
-   generation failures
-   empty states
-   loading states
-   error states
-   auth boundaries
-   authorization
-   SEO
-   metadata
-   accessibility

### Performance

Check:

-   initial load
-   image optimization
-   client bundle
-   animation performance
-   lazy loading
-   unnecessary re-renders

### Security

Check:

-   authorization
-   uploads
-   storage access
-   secrets
-   server validation
-   error exposure

### Exit criteria

No task is marked complete merely because the UI exists.

A task is complete only after:

``` text
BUILD ✓
TYPECHECK ✓
LINT ✓
DESKTOP ✓
MOBILE ✓
LIGHT ✓
DARK ✓
DEFAULT ✓
LOADING ✓
EMPTY ✓
ERROR ✓
SUCCESS ✓
ACCESSIBILITY ✓
PERFORMANCE ✓
SECURITY ✓
```

------------------------------------------------------------------------

# 21. AI CODING RULES FOR ANTIGRAVITY

Before changing anything:

1.  Inspect current file structure.
2.  Inspect the relevant component.
3.  Inspect existing design tokens.
4.  Preserve working behavior.
5.  Make the smallest safe change.
6.  Run the relevant checks.
7.  Verify visually.
8.  Update project memory/changelog.

Never claim completion without verification.

Do not create giant single-file pages.

Do not duplicate UI.

Do not place all application logic inside page components.

Do not create fake functionality that looks operational but is not
connected.

When backend functionality is not implemented, clearly separate UI
scaffolding from production behavior.

------------------------------------------------------------------------

# 22. DATA / UI SEPARATION

Keep structured data outside page JSX where possible.

Examples:

``` text
src/data/navigation.ts
src/data/studios.ts
src/data/pricing.ts
src/data/marketing.ts
```

Feature-specific business logic:

``` text
src/features/projects/
src/features/generation/
src/features/assets/
src/features/campaigns/
src/features/production/
```

------------------------------------------------------------------------

# 23. RECOMMENDED DIRECTORY STRUCTURE

``` text
src/
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   ├── app/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── marketing/
│   ├── navigation/
│   ├── projects/
│   ├── assets/
│   ├── jobs/
│   └── studios/
│
├── features/
│   ├── auth/
│   ├── workspace/
│   ├── projects/
│   ├── generation/
│   ├── assets/
│   ├── content/
│   ├── campaigns/
│   ├── production/
│   ├── billing/
│   └── teams/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── storage/
│   ├── ai/
│   ├── billing/
│   ├── analytics/
│   ├── validations/
│   └── utils/
│
├── animations/
│   ├── motion/
│   └── anime/
│
├── hooks/
├── data/
├── types/
└── styles/
```

------------------------------------------------------------------------

# 24. ANALYTICS PLAN

Track product behavior without collecting unnecessary private content.

Important events:

``` text
signup
onboarding_complete
project_create
project_open
generation_start
generation_complete
generation_failed
asset_approve
asset_reject
asset_download
studio_open
campaign_create
production_export
appearance_change
```

Do not send prompts, private files, passwords, or unnecessary personal
data into analytics.

------------------------------------------------------------------------

# 25. ERROR UX

Customer-facing errors must be human-readable.

Example:

> Something went wrong. Please try again.

For generation:

> We couldn't complete this generation. Your project is safe. Try again.

Actions:

``` text
[ Retry ]
[ View Jobs ]
```

Developer logs can contain technical diagnostics, but never secrets or
private file contents.

------------------------------------------------------------------------

# 26. EMPTY STATES

Projects:

> No projects yet.\
> Start with an idea and build your first Slot.

Assets:

> Your asset library is empty.

Jobs:

> All systems clear.\
> No active jobs right now.

Studio:

> Start with a product idea, reference, or brief.

------------------------------------------------------------------------

# 27. NOTIFICATION SYSTEM

Types:

``` text
Generation completed
Generation failed
Review required
Project approved
Export ready
Team invitation
Billing event
```

Notifications should be useful, not noisy.

------------------------------------------------------------------------

# 28. SEARCH

Global search should eventually cover:

-   projects
-   assets
-   jobs
-   campaigns
-   content
-   production records

Search result should show entity type and project context.

------------------------------------------------------------------------

# 29. PRODUCT METRICS

Initial product analytics:

### Activation

Percentage of users who:

``` text
Signup
→ Create project
→ Generate first output
```

### Engagement

-   projects/user
-   generations/project
-   assets/project
-   weekly active users

### Workflow completion

-   concept approval
-   visual creation
-   content creation
-   campaign creation
-   production export

### Reliability

-   generation failure rate
-   upload failure rate
-   average generation duration

------------------------------------------------------------------------

# 30. FUTURE EXTENSIONS

After the foundation is stable:

-   team comments
-   approvals
-   version history
-   side-by-side comparison
-   bulk generation
-   batch exports
-   AI provider routing
-   reusable brand kits
-   saved prompts
-   project templates
-   collections
-   marketplace integrations
-   ecommerce integrations
-   API
-   public share links
-   client review portals

------------------------------------------------------------------------

# 31. DEFINITION OF DONE --- PRODUCT LEVEL

Slots Studio is considered production-ready only when:

-   authentication works
-   protected routes work
-   workspace authorization works
-   project lifecycle works
-   generation jobs are tracked
-   assets are securely stored
-   review workflow works
-   appearance modes work
-   mobile works
-   desktop works
-   keyboard navigation works
-   reduced motion works
-   error/loading/empty/success states exist
-   AI provider layer is abstracted
-   analytics are intentional
-   secrets are protected
-   uploads are validated
-   database migrations are reproducible
-   backups/recovery are considered
-   production build passes

------------------------------------------------------------------------

# 32. FINAL PRODUCT NORTH STAR

The interface should make the user feel:

> "I don't need five different AI tools for this project."

The product should communicate:

``` text
IDEA
 ↓
CONTEXT
 ↓
CREATION
 ↓
REVIEW
 ↓
APPROVAL
 ↓
OUTPUT
```

The brand expression should remain:

``` text
SLOTS STUDIO

BLACK
WHITE
ELECTRIC LIME

FUTURISTIC
PRECISE
CREATIVE
TECHNICAL
PREMIUM
```

And the central product idea remains:

> **Create once. Carry the context everywhere.**
