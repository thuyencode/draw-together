import { For } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
  Tooltip,
  TooltipArrow,
  TooltipArrowTip,
  TooltipContent,
  TooltipPositioner,
  TooltipTrigger,
} from "./tooltip";

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
    <Tooltip>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipPositioner>
        <TooltipArrow>
          <TooltipArrowTip />
        </TooltipArrow>
        <TooltipContent>Hello from tooltip!</TooltipContent>
      </TooltipPositioner>
    </Tooltip>
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
    <div class="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 md:p-12 max-w-3xl">
      <For each={placements}>
        {(placement) => (
          <Tooltip
            positioning={{
              placement,
              offset: { mainAxis: 8 },
            }}
          >
            <TooltipTrigger>{placement}</TooltipTrigger>
            <TooltipPositioner>
              <TooltipArrow>
                <TooltipArrowTip />
              </TooltipArrow>
              <TooltipContent>{placement}</TooltipContent>
            </TooltipPositioner>
          </Tooltip>
        )}
      </For>
    </div>
  ),
};
