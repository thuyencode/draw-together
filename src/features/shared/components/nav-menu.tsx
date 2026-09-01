import { For, Show } from "solid-js";
import {
  IdCardIcon,
  LockIcon,
  UserRoundArrowLeftIcon,
  UserRoundIcon,
  UserRoundPlusIcon,
} from "lucide-solid";
import { useLocation } from "@tanstack/solid-router";
import { NavLink } from "./ui";
import { AuthGuard } from "./auth-guard";
import type { SidebarMenuItem } from "./sidebar";
import { m } from "~/paraglide/messages";

export function NavMenu() {
  const location = useLocation();

  const items = () => {
    if (location().pathname.startsWith("/me")) {
      return myAccountNavMenuItems;
    }
  };

  return (
    <ul class="menu w-full gap-1">
      <Show when={!location().pathname.startsWith("/me")}>
        <li>
          <AuthGuard
            fallback={
              <NavLink
                to="/auth/login"
                class="indicator indicator-start w-full"
                data-tip={m.auth_logIn()}
              >
                <div class="indicator-item inline-grid *:[grid-area:1/1]">
                  <div class="status-primary status animate-ping" />
                  <div class="status-primary status" />
                </div>

                <UserRoundArrowLeftIcon />
                <span class="is-drawer-close:hidden text-nowrap">
                  {m.auth_logIn()}
                </span>
              </NavLink>
            }
          >
            <NavLink to="/me" data-tip={m.my_account()}>
              <UserRoundIcon />{" "}
              <span class="is-drawer-close:hidden text-nowrap">
                {m.my_account()}
              </span>
            </NavLink>
          </AuthGuard>
        </li>

        <AuthGuard
          fallback={
            <li>
              <NavLink to="/auth/sign-up" data-tip={m.auth_signUp()}>
                <UserRoundPlusIcon />
                <span class="is-drawer-close:hidden text-nowrap">
                  {m.auth_signUp()}
                </span>
              </NavLink>
            </li>
          }
        >
          {null}
        </AuthGuard>
      </Show>

      <For each={items()}>
        {(props) => (
          <li>
            <NavLink
              to={props.to}
              data-tip={props.label()}
              activeOptions={{ exact: true }}
            >
              <props.Icon />{" "}
              <span class="is-drawer-close:hidden text-nowrap">
                {props.label()}
              </span>
            </NavLink>
          </li>
        )}
      </For>
    </ul>
  );
}

const myAccountNavMenuItems: SidebarMenuItem[] = [
  {
    to: "/me",
    Icon: IdCardIcon,
    label: m.my_account_sidebar_overview,
  },
  {
    to: "/me/profile",
    Icon: UserRoundIcon,
    label: m.my_account_sidebar_profile,
  },
  {
    to: "/me/security",
    Icon: LockIcon,
    label: m.my_account_sidebar_passwd,
  },
];
