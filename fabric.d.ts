import "fabric";

declare module "fabric" {
  interface FabricObject {
    objectId: string;
  }
  interface SerializedObjectProps {
    objectId: string;
  }
}
