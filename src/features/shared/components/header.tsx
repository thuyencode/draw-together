import { Show } from "solid-js";
import { useLocation } from "@tanstack/solid-router";
import { NavBar } from "./nav-bar";

export function Header() {
  const location = useLocation();

  return (
    <Show when={!location().pathname.startsWith("/rooms")}>
      <header class="border-neutral/40 bg-base-100 fixed inset-x-0 top-0 z-9999 mx-auto w-full max-w-3xl border px-4 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-5xl">
        <NavBar />
      </header>
    </Show>
  );
}
