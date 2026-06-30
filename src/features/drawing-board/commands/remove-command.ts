import { util } from "fabric";
import type { Canvas, FabricObject, SerializedObjectProps } from "fabric";
import type { Command } from ".";

export class RemoveCommand implements Command {
  private objectDataList: SerializedObjectProps[];

  constructor(
    private canvas: Canvas,
    objects: FabricObject[],
  ) {
    /*
     * If many objects are selected, discard them first before
     * serialized to get the correct coord values on canvas
     * Coord values are handled differently for groups
     */
    this.canvas.discardActiveObject();

    this.objectDataList = objects.map((o) => o.toDatalessObject());
  }

  async undo() {
    this.canvas.discardActiveObject();

    const objects: FabricObject[] = await util.enlivenObjects(
      this.objectDataList,
    );

    objects.forEach((t) => console.log("undo origin", t.left, t.top));

    this.canvas.add(...objects);
    this.canvas.requestRenderAll();
  }

  execute() {
    const objectIds = this.objectDataList.map((o) => o.objectId);
    const targets = this.canvas
      .getObjects()
      .filter((o) => objectIds.includes(o.objectId));

    targets.forEach((t) => console.log("execute origin", t.left, t.top));

    this.canvas.remove(...targets);
    this.canvas.requestRenderAll();
  }
}
