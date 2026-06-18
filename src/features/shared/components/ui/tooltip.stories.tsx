import { For } from "solid-js";
import { Tooltip } from "./tooltip";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

const meta: Meta<typeof Tooltip> = {
  title: "Actions/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger>Hover me</Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Arrow>
          <Tooltip.ArrowTip />
        </Tooltip.Arrow>
        <Tooltip.Content>Hello from tooltip!</Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  ),
};

const placements = [
  "top-start",
  "top",
  "top-end",
  "right-start",
  "right",
  "right-end",
  "bottom-start",
  "bottom",
  "bottom-end",
  "left-start",
  "left",
  "left-end",
] as const;

export const Positioning: Story = {
  render: () => (
    <div class="grid max-w-3xl grid-cols-2 gap-6 p-6 md:grid-cols-3 md:p-12">
      <For each={placements}>
        {(placement) => (
          <Tooltip.Root
            positioning={{
              placement,
              offset: { mainAxis: 8 },
            }}
          >
            <Tooltip.Trigger>{placement}</Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Arrow>
                <Tooltip.ArrowTip />
              </Tooltip.Arrow>
              <Tooltip.Content>{placement}</Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
        )}
      </For>
    </div>
  ),
};
