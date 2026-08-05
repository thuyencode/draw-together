import { CircleIcon, ShapesIcon, SquareIcon } from "lucide-solid";
import { Index, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { ToolButton } from "../ui";
import type { LucideIcon } from "lucide-solid";
import type { PropsWithSettings, ShapeVariant } from "../../types";
import { Menu } from "~/features/shared/components/ui";
import { m } from "~/paraglide/messages";

const shapeIconMap: Record<ShapeVariant, LucideIcon> = {
  circle: CircleIcon,
  rectangle: SquareIcon,
};
const shapeLabelMap: Record<ShapeVariant, () => string> = {
  circle: () => m.tools_shapeCircle(),
  rectangle: () => m.tools_shapeRectangle(),
};
const shapes = Object.keys(shapeIconMap) as ShapeVariant[];

type ShapeToolMenuProps = PropsWithSettings & {
  isParentPanelVertical?: boolean;
};

export function ShapeToolMenu(props: ShapeToolMenuProps) {
  const selected = (variant?: ShapeVariant) =>
    variant
      ? props.settings.tool === "shape" && props.settings.variant === variant
      : props.settings.tool === "shape";

  return (
    <Menu.Root
      positioning={{
        placement: props.isParentPanelVertical ? "right" : "bottom",
      }}
    >
      <ToolButton data-current-tool={selected()} as={Menu.Trigger}>
        <Show when={selected()} fallback={<ShapesIcon />}>
          <Dynamic
            component={shapeIconMap[props.settings.variant as ShapeVariant]}
          />
        </Show>
        <span class="sr-only">{m.tools_shapes()}</span>
      </ToolButton>

      <Menu.Positioner>
        <Menu.Content class="min-w-min">
          <Index each={shapes}>
            {(shape) => (
              <ToolButton
                data-current-tool={selected(shape())}
                as={Menu.Item}
                value={shape()}
                onClick={() =>
                  // eslint-disable-next-line solid/reactivity
                  props.setSettings((prev) => ({
                    ...prev,
                    tool: "shape",
                    variant: shape(),
                  }))
                }
              >
                <Dynamic component={shapeIconMap[shape()]} />
                <span class="sr-only">{shapeLabelMap[shape()]()}</span>
              </ToolButton>
            )}
          </Index>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
