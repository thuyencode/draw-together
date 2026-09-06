import {
  ToastActionTrigger,
  ToastCloseTrigger,
  ToastDescription,
  ToastRoot,
  ToastTitle,
  Toaster,
} from "@ark-ui/solid/toast";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  HourglassIcon,
  InfoIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-solid";
import { Show } from "solid-js";
import { Dynamic, Portal } from "solid-js/web";
import type { LucideIcon } from "lucide-solid";
import type { ToastType } from "@ark-ui/solid/toast";
import { toaster } from "~/integrations/ark-ui/toast";

const iconMap: Record<ToastType, LucideIcon> = {
  success: CircleCheckIcon,
  error: CircleAlertIcon,
  warning: TriangleAlertIcon,
  info: InfoIcon,
  loading: HourglassIcon,
};

export function Toast() {
  return (
    <Portal>
      <Toaster toaster={toaster}>
        {(toast) => {
          const icon = () => {
            const type = toast().type;
            return type ? iconMap[type] : iconMap.info;
          };

          return (
            <ToastRoot class="alert alert-soft data-[type=success]:alert-success data-[type=error]:alert-error data-[type=warning]:alert-warning data-[type=info]:alert-info relative z-(--z-index) h-(--height) translate-x-(--x) translate-y-(--y) scale-(--scale) items-center gap-3 opacity-(--opacity) transition-all duration-400 ease-[cubic-bezier(0.21,1.02,0.73,1)] will-change-[translate,opacity,scale] sm:w-sm">
              <Dynamic
                component={icon()}
                class="size-5 data-[type=loading]:animate-spin"
                data-type={toast().type}
              />

              <div class="flex flex-col">
                <ToastTitle class="flex items-center gap-2 font-bold [&_svg]:size-4">
                  {toast().title}
                </ToastTitle>
                <ToastDescription>{toast().description}</ToastDescription>
              </div>

              <Show when={toast().action}>
                {(action) => (
                  <ToastActionTrigger
                    class="btn btn-sm data-[type=success]:btn-success data-[type=error]:btn-error data-[type=warning]:btn-warning data-[type=info]:btn-info btn-outline"
                    data-type={toast().type}
                  >
                    {action().label}
                  </ToastActionTrigger>
                )}
              </Show>

              <ToastCloseTrigger
                class="btn btn-circle btn-xs btn-ghost data-[type=success]:btn-success data-[type=error]:btn-error data-[type=warning]:btn-warning data-[type=info]:btn-info self-start"
                data-type={toast().type}
              >
                <XIcon />
              </ToastCloseTrigger>
            </ToastRoot>
          );
        }}
      </Toaster>
    </Portal>
  );
}
