import { XIcon } from "lucide-solid";
import { For } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Button, type ButtonProps } from "./button";

const meta: Meta<typeof Button> = {
  title: "Actions/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["primary", "danger", "success", "ghost"],
      control: { type: "select" },
      defaultValue: "primary",
    },
    appearance: {
      options: ["fill", "outline"],
      control: { type: "radio" },
      defaultValue: "fill",
    },
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
    variant: "primary",
    appearance: "fill",
    iconOnly: false,
    size: "md",
    type: "button",
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  render: (args) => (
    <Button {...args}>{args.iconOnly ? <XIcon /> : "Default"}</Button>
  ),
};

const variants = [
  "primary",
  "danger",
  "success",
  "ghost",
] as const satisfies NonNullable<ButtonProps<"button">["variant"]>[];

export const Variants: Story = {
  render: () => (
    <div class="flex flex-wrap gap-4">
      <For each={variants}>
        {(v) => (
          <Button type="button" variant={v}>
            {v}
          </Button>
        )}
      </For>
    </div>
  ),
};

const appearances = ["fill", "outline"] as const satisfies NonNullable<
  ButtonProps<"button">["appearance"]
>[];

export const Appearances: Story = {
  render: () => (
    <div class="space-y-10 lg:space-y-5">
      <For each={appearances}>
        {(appearance) => (
          <div class="flex items-center justify-between gap-6 md:gap-11 flex-wrap">
            <p class="text-title-50 capitalize">{appearance}:</p>
            <div class="flex flex-wrap gap-4">
              <For each={variants}>
                {(variant) => (
                  <Button
                    type="button"
                    variant={variant}
                    appearance={appearance}
                  >
                    {variant}
                  </Button>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  ),
};

const sizes = ["xs", "sm", "md", "lg"] as const satisfies NonNullable<
  ButtonProps<"button">["size"]
>[];

export const Sizes: Story = {
  render: () => (
    <div class="flex flex-wrap gap-4 items-center">
      <For each={sizes}>
        {(size) => (
          <Button type="button" size={size} variant="primary" appearance="fill">
            {size}
          </Button>
        )}
      </For>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div class="flex flex-wrap items-center gap-4">
      <Button type="button">
        <XIcon />
        Add Item
      </Button>
      <Button type="button" iconOnly>
        <XIcon />
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Button type="button" disabled>
      Disabled
    </Button>
  ),
};
