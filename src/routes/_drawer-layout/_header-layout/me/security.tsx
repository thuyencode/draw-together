import { createFileRoute } from "@tanstack/solid-router";
import { SessionList } from "~/features/account/components";
import { PasswordChangingForm } from "~/features/auth/forms";
import { createSessionListQueryOptions } from "~/features/auth/queries";
import { createUserLocaleQueryOptions } from "~/features/shared/queries";

export const Route = createFileRoute(
  "/_drawer-layout/_header-layout/me/security",
)({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(createSessionListQueryOptions()),
      queryClient.ensureQueryData(createUserLocaleQueryOptions()),
    ]);
  },
  component: AccountSecurityPage,
});

function AccountSecurityPage() {
  return (
    <section class="max-w-6xl grid-cols-5 gap-10 max-md:space-y-5 md:grid">
      <PasswordChangingForm class="col-span-2" />
      <SessionList class="col-span-3" />
    </section>
  );
}
