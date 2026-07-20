import { createFileRoute } from "@tanstack/solid-router";
import DrawingBoard from "~/features/drawing-board/components";

export const Route = createFileRoute("/rooms")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main class="h-full">
      <DrawingBoard
        options={{
          width: 700,
          height: 700,
          backgroundColor: "#fff",
        }}
      />
    </main>
  );
}
