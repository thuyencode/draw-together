import { createSignal, onMount } from "solid-js";

export function useIsClient() {
  const [isClient, setIsClient] = createSignal(false);

  onMount(() => {
    setIsClient(typeof document !== "undefined");
  });

  return isClient;
}
