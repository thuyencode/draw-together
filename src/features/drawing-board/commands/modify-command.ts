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
  private objectDataList: SerializedObjectProps[];
  private selectionData: SerializedGroupProps | undefined;

  constructor(
    private canvas: Canvas,
    target: FabricObject | ActiveSelection,
    private transformOriginal: Transform["original"] | undefined,
  ) {
    if (target instanceof ActiveSelection) {
      this.selectionData = target.toDatalessObject();
      this.objectDataList = target
        .getObjects()
        .map((o) => o.toDatalessObject());
    } else {
      this.objectDataList = [target.toDatalessObject()];
    }
  }

  async undo() {
    this._removeExistingObjects();

    const restored = await this._restoreObjects();

    if (this.transformOriginal) {
      const matrix = util.composeMatrix({
        scaleX: this.transformOriginal.scaleX,
        scaleY: this.transformOriginal.scaleY,
        skewX: this.transformOriginal.skewX,
        skewY: this.transformOriginal.skewY,
        angle: this.transformOriginal.angle,
        translateX: this.transformOriginal.left,
        translateY: this.transformOriginal.top,
      });
      util.applyTransformToObject(restored, matrix);
    }

    this.canvas.add(restored);
    this.canvas.setActiveObject(restored);
    this.canvas.requestRenderAll();
  }

  async execute() {
    this._removeExistingObjects();

    const restored = await this._restoreObjects();

    this.canvas.add(restored);
    this.canvas.setActiveObject(restored);
    this.canvas.requestRenderAll();
  }

  private _removeExistingObjects() {
    this.canvas.discardActiveObject();

    const objectIds = this.objectDataList.map((o) => o.objectId);
    const targets = this.canvas
      .getObjects()
      .filter((o) => objectIds.includes(o.objectId));

    this.canvas.remove(...targets);
  }

  private async _restoreObjects() {
    const [restored] = await util.enlivenObjects(
      this.selectionData ? [this.selectionData] : this.objectDataList,
    );

    if (restored instanceof ActiveSelection) {
      restored.onDeselect = () => {
        restored.forEachObject((o) => {
          this.canvas.add(o);
        });

        restored.removeAll();
        this.canvas.remove(restored);
        return false;
      };
    }

    return restored as FabricObject | ActiveSelection;
  }
}
