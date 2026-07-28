import { Link, createFileRoute } from "@tanstack/solid-router";
import { HouseIcon } from "lucide-solid";

export const Route = createFileRoute("/rooms/")({
  component: RoomsPage,
});

function RoomsPage() {
  return (
    <main class="flex h-full flex-col items-center justify-center gap-5">
      <h1>This hasn't been implemented yet</h1>
      <h2 class="font-light">Sorry</h2>

      <Link class="btn btn-primary btn-lg" to="/">
        <HouseIcon class="size-5" /> Go home
      </Link>
    </main>
  );
}
