import { NavLink } from "./ui";
import { m } from "~/paraglide/messages";

export function MobileNavbar() {
  return (
    <nav class="bg-base-100 flex min-h-full w-60 flex-col gap-1 p-4 max-sm:flex">
      <NavLink class="justify-start" to="/">
        {m.nav_home()}
      </NavLink>
      <NavLink class="justify-start" to="/rooms">
        {m.nav_room()}
      </NavLink>
      {/* @ts-expect-error */}
      <NavLink class="justify-start" to="/404">
        404
      </NavLink>
    </nav>
  );
}
