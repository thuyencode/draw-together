import { HouseIcon, UserRoundArrowLeftIcon } from "lucide-solid";
import { AuthGuard } from "./auth-guard";
import { NavLink } from "./ui";
import { m } from "~/paraglide/messages";

export function NavBar() {
  return (
    <nav class="flex items-center gap-1 max-sm:hidden">
      <NavLink to="/">
        <HouseIcon /> {m.nav_home()}
      </NavLink>

      <AuthGuard
        children={null}
        fallback={
          <div class="indicator">
            <div class="indicator-item inline-grid *:[grid-area:1/1]">
              <div class="status status-secondary animate-ping" />
              <div class="status status-secondary" />
            </div>
            <NavLink to="/auth/login">
              <UserRoundArrowLeftIcon /> {m.auth_logIn()}
            </NavLink>
          </div>
        }
      />
    </nav>
  );
}
