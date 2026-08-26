import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from "@tanstack/solid-router";
import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  IdCardIcon,
  LockIcon,
  MenuIcon,
  UserRoundIcon,
} from "lucide-solid";
import { For, Suspense } from "solid-js";
import type { LocalizedString } from "@inlang/paraglide-js";
import type { LinkProps } from "@tanstack/solid-router";
import type { LucideIcon } from "lucide-solid";
import { Drawer } from "~/features/shared/components/ui";
import { m } from "~/paraglide/messages";
import { createSessionQueryOptions } from "~/features/auth/queries";

export const Route = createFileRoute("/_drawer-layout/_header-layout/me")({
  beforeLoad: async ({ context: { queryClient }, location }) => {
    const session = await queryClient.ensureQueryData(
      createSessionQueryOptions(),
    );

    if (!session) {
      throw redirect({
        to: "/auth/login",
        // Use the current location to power a redirect after login
        // (Do not use `router.state.resolvedLocation` as it can
        // potentially lag behind the actual current location)
        search: { redirect: location.href },
      });
    }
  },
  component: MyAccountLayout,
});

function MyAccountLayout() {
  return (
    <Drawer.Provider>
      <Drawer.Root class="md:drawer-open max-md:drawer-end">
        <Drawer.Content as="main" class="p-5">
          <Suspense>
            <Outlet />
          </Suspense>
        </Drawer.Content>

        <Drawer.Trigger class="btn-soft btn-circle btn-neutral is-drawer-open:z-20 fixed bottom-5 left-5 shadow md:hidden">
          <MenuIcon class="size-4" />
        </Drawer.Trigger>

        <Drawer.Side class="drawer-side is-drawer-close:overflow-visible border-base-content/30 border-r shadow md:h-[calc(100dvh-65px)]">
          <Drawer.Overlay class="md:hidden" />

          <nav class="is-drawer-close:w-14 bg-base-200 is-drawer-open:w-60 md:is-drawer-open:w-64 flex h-full flex-col">
            <ul class="menu w-full grow gap-1">
              <For each={items}>
                {(props) => (
                  <li>
                    <Link
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
        </Drawer.Side>
      </Drawer.Root>
    </Drawer.Provider>
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
