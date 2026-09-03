import { mutationOptions } from "@tanstack/solid-query";
import { useNavigate } from "@tanstack/solid-router";
import { sleep } from "../shared/utils";
import {
  createSessionListQueryOptions,
  createSessionQueryOptions,
} from "./queries";
import type { LoginForm, PasswordChangingForm, SignUpForm } from "./types";
import type { Session } from "better-auth";
import type { AnyFormApi } from "@tanstack/solid-form";
import { toaster } from "~/integrations/ark-ui/toast";
import { authClient } from "~/integrations/better-auth/client";
import { m } from "~/paraglide/messages";

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
    onSettled: (_, __, ___, result, ctx) => {
      if (result) {
        ctx.client.invalidateQueries(result.queryOptions);
      }
    },
  });

export const createSignOutMutationOptions = () =>
  mutationOptions({
    mutationFn: () => authClient.signOut(),
    onMutate: (_, ctx) => {
      ctx.client.setQueryData(createSessionQueryOptions().queryKey, null);
      ctx.client.cancelQueries();
    },
  });

export const createLoginMutationOptions = () => {
  const navigate = useNavigate();

  return mutationOptions({
    mutationFn: async (variables: LoginForm) => {
      const { error } = await authClient.signIn.email(variables);
      if (error) throw error;
    },
    onSuccess: (_, __, ___, ctx) => {
      toaster.promise(
        async () => {
          await ctx.client.invalidateQueries(createSessionQueryOptions());
          const urlParams = new URLSearchParams(window.location.search);
          await navigate({ to: urlParams.get("redirect") ?? "/" });
        },
        { loading: { title: "Please wait..." } },
      );
    },
  });
};

export const createSignUpMutationOptions = () => {
  const navigate = useNavigate();

  return mutationOptions({
    mutationFn: async (variables: SignUpForm) => {
      const { error } = await authClient.signUp.email(variables);
      if (error) throw error;
    },
    onSuccess: (_, __, ___, ctx) => {
      toaster.promise(
        async () => {
          await ctx.client.invalidateQueries(createSessionQueryOptions());
          const urlParams = new URLSearchParams(window.location.search);
          await navigate({ to: urlParams.get("redirect") ?? "/" });
        },
        { loading: { title: "Please wait..." } },
      );
    },
  });
};

export const createPasswordChangingMutationOptions = (form: AnyFormApi) =>
  mutationOptions({
    mutationFn: async (variables: PasswordChangingForm) => {
      if (import.meta.env.MODE === "development") {
        await sleep(2000);
      }

      const { error } = await authClient.changePassword(variables);
      if (error) throw error;
    },
    onSuccess: (_, __, ___, ctx) => {
      form.reset();
      toaster.success({ title: m.passwd_security_passwdChanged() });
      ctx.client.invalidateQueries(createSessionListQueryOptions());
    },
  });
