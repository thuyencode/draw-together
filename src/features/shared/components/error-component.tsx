import { BugIcon } from "lucide-solid";
import type { ErrorComponentProps } from "@tanstack/solid-router";

export function ErrorComponent(props: ErrorComponentProps) {
  return (
    <div
      role="alert"
      class="alert alert-error alert-soft mx-auto flex max-w-sm flex-col"
    >
      <p class="inline-flex items-center gap-2 text-lg font-bold">
        <BugIcon />
        Something went wrong.
      </p>
      <p class="text-center text-base text-balance">
        Error: <span class="font-mono">{props.error.message}</span>
      </p>
      <button class="btn btn-primary" onClick={() => props.reset()}>
        Try Again
      </button>
    </div>
  );
}

export const errorBoundaryFallBackProp = (error: any, reset: () => void) => (
  <ErrorComponent error={error} reset={reset} />
);
