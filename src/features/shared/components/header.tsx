import { MenuIcon } from "lucide-solid";
import { Drawer } from "./ui";
import { NavBar } from "./nav-bar";
import { LocaleSwitcher } from "./locale-switcher";

export function Header() {
  return (
    <header class="border-base-content/30 bg-base-100 md:rounded-box fixed inset-x-0 z-10 mx-auto flex max-w-3xl justify-between border-b p-3 shadow md:top-6 md:border">
      <Drawer.Trigger class="btn-ghost btn-square sm:hidden">
        <MenuIcon />
      </Drawer.Trigger>
      <NavBar />
      <LocaleSwitcher />
    </header>
  );
}
