import { ArrowDownLeftIcon, GripVerticalIcon, XIcon } from "lucide-solid";
import { createSignal } from "solid-js";
import { createPosition } from "../../hooks";
import { normalizeToolName } from "../../utils";
import type {
  PropsWithContainerRef,
  PropsWithDefaultPosition,
  PropsWithSettings,
  Size,
} from "../../types";
import { FloatingPanel } from "~/features/shared/components/ui";
import { m } from "~/paraglide/messages";

const MIN_WIDTH = 245;
const MIN_HEIGHT = 230;

type ToolSettingsPanelsProps = PropsWithSettings &
  PropsWithContainerRef &
  PropsWithDefaultPosition;

export function ToolSettingsPanels(props: ToolSettingsPanelsProps) {
  const [size, setSize] = createSignal<Size>({
    width: MIN_WIDTH,
    height: MIN_HEIGHT,
  });
  const [position, setPosition] = createPosition(
    props.defaultPosition,
    () => props.containerRef,
    size,
  );

  return (
    <FloatingPanel.Root
      defaultOpen
      strategy="absolute"
      position={position()}
      onPositionChange={function handlePositionChange(detail) {
        setPosition(detail.position);
      }}
      minSize={{
        width: MIN_WIDTH,
        height: MIN_HEIGHT,
      }}
      size={size()}
      onSizeChange={function handleSizeChange(detail) {
        setSize(detail.size);
      }}
    >
      <FloatingPanel.Positioner
        ssrStyle={{
          "--x": "20px",
          "--y": "20px",
        }}
      >
        <FloatingPanel.Content>
          <FloatingPanel.DragTrigger>
            <FloatingPanel.Header>
              <FloatingPanel.Title class="capitalize">
                <GripVerticalIcon />
                {m.toolSettings_settings({
                  tool: normalizeToolName(props.settings.tool),
                })}
              </FloatingPanel.Title>

              <FloatingPanel.Control>
                <FloatingPanel.StageTrigger stage="default">
                  <ArrowDownLeftIcon />
                </FloatingPanel.StageTrigger>
                <FloatingPanel.CloseTrigger>
                  <XIcon />
                </FloatingPanel.CloseTrigger>
              </FloatingPanel.Control>
            </FloatingPanel.Header>
          </FloatingPanel.DragTrigger>

          <FloatingPanel.Body class="p-2">
            <label class="input">
              <span class="text-neutral-500">
                {m.toolSettings_strokeSize()}
              </span>
              <input
                type="number"
                class="grow"
                min="1"
                step="1"
                value={props.settings.strokeWidth}
                onChange={(e) => {
                  props.setSettings(
                    "strokeWidth",
                    Number.parseInt(e.target.value, 10),
                  );
                }}
              />
              <span class="badge badge-info badge-soft badge-xs">px</span>
            </label>
          </FloatingPanel.Body>

          <FloatingPanel.ResizeTrigger axis="n" />
          <FloatingPanel.ResizeTrigger axis="e" />
          <FloatingPanel.ResizeTrigger axis="w" />
          <FloatingPanel.ResizeTrigger axis="s" />
          <FloatingPanel.ResizeTrigger axis="ne" />
          <FloatingPanel.ResizeTrigger axis="se" />
          <FloatingPanel.ResizeTrigger axis="sw" />
          <FloatingPanel.ResizeTrigger axis="nw" />
        </FloatingPanel.Content>
      </FloatingPanel.Positioner>
    </FloatingPanel.Root>
  );
}
