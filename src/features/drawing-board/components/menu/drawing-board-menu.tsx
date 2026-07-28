import { Index, Show } from "solid-js";
import {
  BoldIcon,
  DownloadIcon,
  HouseIcon,
  ItalicIcon,
  SquareIcon,
  UnderlineIcon,
} from "lucide-solid";
import { Link } from "@tanstack/solid-router";
import { ZOOM_MAX } from "../../constants";
import { FontInput, NumberInput, ToolButton } from "../ui";
import { ZoomResetIcon } from "../icons";
import type { PropsWithSettings, ShapeFill, Tool } from "../../types";
import type { UseCanvasDragAndZoomReturn } from "../../hooks";

interface DrawingBoardMenuProps extends PropsWithSettings {
  onExportAsPng: () => void;
  onZoomValueChange: UseCanvasDragAndZoomReturn["setZoom"];
  resetZoomValue: UseCanvasDragAndZoomReturn["reset"];
  zoomMin: UseCanvasDragAndZoomReturn["zoomMin"];
}

const strokeRelatedTools: Tool[] = ["brush", "eraser", "shape"];

export function DrawingBoardMenu(props: DrawingBoardMenuProps) {
  return (
    <div class="bg-base-100 border-neutral/40 flex flex-wrap gap-2 border-b p-2">
      <ToolButton to="/" as={Link}>
        <HouseIcon />
        <span class="sr-only">Export as Image</span>
      </ToolButton>

      <ToolButton onClick={() => props.onExportAsPng()}>
        <DownloadIcon />
        <span class="sr-only">Export as Image</span>
      </ToolButton>

      <ZoomSettings {...props} />

      <Show when={strokeRelatedTools.includes(props.settings.tool)}>
        <StrokeSettings {...props} />
      </Show>

      <Show when={props.settings.tool === "text"}>
        <TextSettings {...props} />
      </Show>

      <Show when={props.settings.tool === "shape"}>
        <ShapeSettings {...props} />
      </Show>
    </div>
  );
}

function ZoomSettings(props: DrawingBoardMenuProps) {
  return (
    <div class="join">
      <NumberInput
        class="input-sm join-item max-w-50"
        label="Zoom"
        value={Math.round(props.settings.zoom * 100)}
        onInput={(v) => props.onZoomValueChange(() => v / 100)}
        onChange={(v) => props.onZoomValueChange(() => v / 100)}
        min={Math.round(props.zoomMin() * 100)}
        max={ZOOM_MAX * 100}
        step="1"
        parse="float"
        unit="%"
      />
      <ToolButton
        class="join-item"
        noTransparent
        onClick={props.resetZoomValue}
      >
        <span class="sr-only">Reset zoom level</span>
        <ZoomResetIcon />
      </ToolButton>
    </div>
  );
}

function StrokeSettings(props: PropsWithSettings) {
  return (
    <NumberInput
      class="input-sm max-w-50"
      label="Stroke size"
      value={props.settings.strokeWidth}
      onChange={(v) => props.setSettings("strokeWidth", v)}
      min="1"
      step="1"
      unit="px"
    />
  );
}

function TextSettings(props: PropsWithSettings) {
  return (
    <>
      <NumberInput
        class="input-sm max-w-50"
        label="Font size"
        value={props.settings.fontSize}
        onChange={(v) => props.setSettings("fontSize", v)}
        min="1"
        step="1"
        unit="px"
      />

      <FontInput
        value={props.settings.fontFamily}
        onChange={(v) => props.setSettings("fontFamily", v)}
        fontWeight={props.settings.fontWeight}
        fontStyle={props.settings.fontStyle}
        underline={props.settings.underline}
      />

      <div class="join">
        <ToolButton
          class="join-item"
          data-current-tool={props.settings.fontWeight === "bold"}
          onMouseDown={(e) => {
            e.preventDefault();
            props.setSettings(
              "fontWeight",
              props.settings.fontWeight === "bold" ? "normal" : "bold",
            );
          }}
        >
          <BoldIcon />
          <span class="sr-only">Bold</span>
        </ToolButton>

        <ToolButton
          class="join-item"
          data-current-tool={props.settings.fontStyle === "italic"}
          onMouseDown={(e) => {
            e.preventDefault();
            props.setSettings(
              "fontStyle",
              props.settings.fontStyle === "italic" ? "normal" : "italic",
            );
          }}
        >
          <ItalicIcon />
          <span class="sr-only">Italic</span>
        </ToolButton>

        <ToolButton
          class="join-item"
          data-current-tool={props.settings.underline}
          onMouseDown={(e) => {
            e.preventDefault();
            props.setSettings("underline", (p) => !p);
          }}
        >
          <UnderlineIcon />
          <span class="sr-only">Underline</span>
        </ToolButton>
      </div>
    </>
  );
}

const shapeFillOptions: { value: ShapeFill; label: string }[] = [
  { value: "outline", label: "Outline only" },
  { value: "solid", label: "Solid fill" },
  { value: "secondary", label: "Secondary fill" },
];

function ShapeSettings(props: PropsWithSettings) {
  return (
    <div class="space-x-0.5">
      <Index each={shapeFillOptions}>
        {(option) => (
          <ToolButton
            data-current-tool={props.settings.shapeFill === option().value}
            onMouseDown={(e) => {
              e.preventDefault();
              props.setSettings("shapeFill", option().value);
            }}
          >
            <SquareIcon
              classList={{
                "fill-current": option().value === "solid",
                "fill-secondary-content": option().value === "secondary",
              }}
            />
            <span class="sr-only">{option().label}</span>
          </ToolButton>
        )}
      </Index>
    </div>
  );
}
