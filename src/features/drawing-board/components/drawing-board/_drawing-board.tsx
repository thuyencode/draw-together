import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { ColorSettingsPanels } from "./color-settings-panel";
import { DrawingCanvas } from "./drawing-canvas";
import { ToolSettingsPanels } from "./tool-settings-panel";
import { ToolsPanel } from "./tools-panel";
import type { DrawingState, SetToolFunc } from "./types";

export default function _DrawingBoard() {
  let containerRef!: HTMLDivElement;

  const [drawingState, setDrawingState] = createStore<DrawingState>({
    isPainting: false,
    tool: "brush",
    strokeWidth: 5,
    color: "#df4b26",
  });

  createEffect(() => {
    console.log(drawingState.strokeWidth);
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
        drawingState={drawingState}
        setDrawingState={setDrawingState}
      />
      <ColorSettingsPanels
        containerRef={containerRef}
        defaultPosition="top-right"
        drawingState={drawingState}
        setDrawingState={setDrawingState}
      />

      <DrawingCanvas
        drawingState={drawingState}
        setDrawingState={setDrawingState}
      />
    </div>
  );
}
