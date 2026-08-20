import { HeaderContent } from "./header-content";

export function Header() {
  return (
    <header class="border-base-content/30 bg-base-100 flex justify-between border-b p-3 shadow">
      <HeaderContent />
    </header>
  );
}
