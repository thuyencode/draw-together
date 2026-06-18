import { cva } from "class-variance-authority";
import { XIcon } from "lucide-solid";
import { Show, createSignal, mergeProps } from "solid-js";
import { cn } from "../../utils/cn";
import { Button } from "./button";
import type { JSX } from "solid-js";
import type { VariantProps } from "class-variance-authority";

const wrapperStyles = cva(
  "relative w-full max-w-4xl rounded-lg border px-5 py-4 pr-10",
  {
    variants: {
      variant: {
        success: "border-alert-success-border bg-alert-success-background",
        warning: "border-alert-warning-border bg-alert-warning-background",
        danger: "border-alert-danger-border bg-alert-danger-background",
        info: "border-alert-info-border bg-alert-info-background",
        gray: "border-alert-default-border bg-alert-default-background",
      },
    },
  },
);

const iconWrapperStyles = cva(
  "flex size-7 items-center justify-center rounded-lg [&>svg]:size-4 text-white-100",
  {
    variants: {
      variant: {
        success: "bg-alert-success-icon-background",
        warning: "bg-alert-warning-icon-background",
        danger: "bg-alert-danger-icon-background",
        info: "bg-alert-info-icon-background",
        gray: "bg-alert-default-icon-background",
      },
    },
  },
);

const titleStyles = cva("font-semibold", {
  variants: {
    variant: {
      success: "text-alert-success-title",
      warning: "text-alert-warning-title",
      danger: "text-alert-danger-title",
      info: "text-alert-info-title",
      gray: "text-alert-default-title",
    },
  },
});

const messageStyles = cva("text-sm", {
  variants: {
    variant: {
      success: "text-alert-success-description",
      warning: "text-alert-warning-description",
      danger: "text-alert-danger-description",
      info: "text-alert-info-description",
      gray: "text-alert-default-description",
    },
  },
});

const closeButtonStyles = cva(
  "absolute top-3.5 right-3 flex items-center justify-center p-1",
  {
    variants: {
      variant: {
        success: "text-alert-success-close-icon",
        warning: "text-alert-warning-close-icon",
        danger: "text-alert-danger-close-icon",
        info: "text-alert-info-close-icon",
        gray: "text-alert-default-close-icon",
      },
    },
  },
);

const primaryButtonStyles = cva("text-white-100", {
  variants: {
    variant: {
      success:
        "bg-alert-success-button-background hover:bg-alert-success-button-hover-background",
      danger:
        "bg-alert-danger-button-background hover:bg-alert-danger-button-hover-background",
      info: "bg-alert-info-button-background hover:bg-alert-info-button-hover-background",
      warning:
        "bg-alert-warning-button-background hover:bg-alert-warning-button-hover-background",
      gray: "bg-alert-default-button-background hover:bg-alert-default-button-hover-background",
    },
  },
});

type AlertProps = VariantProps<typeof wrapperStyles> & {
  title?: string;
  message: string;
  icon?: JSX.Element;
  actions?: {
    primary?: { label: string; onClick: () => void };
    secondary?: { label: string };
  };
  open?: boolean;
  onClose?: () => void;
  class?: string | undefined;
};

function getVariant(variant: AlertProps["variant"]) {
  switch (variant) {
    case "success":
      return "success" as const;
    case "danger":
      return "danger" as const;
  }
}

export default function Alert(_props: AlertProps) {
  const props = mergeProps(
    { variant: "success" } satisfies Partial<AlertProps>,
    _props,
  );
  const isOpen = () => props.open ?? true;
  const [visible, setVisible] = createSignal(isOpen());

  const handleClose = () => {
    setVisible(false);
    props.onClose?.();
    setTimeout(() => setVisible(true), 5000);
  };

  return (
    <Show when={visible()}>
      <div class={cn(wrapperStyles({ variant: props.variant }), props.class)}>
        <button
          type="button"
          onClick={handleClose}
          class={closeButtonStyles({ variant: props.variant })}
          aria-label="Close alert"
        >
          <XIcon class="size-4" />
        </button>

        <div class="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-3.5">
          <Show when={props.icon} keyed>
            {(icon) => (
              <div class={iconWrapperStyles({ variant: props.variant })}>
                {icon}
              </div>
            )}
          </Show>

          <Show when={props.title} keyed>
            {(title) => (
              <h4 class={titleStyles({ variant: props.variant })}>{title}</h4>
            )}
          </Show>

          <p
            class={messageStyles({
              variant: props.variant,
              className: cn(props.title ? "col-span-full" : "font-medium"),
            })}
          >
            {props.message}
          </p>
        </div>

        <Show when={props.actions} keyed>
          {(actions) => (
            <div class="mt-5 flex gap-3">
              <Show when={actions.primary} keyed>
                {(primary) => (
                  <Button
                    type="button"
                    size="xs"
                    class={cn(
                      "px-4.5",
                      primaryButtonStyles({ variant: props.variant }),
                    )}
                    variant={getVariant(props.variant)}
                    onClick={primary.onClick}
                  >
                    {primary.label}
                  </Button>
                )}
              </Show>

              <Show when={actions.secondary} keyed>
                {(secondary) => (
                  <Button
                    type="button"
                    size="xs"
                    appearance="outline"
                    onClick={handleClose}
                  >
                    {secondary.label}
                  </Button>
                )}
              </Show>
            </div>
          )}
        </Show>
      </div>
    </Show>
  );
}
