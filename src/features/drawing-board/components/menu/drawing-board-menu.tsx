import { Index, Show } from "solid-js";
import {
  BoldIcon,
  DownloadIcon,
  HouseIcon,
  ItalicIcon,
  KeyboardIcon,
  MenuIcon,
  PaletteIcon,
  SquareIcon,
  UnderlineIcon,
  WrenchIcon,
} from "lucide-solid";
import { Link } from "@tanstack/solid-router";
import { ZOOM_MAX } from "../../constants";
import { FontInput, NumberInput, ToolButton } from "../ui";
import { ZoomResetIcon } from "../icons";
import type { PropsWithSettings, ShapeFill, Tool } from "../../types";
import type { UseCanvasDragAndZoomReturn } from "../../hooks";
import { Menu } from "~/features/shared/components/ui/menu";
import { Modal } from "~/features/shared/components/ui";
import { m } from "~/paraglide/messages";

interface DrawingBoardMenuProps
  extends PropsWithSettings, DrawingBoardDropdownMenuProps {
  onZoomValueChange: UseCanvasDragAndZoomReturn["setZoom"];
  resetZoomValue: UseCanvasDragAndZoomReturn["reset"];
  zoomMin: UseCanvasDragAndZoomReturn["zoomMin"];
}

const strokeRelatedTools: Tool[] = ["brush", "eraser", "shape"];

export function DrawingBoardMenu(props: DrawingBoardMenuProps) {
  return (
    <div class="bg-base-100 border-neutral/20 flex flex-wrap gap-2 border-b p-2">
      <DrawingBoardDropdownMenu onExportAsPng={props.onExportAsPng} />

      <ZoomSettings {...props} />

      <Show when={strokeRelatedTools.includes(props.settings.tool)}>
        <StrokeSettings {...props} />
      </Show>

      <Show when={props.settings.tool === "text"}>
        <TextSettings {...props} />
      </Show>

      <Show when={props.settings.tool === "shape"}>
        <ShapeSettings {...props} />
      </Show>
    </div>
  );
}

function ZoomSettings(props: DrawingBoardMenuProps) {
  return (
    <div class="join">
      <NumberInput
        class="input-sm join-item max-w-50"
        label={m.menu_zoom()}
        value={Math.round(props.settings.zoom * 100)}
        onInput={(v) => props.onZoomValueChange(() => v / 100)}
        onChange={(v) => props.onZoomValueChange(() => v / 100)}
        min={Math.round(props.zoomMin() * 100)}
        max={ZOOM_MAX * 100}
        step="1"
        parse="float"
        unit="%"
      />
      <ToolButton
        class="join-item"
        noTransparent
        onClick={props.resetZoomValue}
      >
        <span class="sr-only">{m.menu_resetZoom()}</span>
        <ZoomResetIcon />
      </ToolButton>
    </div>
  );
}

function StrokeSettings(props: PropsWithSettings) {
  return (
    <NumberInput
      class="input-sm max-w-50"
      label={m.menu_strokeSize()}
      value={props.settings.strokeWidth}
      onInput={(v) => props.setSettings("strokeWidth", v)}
      min="1"
      step="1"
      unit="px"
    />
  );
}

function TextSettings(props: PropsWithSettings) {
  return (
    <>
      <NumberInput
        class="input-sm max-w-50"
        label={m.menu_fontSize()}
        value={props.settings.fontSize}
        onInput={(v) => props.setSettings("fontSize", v)}
        min="1"
        step="1"
        unit="px"
      />

      <FontInput
        value={props.settings.fontFamily}
        onChange={(v) => props.setSettings("fontFamily", v)}
        fontWeight={props.settings.fontWeight}
        fontStyle={props.settings.fontStyle}
        underline={props.settings.underline}
      />

      <div class="join">
        <ToolButton
          class="join-item"
          data-current-tool={props.settings.fontWeight === "bold"}
          onMouseDown={(e) => {
            e.preventDefault();
            props.setSettings(
              "fontWeight",
              props.settings.fontWeight === "bold" ? "normal" : "bold",
            );
          }}
        >
          <BoldIcon />
          <span class="sr-only">{m.menu_bold()}</span>
        </ToolButton>

        <ToolButton
          class="join-item"
          data-current-tool={props.settings.fontStyle === "italic"}
          onMouseDown={(e) => {
            e.preventDefault();
            props.setSettings(
              "fontStyle",
              props.settings.fontStyle === "italic" ? "normal" : "italic",
            );
          }}
        >
          <ItalicIcon />
          <span class="sr-only">{m.menu_italic()}</span>
        </ToolButton>

        <ToolButton
          class="join-item"
          data-current-tool={props.settings.underline}
          onMouseDown={(e) => {
            e.preventDefault();
            props.setSettings("underline", (p) => !p);
          }}
        >
          <UnderlineIcon />
          <span class="sr-only">{m.menu_underline()}</span>
        </ToolButton>
      </div>
    </>
  );
}

