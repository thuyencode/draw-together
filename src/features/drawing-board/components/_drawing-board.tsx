import { EraserBrush } from "@erase2d/fabric";
import { createHotkey } from "@tanstack/solid-hotkeys";
import {
  ActiveSelection,
  Circle,
  FabricObject,
  PencilBrush,
  Rect,
} from "fabric";
import { PSBrush } from "fabricjs-psbrush";
import {
  createEffect,
  onCleanup,
  onMount,
  splitProps,
  untrack,
} from "solid-js";
import { createStore } from "solid-js/store";
import { AddCommand, ModifyCommand, RemoveCommand } from "../commands";
import { EraseCommand } from "../commands/erase-command";
import { createCanvas, createCanvasHistory } from "../hooks";
import {
  getCircleFromPoints,
  getRectFromPoints,
  getTargetOfSelection,
} from "../utils";
import { DEFAULT_COLORS } from "../constants";
import { ColorPanels, ToolSettingsPanels, ToolsPanel } from "./panels";
import type { Point, Settings, StrokeConfig } from "../types";
import type { ComponentProps } from "solid-js";
import type { FabricObjectProps } from "fabric";
import type { ErasingEvent } from "@erase2d/fabric";
import { cn } from "~/features/shared/utils/cn";

FabricObject.customProperties = ["objectId", "erasable"];

export default function DrawingBoard(_props: ComponentProps<"div">) {
  let containerRef!: HTMLDivElement;
  let canvasElementRef!: HTMLCanvasElement;

  const [props, rest] = splitProps(_props, ["class"]);

  const canvas = createCanvas(
    () => canvasElementRef,
    () => containerRef,
    { enablePointerEvents: true },
  );

  const [settings, setSettings] = createStore<Settings>({
    tool: "brush",
    variant: "plain",
    strokeWidth: 2,
    colors: DEFAULT_COLORS,
  });

  const { history, undone, pushCommand, handleUndo, handleRedo, handleReset } =
    createCanvasHistory(canvas);

  onMount(() => {
    const c = canvas();
    if (!c) return;

    const untrack_settings = untrack(() => settings);
    const initialPoint: Point = { x: 0, y: 0 };
    let previewObject: FabricObject | undefined;
    let shouldPushModifyCommand = false;

    const initialShapeProps = (): Partial<FabricObjectProps> => ({
      top: initialPoint.x,
      left: initialPoint.y,
      fill: "transparent",
      stroke: untrack_settings.colors[0],
      strokeWidth: untrack_settings.strokeWidth,
      erasable: true,
    });

    c.on("mouse:down", (evt) => {
      initialPoint.x = evt.scenePoint.x;
      initialPoint.y = evt.scenePoint.y;
    });

    c.on("path:created", (evt) => {
      evt.path.objectId = window.crypto.randomUUID();
      evt.path.erasable = true;

      if (untrack_settings.tool === "brush") {
        pushCommand(new AddCommand(c, evt.path));
      }
    });

    c.on("mouse:down", () => {
      if (untrack_settings.tool === "shape") {
        switch (untrack_settings.variant) {
          case "circle":
            previewObject = new Circle(initialShapeProps());
            break;

          case "rectangle":
            previewObject = new Rect(initialShapeProps());
            break;
        }

        previewObject.objectId = window.crypto.randomUUID();
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
        const command = new AddCommand(c, previewObject);
        pushCommand(command);

        c.remove(previewObject);
        previewObject = undefined;
        command.execute();
      }
    });

    c.on("object:moving", () => {
      shouldPushModifyCommand = true;
    });

    c.on("object:scaling", () => {
      shouldPushModifyCommand = true;
    });

    c.on("object:rotating", () => {
      shouldPushModifyCommand = true;
    });

    c.on("object:skewing", () => {
      shouldPushModifyCommand = true;
    });

    c.on("object:modified", (evt) => {
      if (!evt.transform) return;

      if (!shouldPushModifyCommand) return;
      shouldPushModifyCommand = false;

      pushCommand(new ModifyCommand(c, evt.transform));
    });

    createEffect(() => {
      const isSelecting = settings.tool === "select";

      c.selection = isSelecting;
      c.skipTargetFind = !isSelecting;
    });

    createEffect(() => {
      const isFreeDrawing =
        settings.tool === "brush" || settings.tool === "eraser";
      c.isDrawingMode = isFreeDrawing;

      if (!isFreeDrawing) c.freeDrawingBrush = undefined;
    });

    createEffect(() => {
      if (settings.tool === "brush") {
        switch (settings.variant) {
          case "plain":
            c.freeDrawingBrush = new PencilBrush(c);
            break;

          case "pressure":
            c.freeDrawingBrush = new PSBrush(c);
            break;
        }

        c.freeDrawingBrush.width = settings.strokeWidth;
        c.freeDrawingBrush.color = settings.colors[0];
      }
    });

    createEffect(() => {
      let eraser: EraserBrush | undefined;

      if (settings.tool === "eraser") {
        const handleEraserEnd = async (e: ErasingEvent<"end">) => {
          // prevent from committing erasing to the tree
          e.preventDefault();

          pushCommand(new EraseCommand(c, e.detail));
          await eraser?.commit(e.detail);
        };

        eraser = new EraserBrush(c);

        eraser.width = settings.strokeWidth;
        eraser.on("end", handleEraserEnd);

        c.freeDrawingBrush = eraser;
      }

      onCleanup(() => {
        eraser?.dispose();
      });
    });

    onCleanup(handleReset);
  });

  const handleDelete = () => {
    const c = canvas();
    if (!c) return;

    const target = getTargetOfSelection(c);
    const command = new RemoveCommand(c, target);

    command.execute();
    pushCommand(command);
  };

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
    c.requestRenderAll();
  };

  const handleSwapColors = () => {
    setSettings((prev) => ({
      ...prev,
      colors: [prev.colors[1], prev.colors[0]],
    }));
  };

  createHotkey("Mod+Z", handleUndo);
  createHotkey("Mod+Shift+Z", handleRedo);
  createHotkey("Mod+Delete", handleReset);
  createHotkey("Delete", handleDelete);
  createHotkey("Mod+A", handleSelectAll);
  createHotkey("Mod+X", handleSwapColors);

  return (
    <div class={cn("relative h-full", props.class)} {...rest}>
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

      <ColorPanels
        settings={settings}
        setSettings={setSettings}
        containerRef={containerRef}
        defaultPosition="top-right"
        swapColors={handleSwapColors}
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
