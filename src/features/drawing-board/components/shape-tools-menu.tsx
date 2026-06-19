import { CircleIcon, ShapesIcon, SquareIcon } from "lucide-solid";
import { Index, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { ToolButton } from "./tool-button";
import type { LucideIcon } from "lucide-solid";
import type { PropsWithDispatch, PropsWithTool, Shape } from "./types";
import { Menu } from "~/features/shared/components/ui";

const shapeIconMap: Record<Shape, LucideIcon> = {
  circle: CircleIcon,
  rectangle: SquareIcon,
};

const shapes = Object.keys(shapeIconMap) as Shape[];

type ShapeToolsMenuProps = PropsWithDispatch &
  PropsWithTool & {
    isParentPanelVertical?: boolean;
  };

export function ShapeToolsMenu(props: ShapeToolsMenuProps) {
  const selected = () => Object.hasOwn(shapeIconMap, props.tool);

  return (
    <Menu.Root
      positioning={{
        placement: props.isParentPanelVertical ? "right" : "bottom",
      }}
    >
      <ToolButton data-current-tool={selected()} as={Menu.Trigger}>
        <Show when={selected()} fallback={<ShapesIcon />}>
          <Dynamic component={shapeIconMap[props.tool as Shape]} />
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
                data-current-tool={props.tool === shape()}
                as={Menu.Item}
                value={shape()}
                onClick={() =>
                  props.dispatch({ type: "set_tool", tool: shape() })
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
