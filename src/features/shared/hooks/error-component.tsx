import { For, createMemo } from "solid-js";
import { createFormErrorMessages } from "./error-messages";
import type { FieldErrors } from "../types/props";
import type { Accessor } from "solid-js";

export function createFormErrorComponent(errors: Accessor<FieldErrors>) {
  const uniqueErrors = createFormErrorMessages(errors);

  const content = createMemo(() => {
    const errors = uniqueErrors();

    if (!errors.length) {
      return null;
    }

    if (errors.length === 1) {
      return errors[0];
    }

    return (
      <ul class="ml-4 list-disc space-y-1">
        <For each={errors}>{(message) => message && <li>{message}</li>}</For>
      </ul>
    );
  });

  return content;
}
