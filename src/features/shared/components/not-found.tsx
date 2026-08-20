import { Link } from "@tanstack/solid-router";
import { HouseIcon } from "lucide-solid";
import { m } from "~/paraglide/messages";

export function NotFound() {
  return (
    <main class="flex min-h-screen flex-col items-center justify-center gap-4">
      <img
        class="max-w-xl"
        src="https://httpducks.com/404.jpg"
        alt={m.notFound_alt()}
      />

      <Link to="/" class="btn btn-primary btn-lg">
        <HouseIcon class="size-5" />
        {m.menu_goToHomepage()}
      </Link>
    </main>
  );
}
