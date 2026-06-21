import { ErrorBoundary, Suspense, lazy, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { ClientOnly } from "@tanstack/solid-router";
import { ColorSettingsPanels } from "./color-settings-panel";
import { ToolSettingsPanels } from "./tool-settings-panel";
import { ToolsPanel } from "./tools-panel";
import type { Commands, DrawingElements, DrawingSettings } from "./types";

const DrawingCanvas = lazy(() => import("./drawing-canvas"));

export default function DrawingBoard() {
  let containerRef!: HTMLDivElement;

  const [settings, setSettings] = createStore<DrawingSettings>({
    tool: "straight-line",
    variant: "plain",
    isPainting: false,
    strokeWidth: 5,
    color: { r: 9, g: 139, b: 250 },
  });

  const [elements, setElements] = createStore<DrawingElements>({
    freeformLines: [],
    shapes: [],
    straightLines: [],
  });

  const commands: Commands = {
    setTool(ts) {
      setSettings(ts);
    },
    setStrokeWidth(strokeWidth) {
      setSettings("strokeWidth", strokeWidth);
    },
    setColor(color) {
      setSettings("color", color);
    },
    setIsPainting(isPainting) {
      setSettings("isPainting", isPainting);
    },
    addFreeformLine(line) {
      setElements("freeformLines", elements.freeformLines.length, line);
    },
    appendFreeformPoint(point) {
      const lastIdx = elements.freeformLines.length - 1;
      if (lastIdx === -1) return;

      setElements("freeformLines", lastIdx, "points", (prev) => [
        ...prev,
        ...point,
      ]);
    },
    addShape(shape) {
      setElements("shapes", elements.shapes.length, shape);
    },
    addStraightLine(line) {
      setElements("straightLines", elements.straightLines.length, line);
    },
  };

  return (
    <div class="relative h-full" ref={containerRef}>
      <ToolsPanel
        tool={settings.tool}
        variant={settings.variant}
        commands={commands}
        containerRef={containerRef}
        defaultPosition="top-left"
      />
      <ToolSettingsPanels
        tool={settings.tool}
        variant={settings.variant}
        commands={commands}
        containerRef={containerRef}
        defaultPosition="bottom-right"
        settings={settings}
      />
      <ColorSettingsPanels
        commands={commands}
        containerRef={containerRef}
        defaultPosition="top-right"
        color={settings.color}
      />

      <ClientOnly>
        <ErrorBoundary fallback={(error) => <LogError error={error} />}>
          <Suspense fallback={"Loading canvas..."}>
            <DrawingCanvas
              settings={settings}
              elements={elements}
              commands={commands}
            />
          </Suspense>
        </ErrorBoundary>
      </ClientOnly>
    </div>
  );
}

function LogError(props: { error: unknown }) {
  onMount(() => {
    console.log("ErrorBoundary");
    console.error(props.error);
  });

  return null;
}
