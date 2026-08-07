import { For, Show, children, createMemo, splitProps } from "solid-js";
import type { ComponentProps, JSX } from "solid-js";
import { cn } from "~/features/shared/utils/cn";

interface FieldErrorProps extends ComponentProps<"div"> {
  children?: JSX.Element;
  errors?: Array<{ message?: string } | undefined>;
}

export function FieldError(_props: FieldErrorProps) {
  const [props, rest] = splitProps(_props, ["class", "children", "errors"]);

  const resolvedChildren = children(() => props.children);

  const content = createMemo(() => {
    const child = resolvedChildren();

    if (child) {
      return child;
    }

    const errors = props.errors;

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [...new Set(errors.map((error) => error?.message))];

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0];
    }

    return (
      <ul class="ml-4 list-disc space-y-1">
        <For each={uniqueErrors}>
          {(message) => message && <li>{message}</li>}
        </For>
      </ul>
    );
  });

  return (
    <Show when={content()}>
      <div
        role="alert"
        data-slot="field-error"
        class={cn("text-error", props.class)}
        {...rest}
      >
        {content()}
      </div>
    </Show>
  );
}
