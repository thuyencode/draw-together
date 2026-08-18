import { Show, splitProps } from "solid-js";
import { CircleXIcon } from "lucide-solid";
import { createFormErrorComponent } from "../../hooks";
import { cn } from "../../utils/cn";
import type { ComponentProps } from "solid-js";
import type { PropsWithErrors } from "../../types/props";

export type FormErrorProps = PropsWithErrors<ComponentProps<"div">>;

export function FormError(_props: FormErrorProps) {
  const [props, rest] = splitProps(_props, ["class", "errors"]);
  const content = createFormErrorComponent(() => props.errors);

  return (
    <Show when={content()}>
      <div
        role="alert"
        data-slot="form-error"
        class={cn("alert alert-error alert-soft my-2", props.class)}
        {...rest}
      >
        <CircleXIcon class="size-4" />
        {content()}
      </div>
    </Show>
  );
}
