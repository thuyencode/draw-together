import { HouseIcon, UserRoundArrowLeftIcon, UserRoundIcon } from "lucide-solid";
import { NavLink } from "./ui";
import { AuthGuard } from "./auth-guard";
import { m } from "~/paraglide/messages";

export function MobileNavbar() {
  return (
    <nav class="bg-base-100 flex min-h-full w-60 flex-col gap-1 p-4 max-sm:flex">
      <NavLink class="justify-start" to="/">
        <HouseIcon /> {m.nav_home()}
      </NavLink>

      <AuthGuard
        fallback={
          <div class="indicator w-full">
            <div class="indicator-item inline-grid *:[grid-area:1/1]">
              <div class="status status-secondary animate-ping" />
              <div class="status status-secondary" />
            </div>
            <NavLink class="btn-block justify-start" to="/auth/login">
              <UserRoundArrowLeftIcon /> {m.auth_logIn()}
            </NavLink>
          </div>
        }
      >
        <NavLink class="justify-start" to="/me">
          <UserRoundIcon /> {m.my_account()}
        </NavLink>
      </AuthGuard>
    </nav>
  );
}
