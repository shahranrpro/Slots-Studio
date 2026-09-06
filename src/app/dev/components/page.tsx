"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BrandLogo,
  AppearanceSelector,
  useAppearance,
  Button,
  IconButton,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Divider,
  Spinner,
  Skeleton,
  EmptyState,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  FormField,
  FormError,
  FormSuccess,
  Dialog,
  DialogFooter,
  Sheet,
  Tooltip,
  DropdownMenu,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";
import { APP_CONFIG } from "@/lib/constants";
import {
  Plus,
  Trash2,
  Settings,
  Sparkles,
  Layers,
  HelpCircle,
  FolderPlus,
  MoreVertical,
  Edit2,
  Share2,
  ArrowLeft,
} from "lucide-react";

export default function DevComponentsShowcasePage() {
  const { appearance, resolvedTheme, isMounted } = useAppearance();

  // Interactive component demo state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectValue, setSelectValue] = useState("product");
  const [radioValue, setRadioValue] = useState("standard");
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      {/* Dev Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface-1)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Back to Home"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)]">
              <BrandLogo size={22} priority alt="Slots Studio" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-tight text-[var(--text-primary)]">
                {APP_CONFIG.name}
              </span>
              <span className="text-[10px] font-mono tracking-wide uppercase text-[var(--accent)]">
                Internal Component Showcase
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AppearanceSelector size="sm" />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-5 py-10 sm:px-8">
        {/* Status Header */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-1)] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                <span>DEV ROUTE</span>
                <span>•</span>
                <span>noindex, nofollow</span>
                <span>•</span>
                <span>All 22 Primitives</span>
              </div>
              <h1 className="font-display type-h2 font-bold tracking-tight text-[var(--text-primary)]">
                Design System Primitives Catalog
              </h1>
              <p className="type-body-lg text-[var(--text-secondary)]">
                Interactive test harness for all Slots Studio UI primitives. Test component
                states, keyboard accessibility, and contrast across Default, Light, and Dark modes.
              </p>
            </div>

            {/* Diagnostics */}
            <div className="flex flex-col gap-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-4 font-mono text-xs">
              <div className="flex items-center justify-between gap-6">
                <span className="text-[var(--text-muted)]">Preference:</span>
                <span className="font-bold text-[var(--accent)] uppercase">
                  {isMounted ? appearance : "loading..."}
                </span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-[var(--text-muted)]">Resolved Theme:</span>
                <span className="font-bold text-[var(--text-primary)] uppercase">
                  {isMounted ? resolvedTheme : "loading..."}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Tabbed Primitive Showcase */}
        <Tabs defaultValue="foundation">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="foundation">Foundation Primitives</TabsTrigger>
            <TabsTrigger value="forms">Form Controls</TabsTrigger>
            <TabsTrigger value="overlays">Overlays &amp; Dialogs</TabsTrigger>
            <TabsTrigger value="cards">Cards &amp; Empty States</TabsTrigger>
          </TabsList>

          {/* Foundation Tab */}
          <TabsContent value="foundation" className="space-y-8 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Button &amp; IconButton System</CardTitle>
                <CardDescription>
                  Supports primary, secondary, outline, ghost, and danger variants with loading,
                  icon attachments, and focus rings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                    Primary Action
                  </Button>
                  <Button variant="secondary" leftIcon={<Sparkles className="h-4 w-4" />}>
                    Secondary
                  </Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger" leftIcon={<Trash2 className="h-4 w-4" />}>
                    Danger
                  </Button>
                  <Button variant="primary" isLoading>
                    Loading
                  </Button>
                  <Button variant="secondary" disabled>
                    Disabled
                  </Button>
                </div>

                <Divider label="Icon Buttons" />

                <div className="flex flex-wrap items-center gap-3">
                  <IconButton variant="primary" aria-label="Add project">
                    <Plus className="h-4 w-4" />
                  </IconButton>
                  <IconButton variant="secondary" aria-label="Studio settings">
                    <Settings className="h-4 w-4" />
                  </IconButton>
                  <IconButton variant="outline" aria-label="Layers">
                    <Layers className="h-4 w-4" />
                  </IconButton>
                  <IconButton variant="ghost" aria-label="Help & Docs">
                    <HelpCircle className="h-4 w-4" />
                  </IconButton>
                  <IconButton variant="danger" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                  <IconButton variant="secondary" isLoading aria-label="Loading..." />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges, Spinners &amp; Skeletons</CardTitle>
                <CardDescription>
                  Compact semantic status badges and accessible loading indicators.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="accent" dot>
                    Active Accent
                  </Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="success" dot>
                    Approved
                  </Badge>
                  <Badge variant="warning" dot>
                    In Review
                  </Badge>
                  <Badge variant="danger" dot>
                    Rejected
                  </Badge>
                </div>

                <Divider label="Loaders & Skeletons" />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex items-center gap-4">
                    <Spinner size="sm" />
                    <Spinner size="md" />
                    <Spinner size="lg" className="text-[var(--accent)]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms" className="space-y-8 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Form Controls &amp; Validation</CardTitle>
                <CardDescription>
                  Input fields, Textareas, Selects, Checkboxes, RadioGroups, and Switches.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    label="Project Title"
                    required
                    description="Enter a unique name for this project."
                    htmlFor="dev-title"
                  >
                    <Input
                      id="dev-title"
                      placeholder="e.g. Combat Training Shorts SS-24"
                      leftIcon={<Sparkles className="h-4 w-4" />}
                    />
                  </FormField>

                  <FormField
                    label="Studio Target"
                    description="Select the initial creation workspace."
                  >
                    <Select
                      options={[
                        { value: "product", label: "Product Studio (Concepts)" },
                        { value: "visual", label: "Visual Studio (Photography)" },
                        { value: "content", label: "Content Studio (Copywriting)" },
                        { value: "campaign", label: "Campaign Studio (Multi-Channel)" },
                      ]}
                      value={selectValue}
                      onChange={setSelectValue}
                    />
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField
                      label="Product Brief / Prompt"
                      description="Describe the core design parameters."
                      htmlFor="dev-brief"
                    >
                      <Textarea
                        id="dev-brief"
                        rows={3}
                        placeholder="Black athletic shorts with reinforced waistband..."
                      />
                    </FormField>
                  </div>
                </div>

                <Divider label="Toggles & Options" />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      Checkbox Options
                    </span>
                    <Checkbox
                      id="dev-chk-1"
                      label="Auto-generate lifestyle imagery"
                      description="Create model variations automatically"
                      checked={checkboxChecked}
                      onChange={(e) => setCheckboxChecked(e.target.checked)}
                    />
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      Radio Group
                    </span>
                    <RadioGroup value={radioValue} onChange={setRadioValue}>
                      <RadioGroupItem
                        id="dev-rg-1"
                        value="standard"
                        label="Standard Generation"
                        description="4 visual concepts"
                      />
                      <RadioGroupItem
                        id="dev-rg-2"
                        value="hd"
                        label="High Resolution"
                        description="8 4K renders"
                      />
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      Switch Toggle
                    </span>
                    <Switch
                      id="dev-sw-1"
                      label="Async Queue Mode"
                      description="Offload work to background jobs"
                      checked={switchChecked}
                      onCheckedChange={setSwitchChecked}
                    />
                  </div>
                </div>

                <Divider label="Feedback Messages" />

                <div className="space-y-2">
                  <FormError message="A generation job failed due to invalid prompt parameters." />
                  <FormSuccess message="Project SS-02481 approved and moved to Production Studio." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overlays Tab */}
          <TabsContent value="overlays" className="space-y-8 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Dialogs, Drawers, Menus &amp; Tooltips</CardTitle>
                <CardDescription>
                  Accessible overlays with focus traps, escape key support, and clean backdrop blur.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
                    Open Modal Dialog
                  </Button>

                  <Button variant="secondary" onClick={() => setIsSheetOpen(true)}>
                    Open Side Drawer (Sheet)
                  </Button>

                  <DropdownMenu
                    trigger={
                      <Button variant="outline" rightIcon={<MoreVertical className="h-4 w-4" />}>
                        Project Actions
                      </Button>
                    }
                    items={[
                      { id: "edit", label: "Edit Brief", icon: <Edit2 className="h-4 w-4" /> },
                      { id: "share", label: "Share Slot", icon: <Share2 className="h-4 w-4" /> },
                      "separator",
                      {
                        id: "delete",
                        label: "Archive Project",
                        icon: <Trash2 className="h-4 w-4" />,
                        danger: true,
                      },
                    ]}
                  />

                  <Tooltip content="Electric Lime is our strict brand accent.">
                    <Button variant="ghost">Hover for Tooltip</Button>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>

            {/* Modal Dialog Instance */}
            <Dialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              title="Confirm Project Slot Generation"
              description="This will initialize Product Studio and queue your generation job."
            >
              <div className="space-y-3 py-2 text-xs text-[var(--text-secondary)]">
                <p>
                  You are about to start a technical brief iteration for{" "}
                  <strong className="text-[var(--text-primary)]">Combat Training Shorts SS-24</strong>.
                </p>
                <p>
                  All generated visuals and specifications will be automatically linked to this
                  Slot ID.
                </p>
              </div>
              <DialogFooter>
                <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setIsDialogOpen(false)}>
                  Confirm &amp; Queue
                </Button>
              </DialogFooter>
            </Dialog>

            {/* Sheet Drawer Instance */}
            <Sheet
              isOpen={isSheetOpen}
              onClose={() => setIsSheetOpen(false)}
              title="Studio Reference Panel"
              description="Manage visual references and product specifications."
            >
              <div className="space-y-4 py-4 text-xs text-[var(--text-secondary)]">
                <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-4">
                  <span className="font-semibold text-[var(--text-primary)]">Reference Assets</span>
                  <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                    3 material samples and 1 tech-pack draft attached.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Upload New Reference
                </Button>
              </div>
            </Sheet>
          </TabsContent>

          {/* Cards & Empty State Tab */}
          <TabsContent value="cards" className="space-y-8 pt-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card variant="interactive">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="accent" dot>
                      Active Project
                    </Badge>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">SS-02481</span>
                  </div>
                  <CardTitle className="mt-2">Technical Training Jacket</CardTitle>
                  <CardDescription>
                    All-weather synthetic shell with tactical storage pockets.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <span>18 Visual Assets</span>
                    <span>•</span>
                    <span>4 Copy Drafts</span>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <span className="text-[11px] text-[var(--text-muted)]">Updated 4m ago</span>
                  <Button size="sm" variant="outline">
                    Open Studio
                  </Button>
                </CardFooter>
              </Card>

              <EmptyState
                icon={<FolderPlus className="h-6 w-6" />}
                title="No Campaign Outputs Yet"
                description="Connect your approved product context to Campaign Studio to generate marketing assets."
                action={
                  <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                    Create Campaign
                  </Button>
                }
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface-1)] py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 text-xs text-[var(--text-muted)] sm:px-8">
          <div className="flex items-center gap-2">
            <BrandLogo size={16} alt="" />
            <span>{APP_CONFIG.name} © 2026</span>
          </div>
          <span className="font-mono text-[10px]">Internal Design System Dev Route</span>
        </div>
      </footer>
    </div>
  );
}
