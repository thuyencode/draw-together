import { createFileRoute } from "@tanstack/solid-router";
import DrawingBoard from "~/features/drawing-board/components";
import { NewDrawingOptionsSchema } from "~/features/drawing-board/schema";

export const Route = createFileRoute("/rooms")({
  validateSearch: NewDrawingOptionsSchema,
  component: RoomPage,
});

function RoomPage() {
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
