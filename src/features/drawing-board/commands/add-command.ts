import { util } from "fabric";
import type { Canvas, FabricObject, SerializedObjectProps } from "fabric";
import type { Command } from ".";

export class AddCommand implements Command {
  private objectData: SerializedObjectProps;

  constructor(
    private canvas: Canvas,
    object: FabricObject,
  ) {
    this.objectData = object.toDatalessObject();
  }

  undo() {
    this.canvas.discardActiveObject();

    const targets = this.canvas
      .getObjects()
      .filter((o) => o.objectId === this.objectData.objectId);

    if (targets.length > 0) {
      this.canvas.remove(targets[0]);
      this.canvas.requestRenderAll();
    }
  }

  async execute() {
    this.canvas.discardActiveObject();

    const objects = await util.enlivenObjects([this.objectData]);
    const restored = objects[0] as FabricObject;
    this.canvas.add(restored);
    this.canvas.requestRenderAll();
  }
}
