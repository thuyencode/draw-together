---
name: ark-ui-tailgrids
description: >
  Wrap @ark-ui/solid components with TailGrids v3 styling in SolidJS.
  Trigger: user asks to build dialog/alert/select/combobox/accordion/tabs/menu/popover/tooltip/slider
  or any Ark UI wrapper with TailGrids look. BEFORE coding, use grill-me to interview user
  about which component, which TailGrids source, variant needs. Covers: interview → token map
  → compound export (splitProps + cn + spread rest) → stories → barrel export.
---

# Ark UI → TailGrids Wrapper Components

Create SolidJS wrapper components bridging **@ark-ui/solid** primitives with **TailGrids v3** design system styling. Follow existing project patterns in `src/features/shared/components/ui/`.

## Before You Start

### Read refs

- `src/app.css` — Project CSS vars (`--color-*`, `--border-color-*`)
- `src/features/shared/utils/cn.ts` — Class merge utility
- `src/features/shared/components/ui/` — Existing components for pattern ref
- `src/features/shared/components/ui/index.ts` — Barrel export

### Grill user first

**Do NOT write code until user confirms.** Use `grill-me` skill to interview:

1. Which Ark UI component? (Alert/Dialog/Select/Combobox/Accordion/Tabs/Menu/Popover/etc.)
2. Which TailGrids source to match? (URL, snippet, or ref in `tailgrids-v3-style-reference` skill)
3. Variants needed? (success/warning/danger/info, sizes, etc.)
4. Special requirements? (animations, custom data attrs, close button, icon slot)

## Pattern

### Compound export

Single object, dot-notation usage:

```tsx
export const X = { Root: XRoot, Trigger: XTrigger, Content: XContent, ... }
// <X.Root>...</X.Root>
```

### 3 wrapper tiers

| Tier           | When                 | Code                                |
| -------------- | -------------------- | ----------------------------------- |
| Pass-through   | No styling           | `Root: BaseX.Root`                  |
| Styled wrapper | Add Tailwind classes | `splitProps` → `cn()` → `{...rest}` |

### Styled wrapper template

```tsx
import { X as BaseX } from "@ark-ui/solid";
import { splitProps } from "solid-js";
import { cn } from "../../utils/cn";

function XPart(_props: BaseX.PartProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  return <BaseX.Part class={cn("tailwind-classes", props.class)} {...rest} />;
}
```

Rules:

- Param always `_props` (raw props, don't touch)
- `splitProps` extract only `"class"`
- `cn(projectClasses, props.class)` — user override wins
- `{...rest}` after class so Ark UI internal props pass through
- Type with `BaseX.PartProps` directly — no separate `import type`

### Token mapping: TailGrids → project CSS vars

| TailGrids                 | Project var                   | Example                        |
| ------------------------- | ----------------------------- | ------------------------------ |
| `gray-50`                 | `--color-background-soft-50`  | `bg-background-soft-50`        |
| `gray-100`                | `--color-background-soft-100` | `bg-background-soft-100`       |
| `gray-200`                | `--border-color-base-100`     | `border-border-color-base-100` |
| `gray-300`                | `--border-color-base-300`     | `border-border-color-base-300` |
| `gray-400`                | `--color-text-200`            | `text-text-200`                |
| `gray-500`                | `--color-text-100`            | `text-text-100`                |
| `gray-700`                | `--color-text-50`             | `text-text-50`                 |
| `gray-800`                | `--color-title-50`            | `text-title-50`                |
| `white`                   | `--color-background-50`       | `bg-background-50`             |
| `primary (#3758F9)`       | `--color-primary-500`         | `bg-primary-500`               |
| `primary-dark (#1B44C8)`  | `--color-primary-600`         | `bg-primary-600`               |
| `primary-light (#EEF2FF)` | `--color-primary-50`          | `bg-primary-50`                |
| `success (#22C55E)`       | `--color-success-500`         | `text-success-500`             |
| `danger (#EF4444)`        | `--color-error-500`           | `text-error-500`               |
| `warning (#F59E0B)`       | `--color-warning-500`         | `text-warning-500`             |
| `info (#0EA5E9)`          | `--color-info-500`            | `text-info-500`                |

For tokens without project match → use Tailwind built-in colors or add new var to `app.css`.

### State class syntax (Tailwind v4)

```tsx
// Boolean data attrs — Tailwind v4 syntax
"data-disabled:opacity-50 data-focus-visible:ring-4";

// Value-based data attrs — bracket syntax
"data-[state='open']:animate-in";
```

## Workflow

### 1. Write component

`src/features/shared/components/ui/component-name.tsx`

- Import Ark UI base as `BaseX`
- Write styled wrappers per sub-part
- Export compound object

### 2. Write stories

`src/features/shared/components/ui/component-name.stories.tsx`

```tsx
import type { Meta, StoryObj } from "storybook-solidjs";
import { ComponentName } from "./component-name";

const meta = {
  title: "Forms/ComponentName",
  component: ComponentName.Root,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ComponentName.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ComponentName.Root>
      <ComponentName.Trigger>Open</ComponentName.Trigger>
      <ComponentName.Positioner>
        <ComponentName.Content>Content</ComponentName.Content>
      </ComponentName.Positioner>
    </ComponentName.Root>
  ),
};
```

Story guidelines:

- Title: `"Forms/X"` or `"Overlays/X"` by category
- First story: `Default`
- Add: default, with label, disabled, variants, positioning
- `parameters: { layout: "centered" }`

### 3. Register export

Add to `src/features/shared/components/ui/index.ts`:

```tsx
export * from "./component-name";
```

### 4. Verify

Run diagnostics. Fix TS errors.

## Common pitfalls

- **Don't destructure props** — Solid props are getters. Use `splitProps`.
- **Don't import Ark UI prop types separately** — Use `BaseX.PartProps` inline.
- **Don't wrap pass-through** — No styling? Point directly to `BaseX.Part`.
- **Don't forget `{...rest}`** — Ark UI internal props won't reach DOM.
- **Don't use React Aria hooks** — TailGrids source may use `useXState`. Ark UI handles state internally.
- **Don't hardcode hex** — Use project CSS vars from `app.css`.
