import type { VariantProps } from "class-variance-authority";
import { HouseIcon } from "lucide-solid";
import { For } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { _NavLink, type navLinkStyles } from "./nav-link";

const meta: Meta<typeof _NavLink> = {
  title: "Navigation/NavLink",
  component: _NavLink,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    iconOnly: {
      options: [true, false],
      control: { type: "boolean" },
    },
    size: {
      options: ["xs", "sm", "md", "lg"],
      control: { type: "select" },
      defaultValue: "md",
    },
  },
  args: {
    iconOnly: false,
    size: "md",
  },
};

export default meta;

type Story = StoryObj<typeof _NavLink>;

export const Default: Story = {
  render: (args) => (
    <_NavLink {...args} href="/">
      {args.iconOnly ? <HouseIcon /> : "Default"}
    </_NavLink>
  ),
};

const sizes = ["xs", "sm", "md", "lg"] as const satisfies NonNullable<
  VariantProps<typeof navLinkStyles>["size"]
>[];

export const Sizes: Story = {
  render: () => (
    <div class="flex flex-wrap items-center gap-4">
      <For each={sizes}>
        {(s) => (
          <_NavLink size={s} href="/">
            {s}
          </_NavLink>
        )}
      </For>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div class="flex flex-wrap items-center gap-4">
      <_NavLink href="/">
        <HouseIcon />
        Dashboard
      </_NavLink>
      <_NavLink href="/" iconOnly>
        <HouseIcon />
      </_NavLink>
    </div>
  ),
};

export const Active: Story = {
  render: () => (
    <div class="flex flex-wrap items-center gap-4">
      <_NavLink data-status="active" href="/">
        Active (current page)
      </_NavLink>
      <_NavLink href="/not-found">Inactive</_NavLink>
    </div>
  ),
};
