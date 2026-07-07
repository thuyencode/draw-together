// https://github.com/ShaMan123/erase2d/blob/master/packages/fabric/types/fabric.d.ts

import "fabric";

declare module "fabric" {
  interface FabricObjectProps {
    objectId: string;
    erasable: boolean | "deep";
  }
  interface FabricObject extends FabricObjectProps {}
  interface SerializedObjectProps {
    objectId: string;
  }
}
