import { createHotkey } from "@tanstack/solid-hotkeys";
import {
  ActiveSelection,
  Circle,
  FabricObject,
  PencilBrush,
  Rect,
} from "fabric";
import { PSBrush } from "fabricjs-psbrush";
import { createEffect, onCleanup, onMount, untrack } from "solid-js";
import { createStore } from "solid-js/store";
import { AddCommand } from "../commands";
import { createCanvas, useCanvasHistory } from "../hooks";
import { getCircleFromPoints, getRectFromPoints, rgbaToString } from "../utils";
import { ColorSettingsPanels, ToolSettingsPanels, ToolsPanel } from "./panels";
import type { Point, Settings } from "../types";
import type { FabricObjectProps } from "fabric";

FabricObject.customProperties = ["objectId"];

export default function DrawingBoard() {
  let containerRef!: HTMLDivElement;
  let canvasElementRef!: HTMLCanvasElement;

  const canvas = createCanvas(
    () => canvasElementRef,
    () => containerRef,
    { enablePointerEvents: true },
  );

  const [settings, setSettings] = createStore<Settings>({
    tool: "brush",
    variant: "plain",
    strokeWidth: 2,
    color: { r: 9, g: 139, b: 250 },
  });

  const {
    history,
    undone,
    pushCommand,
    handleUndo,
    handleRedo,
    handleReset,
    handleDelete,
  } = useCanvasHistory(canvas);

  onMount(() => {
    const c = canvas();
    if (!c) return;

    const untrack_settings = untrack(() => settings);
    const initialPoint: Point = { x: 0, y: 0 };
    let previewObject: FabricObject | undefined;

    const initialProps = (): Partial<FabricObjectProps> => ({
      top: initialPoint.x,
      left: initialPoint.y,
      fill: "transparent",
      stroke: rgbaToString(untrack_settings.color),
      strokeWidth: untrack_settings.strokeWidth,
    });

    c.on("mouse:down", (evt) => {
      initialPoint.x = evt.scenePoint.x;
      initialPoint.y = evt.scenePoint.y;
    });

    c.on("path:created", (evt) => {
      if (untrack_settings.tool === "brush") {
        pushCommand(new AddCommand(c, evt.path));
      }
    });

    c.on("mouse:down", () => {
      if (untrack_settings.tool === "shape") {
        switch (untrack_settings.variant) {
          case "circle":
            previewObject = new Circle(initialProps());
            break;

          case "rectangle":
            previewObject = new Rect(initialProps());
            break;
        }

        c.add(previewObject);
      }
    });

    c.on("mouse:move", (evt) => {
      if (untrack_settings.tool === "shape" && previewObject) {
        switch (untrack_settings.variant) {
          case "circle":
            previewObject.set(
              getCircleFromPoints(initialPoint, evt.scenePoint),
            );
            break;

          case "rectangle":
            previewObject.set(getRectFromPoints(initialPoint, evt.scenePoint));
            break;
        }

        c.requestRenderAll();
      }
    });

    c.on("mouse:up", () => {
      if (previewObject) {
        previewObject.objectId = window.crypto.randomUUID();

        const command = new AddCommand(c, previewObject);

        c.remove(previewObject);
        previewObject = undefined;
        command.execute();

        pushCommand(command);
      }
    });

    createEffect(() => {
      const isSelecting = settings.tool === "select";

      c.selection = isSelecting;
      c.skipTargetFind = !isSelecting;
    });

    createEffect(() => {
      const isFreeDrawing = settings.tool === "brush";

      c.isDrawingMode = isFreeDrawing;

      if (isFreeDrawing) {
        switch (settings.variant) {
          case "plain":
            c.freeDrawingBrush = new PencilBrush(c);
            break;

          case "pressure":
            c.freeDrawingBrush = new PSBrush(c);
            break;
        }

        c.freeDrawingBrush.width = settings.strokeWidth;
        c.freeDrawingBrush.color = rgbaToString(settings.color);
      } else {
        c.freeDrawingBrush = undefined;
      }
    });

    onCleanup(handleReset);
  });

  const handleSelectAll = () => {
    const c = canvas();
    if (!c) return;

    setSettings((prev) => ({
      ...prev,
      tool: "select",
      variant: "select",
    }));

    const objects = c.getObjects();
    if (objects.length === 0) return;

    const selection = new ActiveSelection(c.getObjects(), { canvas: c });
    c.setActiveObject(selection);
  };

  createHotkey("Mod+Z", handleUndo);
  createHotkey("Mod+Shift+Z", handleRedo);
  createHotkey("Mod+Delete", handleReset);
  createHotkey("Delete", handleDelete);
  createHotkey("Mod+A", handleSelectAll);

  return (
    <div class="relative h-full">
      <div class="absolute inset-0" ref={containerRef}>
        <canvas ref={canvasElementRef} />
      </div>

      <ToolsPanel
        settings={settings}
        setSettings={setSettings}
        containerRef={containerRef}
        defaultPosition="top-left"
        isUndoAvailable={history().length !== 0}
        isRedoAvailable={undone().length !== 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
      />

      <ColorSettingsPanels
        settings={settings}
        setSettings={setSettings}
        containerRef={containerRef}
        defaultPosition="top-right"
      />

      <ToolSettingsPanels
        settings={settings}
        setSettings={setSettings}
        containerRef={containerRef}
        defaultPosition="bottom-right"
      />
    </div>
  );
}
