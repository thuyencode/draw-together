import { EraserBrush } from "@erase2d/fabric";
import { createHotkey } from "@tanstack/solid-hotkeys";
import { ActiveSelection, Circle, IText, PencilBrush, Rect } from "fabric";
import { PSBrush } from "fabricjs-psbrush";
import {
  Show,
  createEffect,
  on,
  onCleanup,
  onMount,
  splitProps,
  untrack,
} from "solid-js";
import { createStore } from "solid-js/store";
import { AddCommand, ModifyCommand, RemoveCommand } from "../commands";
import { EraseCommand } from "../commands/erase-command";
import { DEFAULT_COLORS, DEFAULT_FONT_SIZE, DEFAULT_ZOOM } from "../constants";
import {
  createCanvas,
  createCanvasHistory,
  useCanvasDragAndZoom,
} from "../hooks";
import {
  getCircleFromPoints,
  getRectFromPoints,
  getSvgCursor,
  getTargetOfSelection,
} from "../utils";
import { DrawingBoardMenu } from "./menu";
import { ColorPanels, ToolsPanel } from "./panels";
import { makeIcon } from "./icons";
import type { Point, Settings } from "../types";
import type { ComponentProps } from "solid-js";
import type { CanvasOptions, FabricObject, FabricObjectProps } from "fabric";
import { useIsClient } from "~/features/shared/hooks";

interface DrawingBoardProps extends Omit<ComponentProps<"div">, "ref"> {
  options?: Partial<CanvasOptions>;
}

