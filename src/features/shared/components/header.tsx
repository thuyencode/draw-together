import { NavBar } from "./nav-bar";

export function Header() {
  return (
    <header class="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-5xl px-4">
      <NavBar />
    </header>
  );
}
