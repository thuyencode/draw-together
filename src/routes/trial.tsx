import { Link, createFileRoute } from "@tanstack/solid-router";
import { HouseIcon } from "lucide-solid";
import { splitProps } from "solid-js";
import * as v from "valibot";
import type { ErrorComponentProps } from "@tanstack/solid-router";
import DrawingBoard from "~/features/drawing-board/components";
import { NewDrawingOptionsSchema } from "~/features/drawing-board/schema";
import { ErrorComponent } from "~/features/shared/components";
import { m } from "~/paraglide/messages";

export const Route = createFileRoute("/trial")({
  validateSearch: NewDrawingOptionsSchema,
  component: TrialPage,
  errorComponent: TrialPageErrorComponent,
});

function TrialPage() {
  const search = Route.useSearch();

  return (
    <main class="h-full">
      <DrawingBoard
        options={{
          ...search(),
          backgroundColor: "#fff",
        }}
      />
    </main>
  );
}

function TrialPageErrorComponent(_props: ErrorComponentProps) {
  const [props, rest] = splitProps(_props, ["error"]);

  const error = () => {
    try {
      const valiError = new v.ValiError(JSON.parse(props.error.message));

      return v.isValiError(valiError)
        ? new Error(v.summarize(valiError.issues))
        : props.error;
    } catch {
      return props.error;
    }
  };

  return (
    <main class="flex h-full flex-col items-center justify-center gap-5">
      <ErrorComponent {...rest} error={error()} />

      <Link to="/" class="btn btn-outline btn-secondary">
        <HouseIcon class="size-5" />
        {m.menu_goToHomepage()}
      </Link>
    </main>
  );
}
