import { Show, splitProps } from "solid-js";
import type { ComponentProps } from "solid-js";
import type { PropsWithErrors } from "~/features/shared/types/props";
import { cn } from "~/features/shared/utils/cn";
import { createUniqueErrorComponent } from "~/features/shared/hooks/create-unique-error-component";

type FieldErrorProps = PropsWithErrors<ComponentProps<"div">>;

export function FieldError(_props: FieldErrorProps) {
  const [props, rest] = splitProps(_props, ["class", "errors"]);
  const content = createUniqueErrorComponent(() => props.errors);

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