interface DrawingBoardDropdownMenuProps {
  onExportAsPng: () => void;
}

function DrawingBoardDropdownMenu(props: DrawingBoardDropdownMenuProps) {
  const modal = Modal.useModal();

  return (
    <Menu.Root>
      <ToolButton as={Menu.Trigger}>
        <MenuIcon />
      </ToolButton>
      <Menu.Positioner>
        <Menu.Content class="min-w-60">
          <Menu.Arrow>
            <Menu.ArrowTip />
          </Menu.Arrow>

          <Menu.ItemGroup id="export">
            <Menu.ItemGroupLabel>{m.menu_actions()}</Menu.ItemGroupLabel>
            <Menu.Item value="export-png" onSelect={props.onExportAsPng}>
              <DownloadIcon />
              <Menu.ItemText>{m.menu_exportAsPng()}</Menu.ItemText>
            </Menu.Item>
          </Menu.ItemGroup>

          <Menu.ItemGroup id="panels">
            <Menu.ItemGroupLabel>{m.menu_panels()}</Menu.ItemGroupLabel>
            <Menu.Item value="color-picker">
              <PaletteIcon />
              <Menu.ItemText>{m.menu_colorPicker()}</Menu.ItemText>
            </Menu.Item>
            <Menu.Item value="tools">
              <WrenchIcon />
              <Menu.ItemText>{m.menu_tools()}</Menu.ItemText>
            </Menu.Item>
          </Menu.ItemGroup>

          <Menu.ItemGroup id="links">
            <Menu.ItemGroupLabel>{m.menu_helps()}</Menu.ItemGroupLabel>
            <Menu.Item value="keyboard-shortcuts" onClick={modal.openModal}>
              <KeyboardIcon />
              <Menu.ItemText>{m.menu_keyboardShortcuts()}</Menu.ItemText>
            </Menu.Item>
          </Menu.ItemGroup>

          <Menu.ItemGroup id="links">
            <Menu.ItemGroupLabel>{m.menu_links()}</Menu.ItemGroupLabel>
            <Menu.Item
              value="homepage"
              asChild={(props) => (
                <Link to="/" {...props()}>
                  <HouseIcon />
                  <Menu.ItemText>{m.menu_goToHomepage()}</Menu.ItemText>
                </Link>
              )}
            />
          </Menu.ItemGroup>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}

const shapeFillOptions: { value: ShapeFill; label: () => string }[] = [
  { value: "outline", label: () => m.menu_shapeFillOutline() },
  { value: "solid", label: () => m.menu_shapeFillSolid() },
  { value: "secondary", label: () => m.menu_shapeFillSecondary() },
];

function ShapeSettings(props: PropsWithSettings) {
  return (
    <div class="space-x-0.5">
      <Index each={shapeFillOptions}>
        {(option) => (
          <ToolButton
            data-current-tool={props.settings.shapeFill === option().value}
            onMouseDown={(e) => {
              e.preventDefault();
              props.setSettings("shapeFill", option().value);
            }}
          >
            <SquareIcon
              classList={{
                "fill-current": option().value === "solid",
                "fill-secondary-content": option().value === "secondary",
              }}
            />
            <span class="sr-only">{option().label()}</span>
          </ToolButton>
        )}
      </Index>
    </div>
  );
}
