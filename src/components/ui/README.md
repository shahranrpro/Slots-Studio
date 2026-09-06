# Slots Studio — UI Design System Primitives

A complete, accessible, theme-aware foundational UI component library engineered for **Slots Studio**. Built strictly with React 19, TypeScript, Tailwind CSS v4, and native CSS custom properties.

---

## Design Principles

1. **Build Once, Reuse Everywhere**: Generic UI primitives must be reused across all features and studios rather than duplicated.
2. **Single Source of Truth**: All colors and surfaces consume CSS custom properties (`--background`, `--surface-1/2/3`, `--border`, `--border-strong`, `--accent: #B7FF00`).
3. **Three-Mode Native**: Works seamlessly across **Default (System)**, **Light**, and **Dark** appearance modes.
4. **Accessible by Default**: WAI-ARIA compliant semantics, full keyboard navigation (`Tab`, `ArrowKeys`, `Space`, `Enter`, `Escape`), and high-contrast visible focus rings (`:focus-visible`).
5. **Zero Heavy Framework Bloat**: Pure React + Tailwind implementation with zero external UI framework dependencies.

---

## Component Catalog

### 1. Foundation Components

| Component | Description | Key Variants / Props |
| :--- | :--- | :--- |
| **`Button`** | Standard interactive button with loading & icon support. | `variant`: `primary`, `secondary`, `outline`, `ghost`, `danger`<br>`size`: `sm`, `md`, `lg`<br>`isLoading`, `leftIcon`, `rightIcon` |
| **`IconButton`** | Equal-ratio icon button requiring `aria-label`. | `variant`, `size`, `isLoading`, `aria-label` |
| **`Badge`** | Compact status badge with optional indicator dot. | `variant`: `default`, `accent`, `outline`, `success`, `warning`, `danger`<br>`size`: `sm`, `md`<br>`dot`: `boolean` |
| **`Card`** | Base surface container with modular subcomponents. | `variant`: `default`, `interactive`, `outlined`, `subtle`<br>`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| **`Divider`** | Structural separator rule. | `orientation`: `horizontal`, `vertical`<br>`label`: `string` |
| **`Spinner`** | Accessible status spinner. | `size`: `sm`, `md`, `lg`<br>`label`: `string` |
| **`Skeleton`** | Content placeholder loader. | `className`: `string` |
| **`EmptyState`** | Standardized empty state presentation. | `icon`, `title`, `description`, `action`, `secondaryAction` |
| **`BrandLogo`** | Official S mark logo component. | `size`: `number`, `priority`: `boolean`, `alt`: `string` |

---

### 2. Form Components

| Component | Description | Key Features |
| :--- | :--- | :--- |
| **`Input`** | Form text input. | `error`, `leftIcon`, `rightIcon`, `leftAddon`, `rightAddon`, `inputSize` |
| **`Textarea`** | Multi-line text field. | `error`, `rows`, standard textarea props |
| **`Select`** | Accessible dropdown selector. | `options`: `{ value, label, disabled? }[]`<br>`value`, `onChange`, `placeholder`, `error`, `disabled` |
| **`Checkbox`** | Interactive checkbox with check/indeterminate states. | `checked`, `indeterminate`, `label`, `description`, `disabled` |
| **`RadioGroup`** | Radio button group with arrow key navigation. | `RadioGroup` container + `RadioGroupItem` with `label` and `description` |
| **`Switch`** | Accessible toggle switch. | `checked`, `onCheckedChange`, `label`, `description`, `disabled` |
| **`FormField`** | Structural form field wrapper. | `label`, `required`, `description`, `error`, `success`, `htmlFor` |
| **`FormError`** | Accessible error banner (`role="alert"`). | `message`, `children` |
| **`FormSuccess`** | Accessible success notification. | `message`, `children` |

---

### 3. Overlay Components

| Component | Description | Key Features |
| :--- | :--- | :--- |
| **`Dialog`** | Modal dialog with focus trap & backdrop. | `isOpen`, `onClose`, `title`, `description`, `size`<br>`DialogHeader`, `DialogFooter` |
| **`Sheet`** | Side drawer panel. | `isOpen`, `onClose`, `side` (`left`, `right`, `top`, `bottom`), `title`, `description` |
| **`Tooltip`** | Hover & focus tooltip with delay. | `content`, `position` (`top`, `bottom`, `left`, `right`), `delay` |
| **`DropdownMenu`** | Action dropdown menu with arrow navigation. | `trigger`, `items`: `DropdownMenuItem[]`, `align` (`left`, `right`) |

---

### 4. Navigation Components

| Component | Description | Key Features |
| :--- | :--- | :--- |
| **`Tabs`** | Tabbed interface with WAI-ARIA tablist semantics. | `defaultValue`, `value`, `onValueChange`<br>`TabsList`, `TabsTrigger`, `TabsContent` |

---

## Usage Examples

### Button & IconButton
```tsx
import { Button, IconButton } from "@/components/ui";
import { Plus, Trash2 } from "lucide-react";

export function ActionGroup() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
        Create Project
      </Button>
      <Button variant="secondary">Cancel</Button>
      <IconButton variant="ghost" aria-label="Delete item">
        <Trash2 className="h-4 w-4" />
      </IconButton>
    </div>
  );
}
```

### FormField with Input & Select
```tsx
import { FormField, Input, Select } from "@/components/ui";

export function ProjectForm() {
  return (
    <div className="space-y-4 max-w-md">
      <FormField label="Project Name" required description="Choose a unique identifier.">
        <Input placeholder="e.g. Technical Jacket SS-24" />
      </FormField>

      <FormField label="Studio Category">
        <Select
          options={[
            { value: "apparel", label: "Apparel & Sportswear" },
            { value: "accessories", label: "Accessories" },
            { value: "footwear", label: "Footwear" },
          ]}
          placeholder="Select category..."
        />
      </FormField>
    </div>
  );
}
```

### Modal Dialog
```tsx
import { useState } from "react";
import { Dialog, DialogFooter, Button } from "@/components/ui";

export function ConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Generation"
        description="This will start an asynchronous generation job."
      >
        <p className="text-sm text-[var(--text-secondary)]">
          Are you sure you want to queue this job?
        </p>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => setIsOpen(false)}>Confirm</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
```
