import { ZOOM_MAX, ZOOM_MIN } from "../../constants";
import type { PropsWithSettings } from "../../types";

type DrawingBoardMenuProps = PropsWithSettings;

export function DrawingBoardMenu(props: DrawingBoardMenuProps) {
  return (
    <ul class="menu lg:menu-horizontal bg-base-300 w-full gap-2">
      <label class="input input-sm max-w-50">
        <span class="label">Stroke size</span>
        <input
          type="number"
          min="1"
          step="1"
          value={props.settings.strokeWidth}
          onChange={(e) => {
            props.setSettings((prev) => ({
              ...prev,
              strokeWidth: Number.parseInt(e.target.value, 10),
            }));
          }}
        />
        <span class="badge badge-xs badge-soft">px</span>
      </label>

      <label class="input input-sm max-w-45">
        <span class="label">Zoom</span>
        <input
          type="number"
          min={ZOOM_MIN * 100}
          max={ZOOM_MAX * 100}
          step="1"
          value={Math.round(props.settings.zoom * 100)}
          onChange={(e) => {
            props.setSettings((prev) => ({
              ...prev,
              zoom: Number.parseFloat(e.target.value) / 100,
            }));
          }}
        />
        <span class="badge badge-xs badge-soft">%</span>
      </label>
    </ul>
  );
}
