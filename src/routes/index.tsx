import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main class="h-full">
      <h1>Draw Together</h1>
    </main>
  );
}
