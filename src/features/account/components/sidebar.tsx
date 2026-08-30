import { Link } from "@tanstack/solid-router";
import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  IdCardIcon,
  LockIcon,
  UserRoundIcon,
} from "lucide-solid";
import { For } from "solid-js";
import type { LocalizedString } from "@inlang/paraglide-js";
import type { LinkProps } from "@tanstack/solid-router";
import type { LucideIcon } from "lucide-solid";
import { Drawer } from "~/features/shared/components/ui";
import { m } from "~/paraglide/messages";

export function MyAccountSidebar() {
  return (
    <nav class="is-drawer-close:w-14 bg-base-200 is-drawer-open:w-60 md:is-drawer-open:w-64 flex h-full flex-col">
      <ul class="menu w-full grow gap-1">
        <For each={items}>
          {(props) => (
            <li>
              <Link
                viewTransition
                to={props.to}
                class="aria-[current=page]:menu-active is-drawer-close:tooltip is-drawer-close:tooltip-right h-9 content-center [&_svg]:size-4"
                data-tip={props.label()}
                activeOptions={{ exact: true }}
              >
                <props.Icon />{" "}
                <span class="is-drawer-close:hidden text-nowrap">
                  {props.label()}
                </span>
              </Link>
            </li>
          )}
        </For>
      </ul>

      <div class="is-drawer-close:tooltip is-drawer-close:tooltip-right max-md:hidden">
        <div class="tooltip-content is-drawer-open:hidden">
          {m.my_account_sidebar_expand()}
        </div>

        <Drawer.Trigger class="btn-soft btn-neutral flex h-9 w-full rounded-none">
          <ChevronsLeftIcon class="is-drawer-close:hidden" />
          <ChevronsRightIcon class="is-drawer-open:hidden" />
          <span class="is-drawer-close:hidden text-nowrap">
            {m.my_account_sidebar_collapse()}
          </span>
        </Drawer.Trigger>
      </div>
    </nav>
  );
}

interface MyAccountSidebarItem {
  to: LinkProps["to"];
  label: () => LocalizedString;
  Icon: LucideIcon;
}

const items: MyAccountSidebarItem[] = [
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
