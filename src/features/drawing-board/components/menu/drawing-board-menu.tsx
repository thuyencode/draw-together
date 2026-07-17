import { ZOOM_MAX, ZOOM_MIN } from "../../constants";
import { ToolButton } from "../ui";
import { ZoomResetIcon } from "../icons";
import type { UseCanvasDragAndZoomReturn } from "../../hooks";
import type { PropsWithSettings } from "../../types";

interface DrawingBoardMenuProps extends PropsWithSettings {
  onZoomValueChange: UseCanvasDragAndZoomReturn["setZoom"];
  resetZoomValue: UseCanvasDragAndZoomReturn["reset"];
}

export function DrawingBoardMenu(props: DrawingBoardMenuProps) {
  return (
    <ul class="menu lg:menu-horizontal bg-base-100 w-full gap-2">
      <label class="input input-sm max-w-50">
        <span class="label">Stroke size</span>
        <input
          type="number"
          min="1"
          step="1"
          value={props.settings.strokeWidth}
          onChange={(e) => {
            const parsed = Number.parseInt(e.target.value, 10);
            props.setSettings("strokeWidth", (prev) =>
              Number.isNaN(parsed) ? prev : parsed,
            );
          }}
        />
        <span class="badge badge-xs badge-soft">px</span>
      </label>

      <div class="join">
        <label class="input input-sm join-item max-w-45">
          <span class="label">Zoom</span>
          <input
            type="number"
            min={ZOOM_MIN * 100}
            max={ZOOM_MAX * 100}
            step="1"
            value={Math.round(props.settings.zoom * 100)}
            onChange={(e) => {
              const parsed = Number.parseFloat(e.target.value);
              props.onZoomValueChange((prev) =>
                Number.isNaN(parsed) ? prev : parsed / 100,
              );
            }}
          />
          <span class="badge badge-xs badge-soft">%</span>
        </label>
        <ToolButton class="join-item" onClick={props.resetZoomValue}>
          <span class="sr-only">Reset zoom level</span>
          <ZoomResetIcon />
        </ToolButton>
      </div>
    </ul>
  );
}
