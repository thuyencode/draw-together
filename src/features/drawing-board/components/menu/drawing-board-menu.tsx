import { Show } from "solid-js";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-solid";
import { ZOOM_MAX, ZOOM_MIN } from "../../constants";
import { FontInput, NumberInput, ToolButton } from "../ui";
import { ZoomResetIcon } from "../icons";
import type { UseCanvasDragAndZoomReturn } from "../../hooks";
import type { PropsWithSettings } from "../../types";

interface DrawingBoardMenuProps extends PropsWithSettings {
  onZoomValueChange: UseCanvasDragAndZoomReturn["setZoom"];
  resetZoomValue: UseCanvasDragAndZoomReturn["reset"];
}

export function DrawingBoardMenu(props: DrawingBoardMenuProps) {
  return (
    <div class="bg-base-100 border-neutral/40 flex flex-wrap gap-2 border-b p-2">
      <ZoomSettings {...props} />

      <Show
        when={props.settings.tool === "text"}
        fallback={<StrokeSettings {...props} />}
      >
        <TextSettings {...props} />
      </Show>
    </div>
  );
}

function ZoomSettings(props: DrawingBoardMenuProps) {
  return (
    <div class="join">
      <NumberInput
        class="join-item max-w-45"
        label="Zoom"
        value={Math.round(props.settings.zoom * 100)}
        onChange={(v) => props.onZoomValueChange(() => v / 100)}
        min={ZOOM_MIN * 100}
        max={ZOOM_MAX * 100}
        step="1"
        parse="float"
        unit="%"
      />
      <ToolButton class="join-item" onClick={props.resetZoomValue}>
        <span class="sr-only">Reset zoom level</span>
        <ZoomResetIcon />
      </ToolButton>
    </div>
  );
}

function StrokeSettings(props: PropsWithSettings) {
  return (
    <NumberInput
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
        label="Font size"
        value={props.settings.fontSize}
        onChange={(v) => props.setSettings("fontSize", v)}
        min="1"
        step="1"
        unit="px"
      />

      <div class="join">
        <ToolButton
          class="join-item rounded-sm"
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
          class="join-item rounded-sm"
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
          class="join-item rounded-sm"
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

      <FontInput
        value={props.settings.fontFamily}
        onChange={(v) => props.setSettings("fontFamily", v)}
        fontWeight={props.settings.fontWeight}
        fontStyle={props.settings.fontStyle}
        underline={props.settings.underline}
      />
    </>
  );
}
