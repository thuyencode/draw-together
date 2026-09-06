import {
  createContext,
  createUniqueId,
  onMount,
  splitProps,
  untrack,
  useContext,
} from "solid-js";
import { createHotkey } from "@tanstack/solid-hotkeys";
import { Dynamic, Portal } from "solid-js/web";
import { cn } from "../../utils/cn";
import type { PropsWithAs } from "../../types/props";
import type { RegisterableHotkey } from "@tanstack/solid-hotkeys";
import type {
  ComponentProps,
  JSX,
  ParentProps,
  ValidComponent,
} from "solid-js";
import { m } from "~/paraglide/messages";

export interface ModalContextValue {
  id: string;
  openModal: () => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export interface ModalProviderProps
  extends ParentProps, Pick<Partial<ModalContextValue>, "id"> {
  hotkey?: RegisterableHotkey;
  ref?: (value: ModalContextValue) => void;
  defaultOpen?: boolean;
}

function ModalProvider(props: ModalProviderProps) {
  const defaultId = untrack(() => props.id);
  const hotkey = untrack(() => props.hotkey);

  const id = defaultId ?? createUniqueId();
  const modal = () => document.getElementById(id) as HTMLDialogElement | null;

  const toggleModal = (action: "open" | "close") => {
    const currentModal = modal();

    if (currentModal) {
      if (action === "open") {
        currentModal.showModal();
      } else {
        currentModal.close();
      }
    } else {
      console.warn(`Dialog element with id "${id}" not found`);
    }
  };

  const openModal = () => toggleModal("open");
  const closeModal = () => toggleModal("close");

  hotkey &&
    createHotkey(hotkey, () => {
      toggleModal(modal()?.open ? "close" : "open");
    });

  onMount(() => {
    props.ref?.({
      id,
      openModal,
      closeModal,
    });
  });

  onMount(() => {
    if (props.defaultOpen) {
      openModal();
    }
  });

  return (
    <ModalContext.Provider value={{ id, openModal, closeModal }}>
      {props.children}
    </ModalContext.Provider>
  );
}

export type ModalRootProps = Omit<ComponentProps<"dialog">, "id">;

function ModalRoot(_props: ModalRootProps) {
  const [props, rest] = splitProps(_props, ["class"]);
  const modal = useModal();

  return (
    <Portal>
      <dialog id={modal.id} class={cn("modal", props.class)} {...rest} />
    </Portal>
  );
}

type BaseModalTriggerProps<T extends ValidComponent> = PropsWithAs<
  T,
  {
    class?: string;
    onClick?: JSX.EventHandlerUnion<T, MouseEvent>;
  }
>;

export type ModalTriggerProps<T extends ValidComponent> =
  BaseModalTriggerProps<T> &
    Omit<ComponentProps<T>, keyof BaseModalTriggerProps<T>>;

function ModalTrigger<T extends ValidComponent = "button">(
  _props: ModalTriggerProps<T>,
) {
  const [props, rest] = splitProps(_props, ["as", "class", "onClick"]);
  const modal = useModal();

  return (
    <Dynamic
      component={props.as ?? "button"}
      class={cn("btn", props.class)}
      // @ts-ignore - `e` is not any
      onClick={(e) => {
        modal.openModal();

        if (props.onClick) {
          if (typeof props.onClick === "function") {
            props.onClick(e);
          } else {
            const data = props.onClick[1];
            const handler = props.onClick[0];
            handler(data, e);
          }
        }
      }}
      {...rest}
    />
  );
}

export type ModalBoxProps = ComponentProps<"div">;

function ModalBox(_props: ModalBoxProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return <div class={cn("modal-box", props.class)} {...rest} />;
}

export type ModalActionProps = ComponentProps<"div">;

function ModalAction(_props: ComponentProps<"div">) {
  const [props, rest] = splitProps(_props, ["class"]);

  return <div class={cn("modal-action", props.class)} {...rest} />;
}

export type ModalCloserProps = ComponentProps<"button">;

function ModalCloser(_props: ModalCloserProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <form method="dialog">
      <button class={cn("btn", props.class)} {...rest} />
    </form>
  );
}

export type ModalBackdropProps = ComponentProps<"form">;

function ModalBackdrop(_props: ModalBackdropProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <form method="dialog" class={cn("modal-backdrop", props.class)} {...rest}>
      <button>{m.modal_close()}</button>
    </form>
  );
}

function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within a Modal.Provider");
  }

  return context;
}

export const Modal = {
  Provider: ModalProvider,
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Box: ModalBox,
  Action: ModalAction,
  Closer: ModalCloser,
  Backdrop: ModalBackdrop,
  useModal,
};
