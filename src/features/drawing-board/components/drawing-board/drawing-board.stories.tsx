import {
  createJSXDecorator,
  type Meta,
  type StoryObj,
} from "storybook-solidjs-vite";
import { DrawingBoard } from "./";

const decorator = createJSXDecorator((Story) => (
  <div class="h-dvh">
    <Story />
  </div>
));

const meta: Meta<typeof DrawingBoard> = {
  title: "Canvas/DrawingBoard",
  component: DrawingBoard,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [decorator],
};

export default meta;

type Story = StoryObj<typeof DrawingBoard>;

export const Default: Story = {};
