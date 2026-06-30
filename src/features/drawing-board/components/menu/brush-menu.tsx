import { BrushIcon } from "lucide-solid";
import { Index, Show, untrack } from "solid-js";
import { Dynamic } from "solid-js/web";
import { StrokeInkIcon, StrokePenIcon } from "../icons";
import { ToolButton } from "../ui";
import type { BrushVariant, PropsWithSettings } from "../../types";
import type { LucideIcon } from "lucide-solid";
import { Menu } from "~/features/shared/components/ui";

type BrushToolMenuProps = PropsWithSettings & {
  isParentPanelVertical?: boolean;
};

export function BrushToolMenu(props: BrushToolMenuProps) {
  const selected = (variant?: BrushVariant) =>
    variant
      ? props.settings.tool === "brush" && props.settings.variant === variant
      : props.settings.tool === "brush";

  return (
    <Menu.Root
      positioning={{
        placement: props.isParentPanelVertical ? "right" : "bottom",
      }}
    >
      <ToolButton data-current-tool={selected()} as={Menu.Trigger}>
        <Show when={selected()} fallback={<BrushIcon />}>
          <Dynamic
            component={brushIconMap[props.settings.variant as BrushVariant]}
          />
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
                  props.setSettings((prev) => ({
                    ...prev,
                    tool: "brush",
                    variant: untrack(brush),
                  }))
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
  pressure: StrokeInkIcon,
};

const brushes = Object.keys(brushIconMap) as BrushVariant[];
