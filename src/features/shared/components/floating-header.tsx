import { HeaderContent } from "./header-content";

export function FloatingHeader() {
  return (
    <header class="border-base-content/30 bg-base-100 md:rounded-box fixed inset-x-0 z-10 mx-auto flex max-w-3xl justify-between border-b p-3 shadow md:top-6 md:border">
      <HeaderContent />
    </header>
  );
}
