import { CircleIcon, ShapesIcon, SquareIcon } from "lucide-solid";
import { Index, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { ToolButton } from "./tool-button";
import type { LucideIcon } from "lucide-solid";
import type { PropsWithCommands, PropsWithTool, ShapeVariant } from "./types";
import { Menu } from "~/features/shared/components/ui";

type ShapeToolMenuProps = PropsWithCommands &
  PropsWithTool & {
    isParentPanelVertical?: boolean;
  };

export function ShapeToolMenu(props: ShapeToolMenuProps) {
  const selected = (variant?: ShapeVariant) =>
    variant
      ? props.tool === "shape" && props.variant === variant
      : props.tool === "shape";

  return (
    <Menu.Root
      positioning={{
        placement: props.isParentPanelVertical ? "right" : "bottom",
      }}
    >
      <ToolButton data-current-tool={selected()} as={Menu.Trigger}>
        <Show when={selected()} fallback={<ShapesIcon />}>
          <Dynamic component={shapeIconMap[props.variant as ShapeVariant]} />
        </Show>
        <span class="sr-only">Shapes</span>
      </ToolButton>

      <Menu.Positioner
        style={{
          "--z-index": "9999",
        }}
      >
        <Menu.Content class="min-w-min">
          <Index each={shapes}>
            {(shape) => (
              <ToolButton
                data-current-tool={selected(shape())}
                as={Menu.Item}
                value={shape()}
                onClick={() =>
                  props.commands.setTool({ tool: "shape", variant: shape() })
                }
              >
                <Dynamic component={shapeIconMap[shape()]} />
                <span class="sr-only">{shape()}</span>
              </ToolButton>
            )}
          </Index>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}

const shapeIconMap: Record<ShapeVariant, LucideIcon> = {
  circle: CircleIcon,
  rectangle: SquareIcon,
};

const shapes = Object.keys(shapeIconMap) as ShapeVariant[];
