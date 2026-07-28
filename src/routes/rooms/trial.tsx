import { createFileRoute } from "@tanstack/solid-router";
import DrawingBoard from "~/features/drawing-board/components";
import { NewDrawingOptionsSchema } from "~/features/drawing-board/schema";

export const Route = createFileRoute("/rooms/trial")({
  validateSearch: NewDrawingOptionsSchema,
  component: TrialPage,
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
