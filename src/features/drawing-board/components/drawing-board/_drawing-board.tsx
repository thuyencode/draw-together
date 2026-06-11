import { FloatingPanel } from "@ark-ui/solid";
import type Konva from "konva";
import { GripVerticalIcon, MinusIcon, XIcon } from "lucide-solid";
import { createEffect, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { Portal } from "solid-js/web";
import { Layer, Line, Stage, useStage } from "solid-konva";

export default function _DrawingBoard() {
  return (
    <div class="relative size-full">
      <FloatingPanel.Root defaultOpen>
        <Portal>
          <FloatingPanel.Positioner>
            <FloatingPanel.Content>
              <FloatingPanel.DragTrigger>
                <FloatingPanel.Header>
                  <FloatingPanel.Title>
                    <GripVerticalIcon />
                    Tool
                  </FloatingPanel.Title>

                  <FloatingPanel.Control>
                    <FloatingPanel.StageTrigger stage="minimized">
                      <MinusIcon />
                    </FloatingPanel.StageTrigger>

                    <FloatingPanel.CloseTrigger>
                      <XIcon />
                    </FloatingPanel.CloseTrigger>
                  </FloatingPanel.Control>
                </FloatingPanel.Header>
              </FloatingPanel.DragTrigger>

              <FloatingPanel.Body>
                <p>Some content</p>
              </FloatingPanel.Body>
            </FloatingPanel.Content>
          </FloatingPanel.Positioner>
        </Portal>
      </FloatingPanel.Root>

      <Stage class="size-full">
        <Layer>
          <LineArt />
        </Layer>
      </Stage>
    </div>
  );
}

type Tool = "brush" | "eraser";

interface LineInfo {
  tool: Tool;
  points: number[];
}

function LineArt() {
  let isPainting = false;
  const tool: Tool = "brush";

  const [lines, setLines] = createStore<LineInfo[]>([]);
  const stage = useStage();

  createEffect(() => {
    const currentStage = stage?.stage();
    if (!currentStage) return;

    const onMouseDown = () => {
      isPainting = true;

      const pos = currentStage.getPointerPosition();
      if (!pos) return;

      setLines((prev) => [
        ...prev,
        { tool, points: [pos.x, pos.y, pos.x, pos.y] },
      ]);
    };

    const onMouseUp = () => {
      isPainting = false;
    };

    const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isPainting) return;

      e.evt.preventDefault();

      const pos = currentStage.getPointerPosition();
      if (!pos) return;

      const lastLineIdx = lines.length - 1;
      if (lastLineIdx === -1) return;

      setLines(lastLineIdx, "points", (prev) => [...prev, pos.x, pos.y]);
    };

    currentStage
      .on("mousedown touchstart", onMouseDown)
      .on("mousemove touchmove", onMouseMove)
      .on("mouseup touchend", onMouseUp);

    onCleanup(() => {
      currentStage
        .off("mousedown touchstart", onMouseDown)
        .off("mousemove touchmove", onMouseMove)
        .off("mouseup touchend", onMouseUp);
    });
  });

  return (
    <For each={lines}>
      {(line) => (
        <Line
          points={line.points}
          stroke="#df4b26"
          strokeWidth={5}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation={
            line.tool === "eraser" ? "destination-out" : "source-over"
          }
        />
      )}
    </For>
  );
}
