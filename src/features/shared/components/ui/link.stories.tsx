import { LinkIcon } from "lucide-solid";
import { For } from "solid-js";
import { _Link } from "./link";
import type { LinkProps } from "./link";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

const meta: Meta<typeof _Link> = {
  title: "Navigation/Link",
  component: _Link,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["primary", "dark"],
      control: { type: "radio" },
    },
    size: {
      options: ["sm", "md"],
      control: { type: "radio" },
    },
  },
  args: {
    variant: "dark",
    size: "sm",
    href: "#",
  },
};

export default meta;

type Story = StoryObj<typeof _Link>;

export const Default: Story = {
  args: {
    children: "Default",
  },
};

const variants = ["primary", "dark"] as const satisfies NonNullable<
  LinkProps["variant"]
>[];

export const Variants: Story = {
  render: () => (
    <div class="flex flex-wrap items-center gap-4">
      <For each={variants}>
        {(v) => (
          <_Link variant={v} href="#">
            {v}
            <LinkIcon />
          </_Link>
        )}
      </For>
    </div>
  ),
};

const sizes = ["sm", "md"] as const satisfies NonNullable<LinkProps["size"]>[];

export const Sizes: Story = {
  render: () => (
    <div class="flex flex-wrap items-center gap-4">
      <For each={sizes}>
        {(s) => (
          <_Link size={s} href="#">
            {s}
            <LinkIcon />
          </_Link>
        )}
      </For>
    </div>
  ),
};
