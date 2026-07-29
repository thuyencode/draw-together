import {
  createContext,
  createUniqueId,
  splitProps,
  untrack,
  useContext,
} from "solid-js";
import { createHotkey } from "@tanstack/solid-hotkeys";
import { Portal } from "solid-js/web";
import { cn } from "../../utils/cn";
import type { RegisterableHotkey } from "@tanstack/solid-hotkeys";
import type { ComponentProps, ParentProps } from "solid-js";

interface ModalContextValue {
  id: string;
  openModal: () => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

interface ModalProps extends Pick<Partial<ModalContextValue>, "id"> {
  hotkey?: RegisterableHotkey;
}

function ModalProvider(props: ParentProps<ModalProps>) {
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
      const currentModal = modal();

      if (currentModal) {
        if (currentModal.open) {
          currentModal.close();
        } else {
          currentModal.showModal();
        }
      } else {
        console.warn(`Dialog element with id "${id}" not found`);
      }
    });

  return (
    <ModalContext.Provider value={{ id, openModal, closeModal }}>
      {props.children}
    </ModalContext.Provider>
  );
}

function ModalRoot(_props: ParentProps<Omit<ComponentProps<"dialog">, "id">>) {
  const [props, rest] = splitProps(_props, ["class"]);
  const modal = useModal();

  return (
    <Portal>
      <dialog id={modal.id} class={cn("modal", props.class)} {...rest} />
    </Portal>
  );
}

function ModalTrigger(_props: ParentProps<ComponentProps<"button">>) {
  const [props, rest] = splitProps(_props, ["class", "onClick", "children"]);
  const modal = useModal();

  return (
    <button
      class={cn("btn", props.class)}
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
    >
      {props.children}
    </button>
  );
}

function ModalBox(_props: ParentProps<ComponentProps<"div">>) {
  const [props, rest] = splitProps(_props, ["class", "children"]);

  return (
    <div class={cn("modal-box", props.class)} {...rest}>
      {props.children}
    </div>
  );
}

function ModalCloser(_props: ParentProps<ComponentProps<"button">>) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <form method="dialog">
      <button class={cn("btn", props.class)} {...rest} />
    </form>
  );
}

function ModalBackdrop(_props: ParentProps<ComponentProps<"form">>) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <form method="dialog" class={cn("modal-backdrop", props.class)} {...rest}>
      <button>close</button>
    </form>
  );
}

function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within a Modal");
  }

  return context;
}

export const Modal = {
  Provider: ModalProvider,
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Box: ModalBox,
  Closer: ModalCloser,
  Backdrop: ModalBackdrop,
  useModal,
};
