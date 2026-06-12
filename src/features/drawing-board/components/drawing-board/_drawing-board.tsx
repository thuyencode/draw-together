import type Konva from "konva";
import { createEffect, For, onCleanup } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import { createStore } from "solid-js/store";
import { Layer, Line, Stage, useStage } from "solid-konva";
import { ToolSettingsPanels } from "./tool-settings-panel";
import { ToolsPanel } from "./tools-panel";
import type { SetToolFunc, Tool } from "./types";

interface DrawingState {
  isPainting: boolean;
  tool: Tool;
}

interface LineInfo {
  tool: Tool;
  points: number[];
}

export default function _DrawingBoard() {
  let containerRef!: HTMLDivElement;

  const [drawingState, setDrawingState] = createStore<DrawingState>({
    isPainting: false,
    tool: "brush",
  });

  const setTool: SetToolFunc = (tool) => setDrawingState("tool", tool);

  return (
    <div class="relative h-full" ref={containerRef}>
      <ToolsPanel
        tool={drawingState.tool}
        setTool={setTool}
        containerRef={containerRef}
        defaultPosition="top-left"
      />
      <ToolSettingsPanels
        tool={drawingState.tool}
        containerRef={containerRef}
        defaultPosition="bottom-right"
      />

      <Stage class="h-full">
        <Layer>
          <LineArt
            drawingState={drawingState}
            setDrawingState={setDrawingState}
          />
        </Layer>
      </Stage>
    </div>
  );
}

function LineArt(props: {
  drawingState: DrawingState;
  setDrawingState: SetStoreFunction<DrawingState>;
}) {
  const [lines, setLines] = createStore<LineInfo[]>([]);
  const stage = useStage();

  createEffect(() => {
    const currentStage = stage?.stage();
    if (!currentStage) return;

    const onMouseDown = () => {
      props.setDrawingState("isPainting", true);

      const pos = currentStage.getPointerPosition();
      if (!pos) return;

      setLines((prev) => [
        ...prev,
        {
          tool: props.drawingState.tool,
          points: [pos.x, pos.y, pos.x, pos.y],
        },
      ]);
    };

    const onMouseUp = () => {
      props.setDrawingState("isPainting", false);
    };

    const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!props.drawingState.isPainting) return;

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
