import { mutationOptions } from "@tanstack/solid-query";
import {
  createSessionListQueryOptions,
  createSessionQueryOptions,
} from "./queries";
import type { Session } from "better-auth";
import { toaster } from "~/integrations/ark-ui/toast";
import { authClient } from "~/integrations/better-auth/client";

export const createRevokeSessionMutationOptions = (token: Session["token"]) =>
  mutationOptions({
    mutationFn: () =>
      authClient.revokeSession({ token, fetchOptions: { throw: true } }),
    onMutate: async (_, ctx) => {
      const queryOptions = createSessionListQueryOptions();
      const previousSessions = ctx.client.getQueryData(queryOptions.queryKey);

      await ctx.client.cancelQueries(queryOptions);

      ctx.client.setQueryData(queryOptions.queryKey, (prev) =>
        prev?.filter((session) => session.token !== token),
      );

      return { previousSessions, queryOptions };
    },
    onError: (err, _, result, ctx) => {
      console.error(err);
      toaster.error({ title: "Logging out failed", description: err.message });

      if (result) {
        ctx.client.setQueryData(
          result.queryOptions.queryKey,
          result.previousSessions,
        );
      }
    },
    onSettled: (_data, _error, _variables, result, ctx) => {
      if (result) {
        ctx.client.invalidateQueries(result.queryOptions);
      }
    },
  });

export const createSignOutMutationOptions = () =>
  mutationOptions({
    mutationFn: () => authClient.signOut({ fetchOptions: { throw: true } }),
    onMutate: (_, ctx) => {
      const queryOptions = createSessionQueryOptions();
      ctx.client.setQueryData(queryOptions.queryKey, null);
      ctx.client.cancelQueries();
    },
  });
