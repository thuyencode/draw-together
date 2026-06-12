import type { FloatingPanelHeaderProps as BaseFloatingPanelHeaderProps } from "@ark-ui/solid";
import { FloatingPanel as BaseFloatingPanel } from "@ark-ui/solid";
import { splitProps } from "solid-js";
import { cn } from "../../utils/cn";
import type { ButtonProps } from "./button";
import { Button } from "./button";

export const FloatingPanel = BaseFloatingPanel.Root;

type FloatingPanelTrigger = Omit<
  ButtonProps<typeof BaseFloatingPanel.Trigger>,
  "as"
>;

export const FloatingPanelTrigger: typeof BaseFloatingPanel.Trigger = (
  props,
) => {
  return (
    <Button as={BaseFloatingPanel.Trigger} appearance="outline" {...props} />
  );
};

export const FloatingPanelPositioner: typeof BaseFloatingPanel.Positioner = (
  _props,
) => {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseFloatingPanel.Positioner class={cn("z-50", props.class)} {...rest} />
  );
};

export const FloatingPanelContent: typeof BaseFloatingPanel.Content = (
  _props,
) => {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseFloatingPanel.Content
      class={cn(
        "bg-background-50 rounded-lg border border-alert-default-border w-full shadow-lg flex flex-col outline-none data-topmost:z-999999 data-behind:opacity-40",
        props.class,
      )}
      {...rest}
    />
  );
};

type FloatingPanelHeaderProps = BaseFloatingPanelHeaderProps & {
  vertical?: boolean;
};

export const FloatingPanelHeader = (_props: FloatingPanelHeaderProps) => {
  const [props, rest] = splitProps(_props, ["class", "vertical"]);

  return (
    <BaseFloatingPanel.Header
      data-vertical={props.vertical ? "" : undefined}
      class={cn(
        "group py-2 px-4 bg-alert-default-background border-b border-alert-default-border flex items-center rounded-t-lg cursor-grab active:cursor-grabbing gap-1",
        props.vertical ? "flex-col" : "justify-between",
        props.class,
      )}
      {...rest}
    />
  );
};

export const FloatingPanelTitle: typeof BaseFloatingPanel.Title = (_props) => {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseFloatingPanel.Title
      class={cn(
        "font-medium text-sm text-alert-default-title flex items-center gap-1 [&_svg]:size-4 [&_svg]:text-alert-default-close-icon group-data-vertical:flex-col text-center group-data-vertical:[&_svg]:rotate-90",
        props.class,
      )}
      {...rest}
    />
  );
};

export const FloatingPanelControl: typeof BaseFloatingPanel.Control = (
  _props,
) => {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseFloatingPanel.Control
      class={cn(
        "flex items-center gap-1 group-data-vertical:flex-col",
        props.class,
      )}
      {...rest}
    />
  );
};

export const FloatingPanelBody: typeof BaseFloatingPanel.Body = (_props) => {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseFloatingPanel.Body
      class={cn(
        "flex flex-col p-1 gap-1 overflow-auto flex-1 text-sm text-alert-default-description bg-background-50",
        props.class,
      )}
      {...rest}
    />
  );
};

export const FloatingPanelResizeTrigger: typeof BaseFloatingPanel.ResizeTrigger =
  (_props) => {
    const [props, rest] = splitProps(_props, ["class"]);

    return (
      <BaseFloatingPanel.ResizeTrigger
        class={cn(
          "data-[axis='n']:h-1.5 data-[axis='s']:h-1.5 data-[axis='n']:max-w-[90%] data-[axis='s']:max-w-[90%] data-[axis='e']:w-1.5 data-[axis='w']:w-1.5 data-[axis='e']:max-h-[90%] data-[axis='w']:max-h-[90%] data-[axis='ne']:size-2.5 data-[axis='nw']:size-2.5 data-[axis='se']:size-2.5 data-[axis='sw']:size-2.5",
          props.class,
        )}
        {...rest}
      />
    );
  };

export const FloatingPanelCloseTrigger: typeof BaseFloatingPanel.CloseTrigger =
  (_props) => {
    const [props, rest] = splitProps(_props, ["class"]);

    return (
      <BaseFloatingPanel.CloseTrigger
        class={cn(
          "size-6 inline-flex items-center justify-center p-0 border border-alert-default-border rounded bg-alert-default-background text-alert-default-close-icon hover:bg-alert-default-icon-background [&_svg]:size-3.5 hover:text-pricing-icon-background",
          props.class,
        )}
        {...rest}
      />
    );
  };

export const FloatingPanelDragTrigger: typeof BaseFloatingPanel.DragTrigger = (
  _props,
) => {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseFloatingPanel.DragTrigger
      class={cn("cursor-grab active:cursor-grabbing", props.class)}
      {...rest}
    />
  );
};

export const FloatingPanelStageTrigger: typeof BaseFloatingPanel.StageTrigger =
  (_props) => {
    const [props, rest] = splitProps(_props, ["class"]);

    return (
      <BaseFloatingPanel.StageTrigger
        class={cn(
          "size-6 inline-flex items-center justify-center p-0 border border-alert-default-border rounded bg-alert-default-background text-alert-default-close-icon hover:bg-alert-default-icon-background [&_svg]:size-3.5  hover:text-background-50",
          props.class,
        )}
        {...rest}
      />
    );
  };
