import { useQuery } from "@tanstack/solid-query";
import { Show } from "solid-js";
import type { ComponentProps } from "solid-js";
import { createSessionQueryOptions } from "~/features/auth/queries";

type AuthGuardProps = Omit<ComponentProps<typeof Show>, "when" | "keyed">;

export function AuthGuard(props: AuthGuardProps) {
  const session = useQuery(createSessionQueryOptions);

  return <Show when={!!session.data} {...props} />;
}
