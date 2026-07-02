import { FloatingPanel as BaseFloatingPanel } from "@ark-ui/solid/floating-panel";
import { splitProps } from "solid-js";
import { isServer } from "solid-js/web";
import { cn } from "../../utils/cn";

interface FloatingPanelPositionerProps
  extends BaseFloatingPanel.PositionerProps {
  ssrStyle?: BaseFloatingPanel.PositionerProps["style"];
}

function FloatingPanelPositioner(_props: FloatingPanelPositionerProps) {
  const [props, rest] = splitProps(_props, ["class", "ssrStyle", "style"]);

  return (
    <BaseFloatingPanel.Positioner
      class={cn("z-50", props.class)}
      style={isServer ? props.ssrStyle : props.style}
      {...rest}
    />
  );
}

function FloatingPanelContent(_props: BaseFloatingPanel.ContentProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <BaseFloatingPanel.Content
      class={cn(
        "bg-base-100 border-neutral/40 flex w-full flex-col rounded-lg border shadow-lg outline-none data-behind:opacity-90 data-topmost:z-9999",
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
        "group bg-base-200 border-neutral/40 flex cursor-grab items-center gap-1 rounded-t-lg border-b px-4 py-2 active:cursor-grabbing",
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
        "flex items-center gap-1 text-center text-sm font-medium group-data-vertical:flex-col [&_svg]:size-4 group-data-vertical:[&_svg]:rotate-90",
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
        "flex items-center gap-0.5 group-data-vertical:flex-col",
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
        "flex flex-1 flex-col gap-0.5 overflow-auto p-1 text-sm",
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
      class={cn("btn btn-xs btn-ghost btn-square [&_svg]:size-4", props.class)}
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
      class={cn("btn btn-xs btn-ghost btn-square [&_svg]:size-4", props.class)}
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
