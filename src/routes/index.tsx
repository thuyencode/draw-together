import { createFileRoute } from "@tanstack/solid-router";
import DrawingBoard from "~/features/drawing-board/components";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <main class="h-dvh w-full">
      <DrawingBoard />
    </main>
  );
}
