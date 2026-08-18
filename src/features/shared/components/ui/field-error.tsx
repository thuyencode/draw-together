import { Show, splitProps } from "solid-js";
import type { ComponentProps } from "solid-js";
import type { PropsWithErrors } from "~/features/shared/types/props";
import { cn } from "~/features/shared/utils/cn";
import { createFormErrorComponent } from "~/features/shared/hooks/";

type FieldErrorProps = PropsWithErrors<ComponentProps<"div">>;

export function FieldError(_props: FieldErrorProps) {
  const [props, rest] = splitProps(_props, ["class", "errors"]);
  const content = createFormErrorComponent(() => props.errors);

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
