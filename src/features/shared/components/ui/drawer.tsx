import { createHotkey } from "@tanstack/solid-hotkeys";
import {
  createContext,
  createUniqueId,
  splitProps,
  untrack,
  useContext,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { cn } from "../../utils/cn";
import type { PropsWithAs } from "../../types/props";
import type { RegisterableHotkey } from "@tanstack/solid-hotkeys";
import type { ComponentProps, ParentProps, ValidComponent } from "solid-js";
import { m } from "~/paraglide/messages";

interface DrawerContextValue {
  id: string;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

interface DrawerProps extends Pick<Partial<DrawerContextValue>, "id"> {
  hotkey?: RegisterableHotkey;
}

function DrawerProvider(props: ParentProps<DrawerProps>) {
  const defaultId = untrack(() => props.id);
  const hotkey = untrack(() => props.hotkey);

  const id = defaultId ?? createUniqueId();
  const drawerCheckbox = () =>
    document.getElementById(id) as HTMLInputElement | null;

  const toggleDrawer = (action: "open" | "close") => {
    const checkbox = drawerCheckbox();

    if (checkbox) {
      if (action === "open") {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    } else {
      console.warn(`Input element with id "${id}" not found`);
    }
  };

  const openDrawer = () => toggleDrawer("open");
  const closeDrawer = () => toggleDrawer("close");

  hotkey &&
    createHotkey(hotkey, () => {
      toggleDrawer(drawerCheckbox()?.checked ? "close" : "open");
    });

  return (
    <DrawerContext.Provider value={{ id, openDrawer, closeDrawer }}>
      {props.children}
    </DrawerContext.Provider>
  );
}

type BaseDrawerRootProps<T extends ValidComponent> = ParentProps<
  PropsWithAs<
    T,
    {
      class?: string;
    }
  >
>;

type DrawerRootProps<T extends ValidComponent> = BaseDrawerRootProps<T> &
  Omit<ComponentProps<T>, keyof BaseDrawerRootProps<T>>;

function DrawerRoot<T extends ValidComponent = "div">(
  _props: DrawerRootProps<T>,
) {
  const [props, rest] = splitProps(_props, ["as", "class", "children"]);
  const drawer = useDrawer();

  return (
    <Dynamic
      component={props.as ?? "div"}
      class={cn("drawer", props.class)}
      {...rest}
    >
      <input type="checkbox" id={drawer.id} class="drawer-toggle" />
      {props.children}
    </Dynamic>
  );
}

function DrawerTrigger(_props: ParentProps<ComponentProps<"label">>) {
  const [props, rest] = splitProps(_props, ["class"]);
  const drawer = useDrawer();

  return (
    <label
      for={drawer.id}
      class={cn("btn drawer-button", props.class)}
      {...rest}
    />
  );
}

type BaseDrawerContentProps<T extends ValidComponent> = ParentProps<
  PropsWithAs<
    T,
    {
      class?: string;
    }
  >
>;

type DrawerContentProps<T extends ValidComponent> = BaseDrawerContentProps<T> &
  Omit<ComponentProps<T>, keyof BaseDrawerContentProps<T>>;

function DrawerContent<T extends ValidComponent = "div">(
  _props: DrawerContentProps<T>,
) {
  const [props, rest] = splitProps(_props, ["as", "class"]);

  return (
    <Dynamic
      component={props.as ?? "div"}
      class={cn("drawer-content", props.class)}
      {...rest}
    />
  );
}

function DrawerSide(_props: ParentProps<ComponentProps<"div">>) {
  const [props, rest] = splitProps(_props, ["class"]);

  return <div class={cn("drawer-side", props.class)} {...rest} />;
}

function DrawerOverlay(_props: ParentProps<ComponentProps<"label">>) {
  const [props, rest] = splitProps(_props, ["class"]);
  const drawer = useDrawer();

  return (
    <label
      for={drawer.id}
      aria-label={m.drawer_closeSidebar()}
      class={cn("drawer-overlay", props.class)}
      {...rest}
    />
  );
}

function useDrawer() {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error("useDrawer must be used within a Drawer.Root");
  }

  return context;
}

export const Drawer = {
  Provider: DrawerProvider,
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Side: DrawerSide,
  Overlay: DrawerOverlay,
  useDrawer,
};
