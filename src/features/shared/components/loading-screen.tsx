import { cn } from "../utils/cn";

interface LoadingScreenProps {
  message?: string;
  textClass?: string;
  spinnerClass?: string;
}

export function LoadingScreen(props: LoadingScreenProps) {
  return (
    <div class="flex size-full flex-col items-center justify-center gap-5">
      <p class={cn("text-secondary text-3xl font-light", props.textClass)}>
        {props.message}
      </p>
      <span
        class={cn(
          "loading loading-spinner text-secondary loading-xl",
          props.spinnerClass,
        )}
      />
    </div>
  );
}
