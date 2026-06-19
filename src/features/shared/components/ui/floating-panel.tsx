import { FloatingPanel as BaseFloatingPanel } from "@ark-ui/solid/floating-panel";
import { splitProps } from "solid-js";
import { cn } from "../../utils/cn";

function FloatingPanelPositioner(_props: BaseFloatingPanel.PositionerProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseFloatingPanel.Positioner class={cn("z-50", props.class)} {...rest} />
  );
}

function FloatingPanelContent(_props: BaseFloatingPanel.ContentProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseFloatingPanel.Content
      class={cn(
        "bg-background-50 border-alert-default-border flex w-full flex-col rounded-lg border shadow-lg outline-none data-behind:opacity-40 data-topmost:z-999999",
        props.class,
      )}
      {...rest}
    />
  );
}

type FloatingPanelHeaderProps = BaseFloatingPanel.HeaderProps & {
  vertical?: boolean;
};

function FloatingPanelHeader(_props: FloatingPanelHeaderProps) {
  const [props, rest] = splitProps(_props, ["class", "vertical"]);

  return (
    <BaseFloatingPanel.Header
      data-vertical={props.vertical ? "" : undefined}
      class={cn(
        "group bg-alert-default-background border-alert-default-border flex cursor-grab items-center gap-1 rounded-t-lg border-b px-4 py-2 active:cursor-grabbing",
        props.vertical ? "flex-col" : "justify-between",
        props.class,
      )}
      {...rest}
    />
  );
}

function FloatingPanelTitle(_props: BaseFloatingPanel.TitleProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseFloatingPanel.Title
      class={cn(
        "text-alert-default-title [&_svg]:text-alert-default-close-icon flex items-center gap-1 text-center text-sm font-medium group-data-vertical:flex-col [&_svg]:size-4 group-data-vertical:[&_svg]:rotate-90",
        props.class,
      )}
      {...rest}
    />
  );
}

function FloatingPanelControl(_props: BaseFloatingPanel.ControlProps) {
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
}

function FloatingPanelBody(_props: BaseFloatingPanel.BodyProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseFloatingPanel.Body
      class={cn(
        "text-alert-default-description bg-background-50 flex flex-1 flex-col gap-1 overflow-auto p-1 text-sm",
        props.class,
      )}
      {...rest}
    />
  );
}

function FloatingPanelResizeTrigger(
  _props: BaseFloatingPanel.ResizeTriggerProps,
) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseFloatingPanel.ResizeTrigger
      class={cn(
        "data-[axis='e']:max-h-[90%] data-[axis='e']:w-1.5 data-[axis='n']:h-1.5 data-[axis='n']:max-w-[90%] data-[axis='ne']:size-2.5 data-[axis='nw']:size-2.5 data-[axis='s']:h-1.5 data-[axis='s']:max-w-[90%] data-[axis='se']:size-2.5 data-[axis='sw']:size-2.5 data-[axis='w']:max-h-[90%] data-[axis='w']:w-1.5",
        props.class,
      )}
      {...rest}
    />
  );
}

function FloatingPanelCloseTrigger(
  _props: BaseFloatingPanel.CloseTriggerProps,
) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseFloatingPanel.CloseTrigger
      class={cn(
        "border-alert-default-border bg-alert-default-background text-alert-default-close-icon hover:bg-alert-default-icon-background hover:text-pricing-icon-background inline-flex size-6 items-center justify-center rounded border p-0 [&_svg]:size-3.5",
        props.class,
      )}
      {...rest}
    />
  );
}

function FloatingPanelDragTrigger(_props: BaseFloatingPanel.DragTriggerProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseFloatingPanel.DragTrigger
      class={cn("cursor-grab active:cursor-grabbing", props.class)}
      {...rest}
    />
  );
}

function FloatingPanelStageTrigger(
  _props: BaseFloatingPanel.StageTriggerProps,
) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseFloatingPanel.StageTrigger
      class={cn(
        "border-alert-default-border bg-alert-default-background text-alert-default-close-icon hover:bg-alert-default-icon-background hover:text-background-50 inline-flex size-6 items-center justify-center rounded border p-0 [&_svg]:size-3.5",
        props.class,
      )}
      {...rest}
    />
  );
}

export const FloatingPanel = {
  Root: BaseFloatingPanel.Root,
  Trigger: BaseFloatingPanel.Trigger,
  Positioner: FloatingPanelPositioner,
  Content: FloatingPanelContent,
  Header: FloatingPanelHeader,
  Title: FloatingPanelTitle,
  Control: FloatingPanelControl,
  Body: FloatingPanelBody,
  ResizeTrigger: FloatingPanelResizeTrigger,
  CloseTrigger: FloatingPanelCloseTrigger,
  DragTrigger: FloatingPanelDragTrigger,
  StageTrigger: FloatingPanelStageTrigger,
};
