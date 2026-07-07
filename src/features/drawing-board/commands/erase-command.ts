import { util } from "fabric";
import { EraserBrush } from "@erase2d/fabric";
import type { ErasingEvent } from "@erase2d/fabric";
import type {
  Canvas,
  FabricObject,
  Path,
  SerializedObjectProps,
  SerializedPathProps,
} from "fabric";
import type { Command } from ".";

export class EraseCommand implements Command {
  private objectDataList: SerializedObjectProps[];
  private clipPathData: SerializedPathProps;

  constructor(
    private canvas: Canvas,
    detail: ErasingEvent<"end">["detail"],
  ) {
    this.clipPathData = detail.path.toDatalessObject();
    this.objectDataList = detail.targets.map((o) => o.toDatalessObject());
  }

  async undo(): Promise<void> {
    this._removeExistingObjects();

    const restored = await this._restoreObjects();

    this.canvas.add(...restored);
    this.canvas.requestRenderAll();
  }

  async execute(): Promise<void> {
    this._removeExistingObjects();

    const [targets, [path]] = await Promise.all([
      this._restoreObjects(),
      util.enlivenObjects<Path>([this.clipPathData]),
    ]);

    const eraser = new EraserBrush(this.canvas);
    await eraser.commit({ path, targets });

    this.canvas.add(...targets);
    this.canvas.requestRenderAll();
  }

  private _removeExistingObjects() {
    const objectIds = this.objectDataList.map((o) => o.objectId);
    const targets = this.canvas
      .getObjects()
      .filter((o) => objectIds.includes(o.objectId));

    this.canvas.remove(...targets);
  }

  private async _restoreObjects() {
    const restored = await util.enlivenObjects<FabricObject>(
      this.objectDataList,
    );

    return restored;
  }
}
