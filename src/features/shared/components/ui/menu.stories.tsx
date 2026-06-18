import { CheckIcon, CopyIcon, DeleteIcon, PenIcon } from "lucide-solid";
import { createSignal } from "solid-js";
import { Button } from "./button";
import { Menu } from "./menu";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

const meta: Meta<typeof Menu> = {
  title: "Overlays/Menu",
  component: Menu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: () => (
    <Menu.Root>
      <Button as={Menu.Trigger}>Open Menu</Button>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item value="profile">Profile</Menu.Item>
          <Menu.Item value="settings">Settings</Menu.Item>
          <Menu.Item value="billing">Billing</Menu.Item>
          <Menu.Separator />
          <Menu.Item value="logout" data-variant="destructive">
            Logout
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Menu.Root>
      <Button as={Menu.Trigger}>With Icons</Button>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item value="edit">
            <PenIcon />
            Edit
          </Menu.Item>
          <Menu.Item value="duplicate">
            <CopyIcon />
            Duplicate
          </Menu.Item>
          <Menu.Item value="delete" data-variant="destructive">
            <DeleteIcon />
            Delete
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  ),
};

export const WithSubmenu: Story = {
  render: () => (
    <Menu.Root>
      <Button as={Menu.Trigger}>Open Submenu</Button>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item value="new-tab">New Tab</Menu.Item>
          <Menu.Item value="new-window">New Window</Menu.Item>
          <Menu.Root>
            <Menu.TriggerItem>Recent Files</Menu.TriggerItem>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="recent-1">index.tsx</Menu.Item>
                <Menu.Item value="recent-2">app.tsx</Menu.Item>
                <Menu.Item value="recent-3">styles.css</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
          <Menu.Separator />
          <Menu.Item value="close">Close</Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  ),
};

export const WithCheckboxItems: Story = {
  render: () => {
    const [showToolbar, setShowToolbar] = createSignal(true);
    const [showStatusBar, setShowStatusBar] = createSignal(false);

    return (
      <Menu.Root>
        <Button as={Menu.Trigger}>Show Columns</Button>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.CheckboxItem
              checked={showToolbar()}
              onCheckedChange={setShowToolbar}
              value="toolbar"
            >
              <Menu.ItemText>Show Toolbar</Menu.ItemText>
              <Menu.ItemIndicator>
                <CheckIcon />
              </Menu.ItemIndicator>
            </Menu.CheckboxItem>
            <Menu.CheckboxItem
              checked={showStatusBar()}
              onCheckedChange={setShowStatusBar}
              value="status-bar"
            >
              <Menu.ItemText>Show Status Bar</Menu.ItemText>
              <Menu.ItemIndicator>
                <CheckIcon />
              </Menu.ItemIndicator>
            </Menu.CheckboxItem>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    );
  },
};

export const WithRadioItems: Story = {
  render: () => {
    const [sortBy, setSortBy] = createSignal("date");

    return (
      <Menu.Root>
        <Button as={Menu.Trigger}>Sort By</Button>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.RadioItemGroup
              value={sortBy()}
              onValueChange={(e) => setSortBy(e.value)}
            >
              <Menu.ItemGroupLabel>Sort By</Menu.ItemGroupLabel>
              <Menu.RadioItem value="name">
                <Menu.ItemText>Name</Menu.ItemText>
                <Menu.ItemIndicator>
                  <CheckIcon />
                </Menu.ItemIndicator>
              </Menu.RadioItem>
              <Menu.RadioItem value="date">
                <Menu.ItemText>Date Modified</Menu.ItemText>
                <Menu.ItemIndicator>
                  <CheckIcon />
                </Menu.ItemIndicator>
              </Menu.RadioItem>
              <Menu.RadioItem value="size">
                <Menu.ItemText>Size</Menu.ItemText>
                <Menu.ItemIndicator>
                  <CheckIcon />
                </Menu.ItemIndicator>
              </Menu.RadioItem>
              <Menu.RadioItem value="type">
                <Menu.ItemText>Type</Menu.ItemText>
                <Menu.ItemIndicator>
                  <CheckIcon />
                </Menu.ItemIndicator>
              </Menu.RadioItem>
            </Menu.RadioItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    );
  },
};

export const WithGroupLabels: Story = {
  render: () => (
    <Menu.Root>
      <Button as={Menu.Trigger}>Grouped Menu</Button>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.ItemGroup id="actions">
            <Menu.ItemGroupLabel>Actions</Menu.ItemGroupLabel>
            <Menu.Item value="copy">Copy</Menu.Item>
            <Menu.Item value="cut">Cut</Menu.Item>
            <Menu.Item value="paste">Paste</Menu.Item>
          </Menu.ItemGroup>
          <Menu.Separator />
          <Menu.ItemGroup id="view">
            <Menu.ItemGroupLabel>View</Menu.ItemGroupLabel>
            <Menu.Item value="zoom-in">Zoom In</Menu.Item>
            <Menu.Item value="zoom-out">Zoom Out</Menu.Item>
            <Menu.Item value="fullscreen">Fullscreen</Menu.Item>
          </Menu.ItemGroup>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <Menu.Root>
      <Button as={Menu.Trigger}>Disabled Items</Button>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item value="available">Available</Menu.Item>
          <Menu.Item value="disabled" disabled>
            Disabled
          </Menu.Item>
          <Menu.Item value="also-available">Also Available</Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  ),
};

export const ContextMenu: Story = {
  render: () => (
    <Menu.Root>
      <Menu.ContextTrigger class="border-border-color-base-100 bg-background-soft-50 text-text-100 flex h-40 w-80 items-center justify-center rounded-lg border-2 border-dashed text-sm select-none">
        Right-click here
      </Menu.ContextTrigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item value="edit">Edit</Menu.Item>
          <Menu.Item value="cut">Cut</Menu.Item>
          <Menu.Item value="copy">Copy</Menu.Item>
          <Menu.Item value="paste">Paste</Menu.Item>
          <Menu.Separator />
          <Menu.Item value="delete" data-variant="destructive">
            Delete
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  ),
};
