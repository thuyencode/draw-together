import { ActiveSelection, util } from "fabric";
import type {
  Canvas,
  FabricObject,
  SerializedGroupProps,
  SerializedObjectProps,
} from "fabric";
import type { Command } from ".";

// Waiting for https://github.com/fabricjs/fabric.js/issues/11016 to be solved

export class RemoveCommand implements Command {
  private objectDataList: SerializedObjectProps[];
  private selectionData: SerializedGroupProps | undefined;

  constructor(
    private canvas: Canvas,
    target: FabricObject[] | ActiveSelection,
  ) {
    if (target instanceof ActiveSelection) {
      this.selectionData = target.toDatalessObject();
      this.objectDataList = target
        .getObjects()
        .map((o) => o.toDatalessObject());
    } else {
      this.objectDataList = target.map((o) => o.toObject());
    }
  }

  async undo() {
    if (this.selectionData) {
      const [restored]: ActiveSelection[] = await util.enlivenObjects([
        this.selectionData,
      ]);

      /*
       * Override the `onDeselect` method to fix a damm weird behavior
       * After deserializing an ActiveSelection, you click outside of it
       * and then click on it again. Guess what, it is still there although
       * it's empty. Biscuit!
       */
      restored.onDeselect = () => {
        restored.forEachObject((o) => {
          /*
           * Must add each object to back canvas or else they will disappear
           * once you click outside of their ActiveSelection instance
           */
          this.canvas.add(o);
        });

        restored.removeAll();
        this.canvas.remove(restored);
        return false;
      };

      this.canvas.add(restored);
      this.canvas.setActiveObject(restored);
    } else {
      const restored: FabricObject[] = await util.enlivenObjects(
        this.objectDataList,
      );

      this.canvas.add(...restored);
    }

    this.canvas.requestRenderAll();
  }

  execute() {
    this.canvas.discardActiveObject();

    const objectIds = this.objectDataList.map((o) => o.objectId);
    const targets = this.canvas
      .getObjects()
      .filter((o) => objectIds.includes(o.objectId));

    this.canvas.remove(...targets);
    this.canvas.requestRenderAll();
  }
}
