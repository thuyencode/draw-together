import { createToaster } from "@ark-ui/solid/toast";

export const toaster = createToaster({
  placement: "top",
  overlap: true,
  gap: 8,
  max: 5,
});
