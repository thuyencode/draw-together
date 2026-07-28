import { Show } from "solid-js";
import { useLocation } from "@tanstack/solid-router";
import { NavBar } from "./nav-bar";

export function Header() {
  const location = useLocation();

  return (
    <Show when={!location().pathname.startsWith("/rooms/trial")}>
      <header class="border-neutral/20 bg-base-100 dark:bg-base-300 fixed inset-x-0 top-0 z-100 mx-auto w-full max-w-3xl border px-4 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-md lg:max-w-5xl">
        <NavBar />
      </header>
    </Show>
  );
}
