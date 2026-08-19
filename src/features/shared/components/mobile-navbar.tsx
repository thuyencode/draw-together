import { Show } from "solid-js";
import { HouseIcon, UserRoundArrowLeftIcon } from "lucide-solid";
import { NavLink } from "./ui";
import { m } from "~/paraglide/messages";
import { authClient } from "~/integrations/better-auth/client";

export function MobileNavbar() {
  const session = authClient.useSession();
  const isAuthed = () => !!session().data;

  return (
    <nav class="bg-base-100 flex min-h-full w-60 flex-col gap-1 p-4 max-sm:flex">
      <NavLink class="justify-start" to="/">
        <HouseIcon /> {m.nav_home()}
      </NavLink>

      <Show when={!isAuthed()}>
        <div class="indicator w-full">
          <div class="indicator-item inline-grid *:[grid-area:1/1]">
            <div class="status status-secondary animate-ping" />
            <div class="status status-secondary" />
          </div>
          <NavLink class="w-full justify-start" to="/auth/login">
            <UserRoundArrowLeftIcon /> {m.auth_logIn()}
          </NavLink>
        </div>
      </Show>
    </nav>
  );
}
