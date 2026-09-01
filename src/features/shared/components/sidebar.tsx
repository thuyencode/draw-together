import { ChevronsLeftIcon, ChevronsRightIcon, HouseIcon } from "lucide-solid";
import { LocaleSwitcher } from "./locale-switcher";
import { Drawer, NavLink } from "./ui";
import type { LocalizedString } from "@inlang/paraglide-js";
import type { LinkProps } from "@tanstack/solid-router";
import type { LucideIcon } from "lucide-solid";
import type { ParentProps } from "solid-js";
import { m } from "~/paraglide/messages";

export interface SidebarMenuItem {
  to: LinkProps["to"];
  label: () => LocalizedString;
  Icon: LucideIcon;
}

export function Sidebar(props: ParentProps) {
  return (
    <nav class="is-drawer-close:w-14 bg-base-200 is-drawer-open:w-60 md:is-drawer-open:w-64 flex h-full flex-col">
      <ul class="menu w-full gap-1">
        <li>
          <NavLink to="/" data-tip={m.nav_home()}>
            <HouseIcon />{" "}
            <span class="is-drawer-close:hidden text-nowrap">
              {m.nav_home()}
            </span>
          </NavLink>
        </li>
      </ul>

      <div class="divider mx-0 my-1 px-2" />

      {props.children}

      <div class="divider mx-0 mt-auto mb-1 px-2" />
      <LocaleSwitcher />
      <div class="md:divider mx-0 my-1 px-2" />

      <Drawer.Trigger
        class="btn-soft btn-neutral is-drawer-close:tooltip is-drawer-close:tooltip-right flex h-9 w-full rounded-none max-md:hidden"
        data-tip={m.my_account_sidebar_collapse()}
      >
        <ChevronsLeftIcon class="is-drawer-close:hidden" />
        <ChevronsRightIcon class="is-drawer-open:hidden" />
        <span class="is-drawer-close:hidden text-nowrap">
          {m.my_account_sidebar_collapse()}
        </span>
      </Drawer.Trigger>
    </nav>
  );
}
