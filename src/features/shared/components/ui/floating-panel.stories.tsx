import {
  ArrowDownLeft,
  GripVerticalIcon,
  Maximize2,
  Minus,
  XIcon,
} from "lucide-solid";
import { Portal } from "solid-js/web";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
  FloatingPanel,
  FloatingPanelBody,
  FloatingPanelCloseTrigger,
  FloatingPanelContent,
  FloatingPanelControl,
  FloatingPanelDragTrigger,
  FloatingPanelHeader,
  FloatingPanelPositioner,
  FloatingPanelResizeTrigger,
  FloatingPanelStageTrigger,
  FloatingPanelTitle,
  FloatingPanelTrigger,
} from "./floating-panel";

const meta: Meta = {
  title: "Overlay/FloatingPanel",
  component: FloatingPanel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <FloatingPanel defaultOpen>
      <FloatingPanelTrigger>Toggle Panel</FloatingPanelTrigger>
      <Portal>
        <FloatingPanelPositioner>
          <FloatingPanelContent>
            <FloatingPanelDragTrigger>
              <FloatingPanelHeader>
                <FloatingPanelTitle>
                  <GripVerticalIcon />
                  Floating Panel
                </FloatingPanelTitle>
                <FloatingPanelControl>
                  <FloatingPanelStageTrigger stage="minimized">
                    <Minus />
                  </FloatingPanelStageTrigger>
                  <FloatingPanelStageTrigger stage="maximized">
                    <Maximize2 />
                  </FloatingPanelStageTrigger>
                  <FloatingPanelStageTrigger stage="default">
                    <ArrowDownLeft />
                  </FloatingPanelStageTrigger>
                  <FloatingPanelCloseTrigger>
                    <XIcon />
                  </FloatingPanelCloseTrigger>
                </FloatingPanelControl>
              </FloatingPanelHeader>
            </FloatingPanelDragTrigger>

            <FloatingPanelBody>
              <p>Some content</p>
            </FloatingPanelBody>

            <FloatingPanelResizeTrigger axis="n" />
            <FloatingPanelResizeTrigger axis="e" />
            <FloatingPanelResizeTrigger axis="w" />
            <FloatingPanelResizeTrigger axis="s" />
            <FloatingPanelResizeTrigger axis="ne" />
            <FloatingPanelResizeTrigger axis="se" />
            <FloatingPanelResizeTrigger axis="sw" />
            <FloatingPanelResizeTrigger axis="nw" />
          </FloatingPanelContent>
        </FloatingPanelPositioner>
      </Portal>
    </FloatingPanel>
  ),
};