export default function DrawingBoard(_props: DrawingBoardProps) {
  let containerRef!: HTMLDivElement;
  let canvasContainerRef!: HTMLDivElement;
  let canvasElementRef!: HTMLCanvasElement;

  const [props, rest] = splitProps(_props, ["class", "options"]);
  const canvas = createCanvas(
    () => canvasElementRef,
    () => props.options,
  );
  const [settings, setSettings] = createStore<Settings>({
    tool: "brush",
    variant: "plain",
    strokeWidth: 5,
    colors: DEFAULT_COLORS,
    fontSize: DEFAULT_FONT_SIZE,
    fontFamily: "Roboto",
    fontWeight: "normal",
    fontStyle: "normal",
    underline: false,
    shapeFill: "outline",
    zoom: DEFAULT_ZOOM,
  });
  const { history, undone, pushCommand, handleUndo, handleRedo, handleReset } =
    createCanvasHistory(canvas);
  const isClient = useIsClient();
  const dragAndZoom = useCanvasDragAndZoom(
    canvas,
    () => canvasContainerRef,
    settings,
  );

  createEffect(function onToolChange() {
    dragAndZoom.setEnabled({
      drag: settings.tool === "drag",
      zoom: true,
    });
  });

  createEffect(function onZoomChange() {
    setSettings("zoom", dragAndZoom.zoom);
  });

  onMount(() => {
    const c = canvas();
    if (!c) return;

    // center canvas inside the container
    const containerRect = canvasContainerRef.getBoundingClientRect();
    const canvasRect = c.wrapperEl.getBoundingClientRect();
    const centerX = (containerRect.width - canvasRect.width) / 2;
    const centerY = (containerRect.height - canvasRect.height) / 2;
    c.wrapperEl.style.transform = `translate(${centerX}px, ${centerY}px) scale(1)`;

    const untrack_settings = untrack(() => settings);
    const initialPoint: Point = { x: 0, y: 0 };
    let previewObject: FabricObject | undefined;
    let shouldPushModifyCommand = false;

    const initialShapeProps = (): Partial<FabricObjectProps> => ({
      top: initialPoint.x,
      left: initialPoint.y,
      fill:
        untrack_settings.shapeFill === "outline"
          ? "transparent"
          : untrack_settings.shapeFill === "solid"
            ? untrack_settings.colors[0]
            : untrack_settings.colors[1],
      stroke: untrack_settings.colors[0],
      strokeWidth: untrack_settings.strokeWidth,
      erasable: true,
    });

    c.on("mouse:down", function setInitialPoint(evt) {
      initialPoint.x = evt.scenePoint.x;
      initialPoint.y = evt.scenePoint.y;
    });

    c.on("path:created", function finalizeFreeDrawing(evt) {
      evt.path.objectId = window.crypto.randomUUID();
      evt.path.erasable = true;

      if (untrack_settings.tool === "brush") {
        pushCommand(new AddCommand(c, evt.path));
      }
    });

    c.on("mouse:down", function setPreviewObject() {
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

      if (untrack_settings.tool === "text") {
        previewObject = new IText("", {
          left: initialPoint.x,
          top: initialPoint.y,
          fill: untrack_settings.colors[0],
          fontSize: untrack_settings.fontSize,
          fontFamily: untrack_settings.fontFamily,
          fontWeight: untrack_settings.fontWeight,
          fontStyle: untrack_settings.fontStyle,
          underline: untrack_settings.underline,
          erasable: true,
          objectId: window.crypto.randomUUID(),
        });

        c.add(previewObject);
        c.setActiveObject(previewObject);
        (previewObject as IText).enterEditing();
      }
    });

    c.on("mouse:move", function updatePreviewObject(evt) {
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

    c.on("mouse:up", function finalizePreviewObject() {
      if (untrack_settings.tool === "text") return;
      if (previewObject) {
        const command = new AddCommand(c, previewObject);
        pushCommand(command);

        c.remove(previewObject);
        previewObject = undefined;
        command.execute();
      }
    });

    c.on("text:editing:exited", function finalizeText(evt) {
      const textObject = evt.target;
      previewObject = undefined;

      if (textObject.text === "") {
        c.remove(textObject);
        c.requestRenderAll();
        return;
      }

      pushCommand(new AddCommand(c, textObject));
    });

    const setFlagForModifyCommand = () => {
      shouldPushModifyCommand = true;
    };

    c.on("object:moving", setFlagForModifyCommand);
    c.on("object:scaling", setFlagForModifyCommand);
    c.on("object:rotating", setFlagForModifyCommand);
    c.on("object:skewing", setFlagForModifyCommand);

    c.on("object:modified", function finalizedObjectModification(evt) {
      if (!evt.transform) return;
      if (!shouldPushModifyCommand) return;
      shouldPushModifyCommand = false;

      pushCommand(new ModifyCommand(c, evt.transform));
    });

    createEffect(function onSelect() {
      const isSelecting = settings.tool === "select";

      c.selection = isSelecting;
      c.skipTargetFind = !isSelecting;
    });

    createEffect(function onSetFreeDrawing() {
      const isFreeDrawing =
        settings.tool === "brush" || settings.tool === "eraser";
      c.isDrawingMode = isFreeDrawing;

      if (!isFreeDrawing) c.freeDrawingBrush = undefined;
    });

    createEffect(
      on(
        [
          () => settings.tool,
          () => settings.fontSize,
          () => settings.fontFamily,
          () => settings.fontWeight,
          () => settings.fontStyle,
          () => settings.underline,
          () => settings.colors[0],
        ],
        function onTextSettingsChange() {
          if (settings.tool !== "text") return;
          const active = c.getActiveObject();
          if (!active || !(active instanceof IText)) return;

          active.set({
            fontSize: settings.fontSize,
            fontFamily: settings.fontFamily,
            fontWeight: settings.fontWeight,
            fontStyle: settings.fontStyle,
            underline: settings.underline,
            fill: settings.colors[0],
          });
          c.requestRenderAll();
        },
      ),
    );

    createEffect(function onBrush() {
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

    createEffect(function onEraser() {
      if (settings.tool === "eraser") {
        const eraser = new EraserBrush(c);

        eraser.width = settings.strokeWidth;
        eraser.on("end", function finalizeEraser(e) {
          // prevent from committing erasing to the tree
          e.preventDefault();

          pushCommand(new EraseCommand(c, e.detail));
          eraser.commit(e.detail);
        });

        c.freeDrawingBrush = eraser;
      }
    });

    createEffect(function changeCursor() {
      const getIcon = makeIcon(
        settings.strokeWidth,
        settings.colors[0],
        settings.zoom,
      );

      switch (settings.tool) {
        case "drag":
          c.defaultCursor = "grabbing";
          break;

        case "eraser":
          c.freeDrawingCursor = getSvgCursor(
            getIcon("eraser"),
            settings.strokeWidth,
          );
          break;

        case "brush":
          c.freeDrawingCursor = getSvgCursor(
            getIcon("brush"),
            settings.strokeWidth,
          );
          break;

        case "text":
          c.defaultCursor = "text";
          break;

        default:
          c.defaultCursor = "default";
      }
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

  const handleEnterOnSelect = () => {
    const c = canvas();
    if (!c) return;

    const active = c.getActiveObject();
    if (!active || !(active instanceof IText)) return;

    setSettings((prev) => ({
      ...prev,
      tool: "text",
      variant: "text",
    }));

    active.enterEditing();
    c.requestRenderAll();
  };

  const handleSwapColors = () => {
    setSettings("colors", [settings.colors[1], settings.colors[0]]);
  };

  createHotkey("Mod+Z", handleUndo);
  createHotkey("Mod+Shift+Z", handleRedo);
  createHotkey("Mod+Delete", handleReset);
  createHotkey("Delete", handleDelete);
  createHotkey("Enter", handleEnterOnSelect);
  createHotkey("Mod+A", handleSelectAll);
  createHotkey("Mod+X", handleSwapColors);
  createHotkey("Mod+0", dragAndZoom.reset);

  return (
    <div class="flex h-full flex-col bg-neutral-600">
      <DrawingBoardMenu
        settings={settings}
        setSettings={setSettings}
        onZoomValueChange={dragAndZoom.setZoom}
        resetZoomValue={dragAndZoom.reset}
      />

      <div class="relative flex-1" {...rest} ref={containerRef}>
        <div class="absolute inset-0 overflow-hidden" ref={canvasContainerRef}>
          <Show when={!isClient()}>
            <div
              class="absolute inset-0 m-auto"
              style={{
                "background-color": props.options?.backgroundColor
                  ? props.options.backgroundColor.toString()
                  : undefined,
                width: props.options?.width
                  ? `${props.options.width}px`
                  : undefined,
                height: props.options?.height
                  ? `${props.options.height}px`
                  : undefined,
              }}
            />
          </Show>
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
      </div>
    </div>
  );
}
