import { BrushIcon, PencilIcon } from "lucide-solid";
import { Index, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { ToolButton } from "./tool-button";
import { StrokeInkIcon, StrokePenIcon } from "./icons";
import type { LucideIcon } from "lucide-solid";
import type { BrushVariant, PropsWithCommands, PropsWithTool } from "./types";
import { Menu } from "~/features/shared/components/ui";

type BrushToolMenuProps = PropsWithCommands &
  PropsWithTool & {
    isParentPanelVertical?: boolean;
  };

export function BrushToolMenu(props: BrushToolMenuProps) {
  const selected = (variant?: BrushVariant) =>
    variant
      ? props.tool === "brush" && props.variant === variant
      : props.tool === "brush";

  return (
    <Menu.Root
      positioning={{
        placement: props.isParentPanelVertical ? "right" : "bottom",
      }}
    >
      <ToolButton data-current-tool={selected()} as={Menu.Trigger}>
        <Show when={selected()} fallback={<BrushIcon />}>
          <Dynamic component={brushIconMap[props.variant as BrushVariant]} />
        </Show>
        <span class="sr-only">Brush</span>
      </ToolButton>

      <Menu.Positioner
        style={{
          "--z-index": "9999",
        }}
      >
        <Menu.Content class="min-w-min">
          <Index each={brushes}>
            {(brush) => (
              <ToolButton
                data-current-tool={selected(brush())}
                as={Menu.Item}
                value={brush()}
                onClick={() =>
                  props.commands.setTool({ tool: "brush", variant: brush() })
                }
              >
                <Dynamic component={brushIconMap[brush()]} />
                <span class="sr-only">{brush()}</span>
              </ToolButton>
            )}
          </Index>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}

const brushIconMap: Record<BrushVariant, LucideIcon> = {
  plain: StrokePenIcon,
  ink: StrokeInkIcon,
};

const brushes = Object.keys(brushIconMap) as BrushVariant[];
