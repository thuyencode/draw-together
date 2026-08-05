import { NavLink } from "./ui";
import { m } from "~/paraglide/messages";

export function NavBar() {
  return (
    <nav class="space-x-1 max-sm:hidden">
      <NavLink to="/">{m.nav_home()}</NavLink>
      <NavLink to="/rooms">{m.nav_room()}</NavLink>
      {/* @ts-expect-error */}
      <NavLink to="/404">404</NavLink>
    </nav>
  );
}
