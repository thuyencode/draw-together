import {
  CheckCircle,
  CircleAlert,
  Info,
  TriangleAlert,
  XCircle,
} from "lucide-solid";
import { For } from "solid-js";
import Alert from "./alert";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

const meta: Meta<typeof Alert> = {
  title: "Feedback/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["success", "danger", "warning", "info", "gray"],
      control: { type: "select" },
      defaultValue: "success",
    },
  },
  args: {
    variant: "success",
    message: "This is an alert message.",
  },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: (args) => <Alert {...args} />,
};

const variants = [
  "success",
  "danger",
  "warning",
  "info",
  "gray",
] as const satisfies NonNullable<Parameters<typeof Alert>[0]["variant"]>[];

const variantIcons = {
  success: CheckCircle,
  danger: XCircle,
  warning: TriangleAlert,
  info: Info,
  gray: CircleAlert,
} as const;

export const Variants: Story = {
  render: () => (
    <div class="flex w-full flex-col gap-6">
      <For each={variants}>
        {(variant) => {
          const Icon = variantIcons[variant];

          return (
            <Alert
              variant={variant}
              title="Alert Title"
              message={`This is a ${variant} alert message.`}
              icon={<Icon />}
            />
          );
        }}
      </For>
    </div>
  ),
};

export const WithActions: Story = {
  render: () => (
    <div class="flex w-full flex-col gap-6">
      <Alert
        variant="danger"
        title="Delete Account"
        message="This action cannot be undone. This will permanently delete your account."
        icon={<XCircle />}
        actions={{
          primary: { label: "Delete", onClick: () => console.log("Deleted") },
          secondary: { label: "Cancel" },
        }}
      />
    </div>
  ),
};

export const WithoutTitle: Story = {
  render: () => (
    <div class="flex w-full flex-col gap-6">
      <Alert
        variant="info"
        message="A new software update is available. See what's new."
        icon={<Info />}
      />
    </div>
  ),
};
