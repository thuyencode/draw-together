import { Link, createFileRoute } from "@tanstack/solid-router";
import { HouseIcon } from "lucide-solid";
import { m } from "~/paraglide/messages";

export const Route = createFileRoute("/rooms/")({
  component: RoomsPage,
});

function RoomsPage() {
  return (
    <main class="flex h-full flex-col items-center justify-center gap-5">
      <h1>{m.rooms_notImplemented()}</h1>
      <h2 class="font-light">{m.rooms_sorry()}</h2>

      <Link class="btn btn-primary btn-lg" to="/">
        <HouseIcon class="size-5" /> {m.rooms_goHome()}
      </Link>
    </main>
  );
}
