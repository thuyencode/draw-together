import type { ValidComponent } from "solid-js";

export type PropsWithAs<T extends ValidComponent, P = unknown> = P & {
  as?: T;
};
