import { For } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Slider } from "./slider";

const meta: Meta<typeof Slider.Root> = {
  title: "Forms/Slider",
  component: Slider.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Slider.Root>;

export const Default: Story = {
  render: () => (
    <Slider.Root defaultValue={[40]}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0} />
      </Slider.Control>
    </Slider.Root>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <Slider.Root defaultValue={[60]}>
      <div class="flex justify-between">
        <Slider.Label>Volume</Slider.Label>
        <Slider.ValueText />
      </div>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0} />
      </Slider.Control>
    </Slider.Root>
  ),
};

export const Range: Story = {
  render: () => (
    <Slider.Root defaultValue={[30, 70]}>
      <Slider.Label>Price range</Slider.Label>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0} />
        <Slider.Thumb index={1} />
      </Slider.Control>
    </Slider.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Slider.Root defaultValue={[50]} disabled>
      <div class="flex justify-between">
        <Slider.Label>Disabled</Slider.Label>
        <Slider.ValueText />
      </div>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0} />
      </Slider.Control>
    </Slider.Root>
  ),
};

export const WithMarks: Story = {
  render: () => (
    <Slider.Root defaultValue={[50]}>
      <div class="flex justify-between">
        <Slider.Label>Opacity</Slider.Label>
        <Slider.ValueText />
      </div>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0} />
      </Slider.Control>
      <Slider.MarkerGroup>
        <For each={[0, 25, 50, 75, 100]}>
          {(value) => <Slider.Marker value={value}>{value}</Slider.Marker>}
        </For>
      </Slider.MarkerGroup>
    </Slider.Root>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Slider.Root orientation="vertical" defaultValue={[40]}>
      <Slider.Label>Volume</Slider.Label>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0} />
      </Slider.Control>
      <Slider.ValueText />
    </Slider.Root>
  ),
};
