import { BugIcon } from "lucide-solid";
import { onMount } from "solid-js";
import type { ErrorComponentProps } from "@tanstack/solid-router";
import { m } from "~/paraglide/messages";

export function ErrorComponent(props: ErrorComponentProps) {
  onMount(() => {
    console.error(props.error);
  });

  return (
    <div
      role="alert"
      class="alert alert-error alert-soft mx-auto flex max-w-sm flex-col"
    >
      <p class="inline-flex items-center gap-2 text-lg font-bold">
        <BugIcon />
        {m.error_somethingWentWrong()}
      </p>
      <p class="text-center text-base text-balance">
        {m.error_message({ message: props.error.message })}
      </p>
      <button class="btn btn-primary" onClick={() => props.reset()}>
        {m.error_tryAgain()}
      </button>
    </div>
  );
}

export const errorBoundaryFallBackProp = (error: any, reset: () => void) => (
  <ErrorComponent error={error} reset={reset} />
);
