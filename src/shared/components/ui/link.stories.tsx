import { MemoryRouter, Route } from "@solidjs/router";
import { LinkIcon } from "lucide-solid";
import { For } from "solid-js";
import {
  createJSXDecorator,
  type Meta,
  type StoryObj,
} from "storybook-solidjs-vite";
import { Link, type LinkProps } from "./link";

const decorator = createJSXDecorator((Story) => (
  <MemoryRouter root={Story}>
    <Route path="/" component={Story} />
  </MemoryRouter>
));

const meta: Meta<typeof Link> = {
  title: "Navigation/Link",
  component: Link,
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
  decorators: [decorator],
};

export default meta;

type Story = StoryObj<typeof Link>;

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
          <Link variant={v} href="#">
            {v}
            <LinkIcon />
          </Link>
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
          <Link size={s} href="#">
            {s}
            <LinkIcon />
          </Link>
        )}
      </For>
    </div>
  ),
};
