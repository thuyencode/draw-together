import { useMutation, useQuery } from "@tanstack/solid-query";
import { For, Match, Show, Switch, createMemo } from "solid-js";
import {
  CircleQuestionMark,
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-solid";
import { UAParser } from "ua-parser-js";
import { useRouter } from "@tanstack/solid-router";
import {
  createSessionListQueryOptions,
  createSessionQueryOptions,
} from "../../auth/queries";
import { LogOutButton } from "./log-out-button";
import type { Session } from "better-auth";
import { createUserLocaleQueryOptions } from "~/features/shared/queries";
import { cn } from "~/features/shared/utils/cn";
import { m } from "~/paraglide/messages";
import {
  createRevokeSessionMutationOptions,
  createSignOutMutationOptions,
} from "~/features/auth/mutations";

interface SessionListProps {
  class?: string;
}

export function SessionList(props: SessionListProps) {
  const currentSessionQuery = useQuery(createSessionQueryOptions);
  const sessionListQuery = useQuery(createSessionListQueryOptions);

  const otherSessionList = () =>
    sessionListQuery.data?.filter(
      (session) => session.id !== currentSessionQuery.data?.session.id,
    );

  return (
    <section class={cn("space-y-3", props.class)}>
      <h2 class="text-xl">{m.session_list_title()}</h2>

      <ul class="list">
        <li class="text-base opacity-80">
          {m.session_list_title_currentDevice()}
        </li>

        <Show when={currentSessionQuery.data}>
          {(data) => <CurrentSessionItem session={data().session} />}
        </Show>

        <li class="pt-4 text-base opacity-80">
          {m.session_list_title_otherDevices()}
        </li>

        <Show
          when={otherSessionList()?.length !== 0}
          fallback={
            <li class="pt-4 text-center text-lg">
              {m.session_list_message_noOtherSessions()}
            </li>
          }
        >
          <For each={otherSessionList()}>
            {(session) => <OtherSessionItem session={session} />}
          </For>
        </Show>
      </ul>
    </section>
  );
}

function CurrentSessionItem(props: Pick<SessionItemProps, "session">) {
  const router = useRouter();
  const signOutMutation = useMutation(createSignOutMutationOptions);

  const signOut = () => {
    signOutMutation.mutate();
    router.invalidate();
  };

  return <SessionItem session={props.session} onLogOut={signOut} />;
}

function OtherSessionItem(props: Pick<SessionItemProps, "session">) {
  const revokeSessionMutation = useMutation(() =>
    createRevokeSessionMutationOptions(props.session.token),
  );

  return (
    <SessionItem
      session={props.session}
      onLogOut={revokeSessionMutation.mutate}
    />
  );
}

interface SessionItemProps {
  session: Session;
  onLogOut: () => void;
}

function SessionItem(props: SessionItemProps) {
  const userLocaleQuery = useQuery(createUserLocaleQueryOptions);

  const sinceDate = () =>
    Intl.DateTimeFormat(userLocaleQuery.data, {
      dateStyle: "long",
    }).format(props.session.createdAt);

  const hasExpired = () => props.session.expiresAt < new Date();

  const parsedUA = createMemo(() => {
    if (!props.session.userAgent) {
      return { os: undefined, device: undefined, browser: undefined };
    }
    const { os, device, browser } = UAParser(props.session.userAgent);
    return { os, device, browser };
  });

  return (
    <li
      class="list-row items-center"
      classList={{ "opacity-40": hasExpired() }}
    >
      <Switch fallback={<CircleQuestionMark class="size-8" />}>
        <Match when={parsedUA().device?.type === "mobile"}>
          <SmartphoneIcon class="size-8" />
        </Match>
        <Match when={parsedUA().device?.type === "tablet"}>
          <TabletIcon class="size-8" />
        </Match>
        <Match when={parsedUA().device?.type === "desktop"}>
          <MonitorIcon class="size-8" />
        </Match>
      </Switch>

      <div>
        <div class="space-x-4">
          <Show when={parsedUA().os?.name} fallback={m.session_list_unknown()}>
            {(name) => name()}
          </Show>{" "}
          ∙{" "}
          <Show
            when={parsedUA().browser?.name}
            fallback={m.session_list_unknown()}
          >
            {(name) => name()}
          </Show>
        </div>
        <div class="text-xs font-semibold capitalize opacity-60">
          {m.session_list_since({ date: sinceDate() })}
        </div>
      </div>

      <LogOutButton onProceed={props.onLogOut} />
    </li>
  );
}
