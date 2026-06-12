import { FloatingPanel as BaseFloatingPanel } from "@ark-ui/solid";
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
        "bg-background-50 rounded-lg border border-alert-default-border w-full shadow-lg flex flex-col outline-none data-topmost:z-999999 data-behind:opacity-40",
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
        "group py-2 px-4 bg-alert-default-background border-b border-alert-default-border flex items-center rounded-t-lg cursor-grab active:cursor-grabbing gap-1",
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
        "font-medium text-sm text-alert-default-title flex items-center gap-1 [&_svg]:size-4 [&_svg]:text-alert-default-close-icon group-data-vertical:flex-col text-center group-data-vertical:[&_svg]:rotate-90",
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
        "flex flex-col p-1 gap-1 overflow-auto flex-1 text-sm text-alert-default-description bg-background-50",
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
        "data-[axis='n']:h-1.5 data-[axis='s']:h-1.5 data-[axis='n']:max-w-[90%] data-[axis='s']:max-w-[90%] data-[axis='e']:w-1.5 data-[axis='w']:w-1.5 data-[axis='e']:max-h-[90%] data-[axis='w']:max-h-[90%] data-[axis='ne']:size-2.5 data-[axis='nw']:size-2.5 data-[axis='se']:size-2.5 data-[axis='sw']:size-2.5",
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
        "size-6 inline-flex items-center justify-center p-0 border border-alert-default-border rounded bg-alert-default-background text-alert-default-close-icon hover:bg-alert-default-icon-background [&_svg]:size-3.5 hover:text-pricing-icon-background",
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
        "size-6 inline-flex items-center justify-center p-0 border border-alert-default-border rounded bg-alert-default-background text-alert-default-close-icon hover:bg-alert-default-icon-background [&_svg]:size-3.5  hover:text-background-50",
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
