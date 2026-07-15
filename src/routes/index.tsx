import { createFileRoute } from "@tanstack/solid-router";
import DrawingBoard from "~/features/drawing-board/components";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main class="h-full">
      <DrawingBoard
        options={{
          width: 600,
          height: 600,
          backgroundColor: "#fff",
        }}
      />
    </main>
  );
}
