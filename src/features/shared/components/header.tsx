import { MenuIcon } from "lucide-solid";
import { Drawer } from "./ui";

export function Header() {
  return (
    <header class="border-base-content/30 bg-base-100 flex justify-between border-b p-3 shadow">
      <Drawer.Trigger class="btn-ghost btn-square sm:hidden">
        <MenuIcon />
      </Drawer.Trigger>

      <button class="btn">Placeholder</button>
    </header>
  );
}
