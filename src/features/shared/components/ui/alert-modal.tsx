import { Show, splitProps } from "solid-js";
import { cn } from "../../utils/cn";
import { Modal } from "./modal";
import type { ComponentProps, ParentProps } from "solid-js";
import type {
  ModalActionProps,
  ModalBackdropProps,
  ModalBoxProps,
  ModalCloserProps,
  ModalProviderProps,
  ModalRootProps,
  ModalTriggerProps,
} from "./modal";

function AlertModalProvider(props: ParentProps<ModalProviderProps>) {
  return <Modal.Provider {...props} />;
}

function AlertModalRoot(props: ModalRootProps) {
  return <Modal.Root {...props} />;
}

function AlertModalTrigger(props: ModalTriggerProps) {
  return <Modal.Trigger {...props} />;
}

function AlertModalBox(_props: ModalBoxProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return <Modal.Box class={cn("max-w-sm p-4", props.class)} {...rest} />;
}

function AlertModalTitle(_props: ComponentProps<"h2">) {
  const [props, rest] = splitProps(_props, ["class", "children"]);

  // (eslint jsx-a11y/heading-has-content)
  return (
    <h2 class={cn("text-lg", props.class)} {...rest}>
      {props.children}
    </h2>
  );
}

function AlertModalDescription(_props: ComponentProps<"p">) {
  const [props, rest] = splitProps(_props, ["class"]);

  return <p class={cn("mt-2", props.class)} {...rest} />;
}

function AlertModalAction(_props: ModalActionProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <Modal.Action
      class={cn(
        "bg-base-200 border-base-content/30 -mx-4 -mb-4 border-t p-4",
        props.class,
      )}
      {...rest}
    />
  );
}

function AlertModalCancel(_props: ModalCloserProps) {
  const [props, rest] = splitProps(_props, ["class", "children"]);

  return (
    <Modal.Closer class={cn("btn-sm bg-base-100", props.class)} {...rest}>
      <Show when={props.children} fallback={"Cancel"}>
        {(children) => children()}
      </Show>
    </Modal.Closer>
  );
}

function AlertModalProceed(_props: ModalCloserProps) {
  const [props, rest] = splitProps(_props, ["class", "children"]);

  return (
    <Modal.Closer class={cn("btn-sm btn-error", props.class)} {...rest}>
      <Show when={props.children} fallback={"Proceed"}>
        {(children) => children()}
      </Show>
    </Modal.Closer>
  );
}

function AlertModalBackdrop(props: ModalBackdropProps) {
  return <Modal.Backdrop {...props} />;
}

export const AlertModal = {
  Provider: AlertModalProvider,
  Root: AlertModalRoot,
  Trigger: AlertModalTrigger,
  Box: AlertModalBox,
  Title: AlertModalTitle,
  Description: AlertModalDescription,
  Action: AlertModalAction,
  Cancel: AlertModalCancel,
  Proceed: AlertModalProceed,
  Backdrop: AlertModalBackdrop,
};
