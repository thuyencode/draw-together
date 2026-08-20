import { Show } from "solid-js";
import type { ComponentProps } from "solid-js";
import { authClient } from "~/integrations/better-auth/client";

type AuthGuardProps = Omit<ComponentProps<typeof Show>, "when" | "keyed">;

export function AuthGuard(props: AuthGuardProps) {
  const session = authClient.useSession();
  const isAuthed = () => !!session().data;

  return <Show when={isAuthed()} {...props} />;
}
