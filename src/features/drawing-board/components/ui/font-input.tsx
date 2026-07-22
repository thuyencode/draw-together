import { Index, splitProps } from "solid-js";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-solid";
import { createListCollection } from "@ark-ui/solid/select";
import type { JSX } from "solid-js";
import type { TextSettings } from "../../types";
import { Select } from "~/features/shared/components/ui";
import { cn } from "~/features/shared/utils/cn";

interface FontInputProps {
  value: TextSettings["fontFamily"];
  onChange: (value: TextSettings["fontFamily"]) => void;
  fontWeight: TextSettings["fontWeight"];
  fontStyle: TextSettings["fontStyle"];
  underline: TextSettings["underline"];
  class?: string;
}

interface DefaultFontItem {
  label: string;
  value: string;
  style: JSX.CSSProperties;
}

const defaultFonts: DefaultFontItem[] = [
  {
    label: "Roboto",
    value: "Roboto",
    style: { "font-family": "Roboto Variable, sans-serif" },
  },
  {
    label: "Noto Serif",
    value: "Noto Serif Variable",
    style: { "font-family": "Noto Serif Variable, sans-serif" },
  },
  {
    label: "Arima",
    value: "Arima Variable",
    style: { "font-family": "Arima Variable, sans-serif" },
  },
  {
    label: "JetBrains Mono",
    value: "JetBrains Mono Variable",
    style: { "font-family": "JetBrains Mono Variable, monospace" },
  },
  {
    label: "Playerpen Sans",
    value: "Playerpen Sans Variable",
    style: { "font-family": "Playpen Sans Variable, sans-serif" },
  },
];

export function FontInput(_props: FontInputProps) {
  const [props, rest] = splitProps(_props, [
    "value",
    "onChange",
    "fontWeight",
    "fontStyle",
    "underline",
    "class",
  ]);

  const fontCollection = createListCollection({ items: defaultFonts });

  const classList = (): JSX.ClassList => ({
    "font-bold": props.fontWeight === "bold",
    italic: props.fontStyle === "italic",
    underline: props.underline,
  });

  return (
    <Select.Root
      class={cn("max-w-50", props.class)}
      collection={fontCollection}
      value={[props.value]}
      onValueChange={(e) => {
        props.onChange(e.value[0]);
      }}
      {...rest}
    >
      <Select.Control>
        <Select.Trigger
          class="input-sm max-w-50 text-sm"
          classList={classList()}
          style={
            fontCollection.items.find((i) => i.value === props.value)?.style
          }
        >
          <Select.ValueText
            class="flex-1 text-left"
            placeholder="Select a font"
          />
        </Select.Trigger>
        <Select.Indicator>
          <ChevronsUpDownIcon />
        </Select.Indicator>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          <Index each={fontCollection.items}>
            {(item) => (
              <Select.Item
                item={item()}
                class="grid-cols-[1fr_auto] text-base"
                classList={classList()}
                style={item().style}
              >
                <Select.ItemText class="col-span-full">
                  {item().label}
                </Select.ItemText>
                <Select.ItemIndicator class="col-span-">
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            )}
          </Index>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}
