import { createMemo } from "solid-js";
import type { FieldErrors } from "../types/props";
import type { Accessor } from "solid-js";

export function createUniqueErrorMessages(errors: Accessor<FieldErrors>) {
  const messages = createMemo(() => {
    const list = errors();
    if (!list?.length) return [] as string[];

    return [
      ...new Set(
        list
          .map((error) => (typeof error === "string" ? error : error?.message))
          .filter((message): message is string => message !== undefined),
      ),
    ];
  });

  return messages;
}
