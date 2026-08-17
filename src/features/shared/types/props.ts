import type { ValidComponent } from "solid-js";

export type PropsWithAs<T extends ValidComponent, P = unknown> = P & {
  as?: T;
};

export type FieldErrors =
  Array<{ message: string } | undefined> | string[] | null | undefined;

export type PropsWithErrors<P = unknown> = P & {
  errors?: FieldErrors;
};
