import type { LucideIcon } from "lucide-solid";
import { CircleIcon, EllipseIcon, ShapesIcon, SquareIcon } from "lucide-solid";
import { Index, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Menu } from "~/features/shared/components/ui";
import { ToolButton } from "./tool-button";
import type { PropsWithDispatch, PropsWithTool, Shape } from "./types";

const shapes: Shape[] = ["circle", "rectangle", "oval"];
const icons: Record<Shape, LucideIcon> = {
  circle: CircleIcon,
  rectangle: SquareIcon,
  oval: EllipseIcon,
};

type ShapeToolsMenuProps = PropsWithDispatch &
  PropsWithTool & {
    isParentPanelVertical?: boolean;
  };

export function ShapeToolsMenu(props: ShapeToolsMenuProps) {
  return (
    <Menu.Root
      positioning={{
        placement: props.isParentPanelVertical ? "right" : "bottom",
      }}
    >
      <ToolButton
        iconOnly
        data-current-tool={shapes.includes(props.tool as Shape)}
        as={Menu.Trigger}
      >
        <Show when={Object.hasOwn(icons, props.tool)} fallback={<ShapesIcon />}>
          <Dynamic component={icons[props.tool as Shape]} />
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
                iconOnly
                data-current-tool={props.tool === shape()}
                as={Menu.Item}
                value={shape()}
                onClick={() =>
                  props.dispatch({ type: "set_tool", tool: shape() })
                }
              >
                <Dynamic component={icons[shape()]} />
                <span class="sr-only">{shape()}</span>
              </ToolButton>
            )}
          </Index>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
