import { createSignal, onMount } from "solid-js";

export function useIsClient() {
  const [isClient, setIsClient] = createSignal(false);

  onMount(() => {
    setIsClient(true);
  });

  return isClient;
}
