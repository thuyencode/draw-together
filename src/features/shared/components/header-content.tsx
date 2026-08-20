import { MenuIcon } from "lucide-solid";
import { Drawer } from "./ui";
import { NavBar } from "./nav-bar";
import { LocaleSwitcher } from "./locale-switcher";

export function HeaderContent() {
  return (
    <>
      <Drawer.Trigger class="btn-ghost btn-square sm:hidden">
        <MenuIcon />
      </Drawer.Trigger>
      <NavBar />
      <LocaleSwitcher />
    </>
  );
}
