import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { ColorSettingsPanels } from "./color-settings-panel";
import { DrawingCanvas } from "./drawing-canvas";
import { ToolSettingsPanels } from "./tool-settings-panel";
import { ToolsPanel } from "./tools-panel";
import type { DrawingAction, DrawingElements, DrawingSettings } from "./types";

export function DrawingBoard() {
  let containerRef!: HTMLDivElement;

  const [settings, setSettings] = createStore<DrawingSettings>({
    isPainting: false,
    tool: "straight-line",
    strokeWidth: 5,
    color: { r: 9, g: 139, b: 250 },
  });

  const [elements, setElements] = createStore<DrawingElements>({
    freeformLines: [],
    shapes: [],
    straightLines: [],
  });

  createEffect(() => {
    console.log(settings.color);
  });

  const dispatch = (action: DrawingAction) => {
    switch (action.type) {
      case "set_tool":
        setSettings("tool", action.tool);
        break;
      case "set_stroke_width":
        setSettings("strokeWidth", action.strokeWidth);
        break;
      case "set_color":
        setSettings("color", action.color);
        break;
      case "set_is_painting":
        setSettings("isPainting", action.isPainting);
        break;
      case "add_freeform_line":
        setElements(
          "freeformLines",
          elements.freeformLines.length,
          action.line,
        );
        break;
      case "append_freeform_point": {
        const lastIdx = elements.freeformLines.length - 1;
        if (lastIdx === -1) break;

        setElements("freeformLines", lastIdx, "points", (prev) => [
          ...prev,
          ...action.point,
        ]);
        break;
      }
      case "add_shape":
        setElements("shapes", elements.shapes.length, action.shape);
        break;
      case "add_straight_line":
        setElements(
          "straightLines",
          elements.straightLines.length,
          action.line,
        );
        break;
    }
  };

  return (
    <div class="relative h-full" ref={containerRef}>
      <ToolsPanel
        tool={settings.tool}
        dispatch={dispatch}
        containerRef={containerRef}
        defaultPosition="top-left"
      />
      <ToolSettingsPanels
        tool={settings.tool}
        dispatch={dispatch}
        containerRef={containerRef}
        defaultPosition="bottom-right"
        settings={settings}
      />
      <ColorSettingsPanels
        dispatch={dispatch}
        containerRef={containerRef}
        defaultPosition="top-right"
        color={settings.color}
      />

      <DrawingCanvas
        settings={settings}
        elements={elements}
        dispatch={dispatch}
      />
    </div>
  );
}
