import { MemoryRouter, Route } from "@solidjs/router";
import { type VariantProps } from "class-variance-authority";
import { HomeIcon } from "lucide-solid";
import { For } from "solid-js";
import {
  createJSXDecorator,
  type Meta,
  type StoryObj,
} from "storybook-solidjs-vite";
import { NavLink, type navLinkStyles } from "./nav-link";

const decorator = createJSXDecorator((Story) => (
  <MemoryRouter root={Story}>
    <Route path="/" component={Story} />
  </MemoryRouter>
));

const meta: Meta<typeof NavLink> = {
  title: "Navigation/NavLink",
  component: NavLink,
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
  decorators: [decorator],
};

export default meta;

type Story = StoryObj<typeof NavLink>;

export const Default: Story = {
  render: (args) => (
    <NavLink {...args} href="/">
      {args.iconOnly ? <HomeIcon /> : "Default"}
    </NavLink>
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
          <NavLink size={s} href="/">
            {s}
          </NavLink>
        )}
      </For>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div class="flex flex-wrap items-center gap-4">
      <NavLink href="/">
        <HomeIcon />
        Dashboard
      </NavLink>
      <NavLink href="/" iconOnly>
        <HomeIcon />
      </NavLink>
    </div>
  ),
};

export const Active: Story = {
  render: () => (
    <div class="flex flex-wrap items-center gap-4">
      <NavLink href="/">Active (current page)</NavLink>
      <NavLink href="/not-found">Inactive</NavLink>
    </div>
  ),
};
