import { Show } from "solid-js";
import { HouseIcon, UserRoundArrowLeftIcon } from "lucide-solid";
import { NavLink } from "./ui";
import { authClient } from "~/integrations/better-auth/client";
import { m } from "~/paraglide/messages";

export function NavBar() {
  const session = authClient.useSession();
  const isAuthed = () => !!session().data;

  return (
    <nav class="flex items-center gap-1 max-sm:hidden">
      <NavLink to="/">
        <HouseIcon /> {m.nav_home()}
      </NavLink>

      <Show when={!isAuthed()}>
        <div class="indicator">
          <div class="indicator-item inline-grid *:[grid-area:1/1]">
            <div class="status status-secondary animate-ping" />
            <div class="status status-secondary" />
          </div>
          <NavLink to="/auth/login">
            <UserRoundArrowLeftIcon /> {m.auth_logIn()}
          </NavLink>
        </div>
      </Show>
    </nav>
  );
}
