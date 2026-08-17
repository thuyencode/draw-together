import { Show, splitProps } from "solid-js";
import { CircleXIcon } from "lucide-solid";
import { createUniqueErrorComponent } from "../../hooks/create-unique-error-component";
import { cn } from "../../utils/cn";
import type { ComponentProps } from "solid-js";
import type { PropsWithErrors } from "../../types/props";

type FormErrorProps = PropsWithErrors<ComponentProps<"div">>;

export function FormError(_props: FormErrorProps) {
  const [props, rest] = splitProps(_props, ["class", "errors"]);
  const content = createUniqueErrorComponent(() => props.errors);

  return (
    <Show when={content()}>
      <div
        role="alert"
        data-slot="form-error"
        class={cn("alert alert-error alert-soft", props.class)}
        {...rest}
      >
        <CircleXIcon class="size-4" />
        {content()}
      </div>
    </Show>
  );
}
