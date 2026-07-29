import { Index, splitProps } from "solid-js";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-solid";
import { createListCollection } from "@ark-ui/solid/select";
import type { JSX } from "solid-js";
import type { TextSettings } from "../../types";
import { Select } from "~/features/shared/components/ui";

interface FontInputProps {
  value: TextSettings["fontFamily"];
  onChange: (value: TextSettings["fontFamily"]) => void;
  fontWeight: TextSettings["fontWeight"];
  fontStyle: TextSettings["fontStyle"];
  underline: TextSettings["underline"];
}

interface DefaultFontItem {
  label: string;
  value: string;
  style: JSX.CSSProperties;
}

const DEFAULT_FONTS: DefaultFontItem[] = [
  {
    label: "Roboto",
    value: "Roboto Variable",
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
    label: "Playpen Sans",
    value: "Playpen Sans Variable",
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
  ]);

  const fontCollection = createListCollection({ items: DEFAULT_FONTS });

  const classList = (): JSX.ClassList => ({
    "font-bold": props.fontWeight === "bold",
    italic: props.fontStyle === "italic",
    underline: props.underline,
  });

  const currentFont = () =>
    fontCollection.items.find((i) => i.value === props.value);

  return (
    <Select.Root
      class="max-w-56"
      collection={fontCollection}
      value={[props.value]}
      onValueChange={(e) => {
        props.onChange(e.value[0]);
      }}
      {...rest}
    >
      <Select.Control>
        <Select.Trigger
          class="input-sm text-sm"
          classList={classList()}
          style={currentFont()?.style}
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
