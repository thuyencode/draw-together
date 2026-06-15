import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { ColorSettingsPanels } from "./color-settings-panel";
import { DrawingCanvas } from "./drawing-canvas";
import { ToolSettingsPanels } from "./tool-settings-panel";
import { ToolsPanel } from "./tools-panel";
import type { DrawingAction, DrawingState } from "./types";

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

  const dispatch = (action: DrawingAction) => {
    switch (action.type) {
      case "set_tool":
        setDrawingState("tool", action.tool);
        break;
      case "set_stroke_width":
        setDrawingState("strokeWidth", action.strokeWidth);
        break;
      case "set_color":
        setDrawingState("color", action.color);
        break;
      case "set_is_painting":
        setDrawingState("isPainting", action.isPainting);
        break;
    }
  };

  return (
    <div class="relative h-full" ref={containerRef}>
      <ToolsPanel
        tool={drawingState.tool}
        dispatch={dispatch}
        containerRef={containerRef}
        defaultPosition="top-left"
      />
      <ToolSettingsPanels
        tool={drawingState.tool}
        dispatch={dispatch}
        containerRef={containerRef}
        defaultPosition="bottom-right"
        drawingState={drawingState}
      />
      <ColorSettingsPanels
        dispatch={dispatch}
        containerRef={containerRef}
        defaultPosition="top-right"
        color={drawingState.color}
      />

      <DrawingCanvas drawingState={drawingState} dispatch={dispatch} />
    </div>
  );
}
