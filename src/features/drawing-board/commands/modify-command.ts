import { ActiveSelection, util } from "fabric";
import type {
  Canvas,
  FabricObject,
  SerializedGroupProps,
  SerializedObjectProps,
  Transform,
} from "fabric";
import type { Command } from ".";

export class ModifyCommand implements Command {
  private _objectData: SerializedObjectProps | SerializedGroupProps;
  private _transformOriginal: Transform["original"];

  constructor(
    private _canvas: Canvas,
    transform: Transform,
  ) {
    this._objectData = transform.target.toDatalessObject();
    this._transformOriginal = transform.original;
  }

  async undo() {
    this._removeExistingObjects();

    const restored = await this._restoreObjects();

    const matrix = util.composeMatrix({
      scaleX: this._transformOriginal.scaleX,
      scaleY: this._transformOriginal.scaleY,
      skewX: this._transformOriginal.skewX,
      skewY: this._transformOriginal.skewY,
      angle: this._transformOriginal.angle,
      translateX: this._transformOriginal.left,
      translateY: this._transformOriginal.top,
    });
    util.applyTransformToObject(restored, matrix);

    this._canvas.add(restored);
    this._canvas.setActiveObject(restored);
    this._canvas.requestRenderAll();
  }

  async execute() {
    this._removeExistingObjects();

    const restored = await this._restoreObjects();

    this._canvas.add(restored);
    this._canvas.setActiveObject(restored);
    this._canvas.requestRenderAll();
  }

  private _removeExistingObjects() {
    this._canvas.discardActiveObject();

    let objectIds: SerializedObjectProps["objectId"][];

    if ("objects" in this._objectData) {
      objectIds = this._objectData.objects.map((o) => o.objectId);
    } else {
      objectIds = [this._objectData.objectId];
    }

    const targets = this._canvas
      .getObjects()
      .filter((o) => objectIds.includes(o.objectId));

    this._canvas.remove(...targets);
  }

  private async _restoreObjects() {
    const [restored] = await util.enlivenObjects([this._objectData]);

    if (restored instanceof ActiveSelection) {
      restored.onDeselect = () => {
        restored.forEachObject((o) => {
          this._canvas.add(o);
        });

        restored.removeAll();
        this._canvas.remove(restored);
        return false;
      };
    }

    return restored as FabricObject | ActiveSelection;
  }
}
