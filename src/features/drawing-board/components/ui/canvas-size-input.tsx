import { Index, Show, createSignal, onMount, untrack } from "solid-js";
import { ArrowLeftRightIcon, PencilIcon, RotateCcwIcon } from "lucide-solid";
import { createStore } from "solid-js/store";
import { NumberInput } from "./number-input";
import type { NewDrawingOptionsInput } from "../../schema";
import { m } from "~/paraglide/messages";

type Dimension = NewDrawingOptionsInput["dimension"];
type PaperSizeLabel = "A4" | "A5" | "A6" | "A7" | "A8" | "custom";

const paperSizeMap = new Map<PaperSizeLabel, Dimension>([
  ["A4", [3508, 2480]],
  ["A5", [2480, 1748]],
  ["A6", [1748, 1240]],
  ["A7", [1240, 874]],
  ["A8", [874, 614]],
]);

interface CanvasSizeInputProps {
  onChange?: (value: Dimension) => void;
  onInput?: (value: Dimension) => void;
}

const DEFAULT_LABEL: PaperSizeLabel = "A5";
const DEFAULT_CUSTOM_SIZE: Dimension = [1500, 500];

export function CanvasSizeInput(props: CanvasSizeInputProps) {
  const [paperSizeLabel, setPaperSizeLabel] = createSignal(DEFAULT_LABEL);
  const [dimension, setDimension] = createStore(DEFAULT_CUSTOM_SIZE);

  const selectPreset = (label: PaperSizeLabel) => {
    setPaperSizeLabel(label);
    if (label === "custom") return;

    const dim = paperSizeMap.get(label)!;
    setDimension(dim);
    props.onChange?.(dim);
  };

  const swap = () => {
    if (paperSizeLabel() !== "custom") {
      const dim = paperSizeMap.get(paperSizeLabel());
      if (!dim) return;
      props.onChange?.([dim[1], dim[0]]);
    } else {
      setDimension(([w, h]) => {
        const next: Dimension = [h, w];
        props.onChange?.(next);
        return next;
      });
    }
  };

  onMount(() => {
    selectPreset(untrack(paperSizeLabel));
  });

  return (
    <div class="grid grid-cols-[1fr_auto] items-center gap-1 sm:flex sm:justify-between">
      <Show when={paperSizeLabel() !== "custom"}>
        <select
          class="select w-full"
          value={paperSizeLabel()}
          onChange={(e) => selectPreset(e.target.value as PaperSizeLabel)}
        >
          <option disabled={true}>{m.newDrawing_pickDimension()}</option>

          <Index each={Array.from(paperSizeMap.entries())}>
            {(item) => (
              <option value={item()[0]}>
                {item()[1][0]} x {item()[1][1]}
              </option>
            )}
          </Index>

          <option value="custom">{m.newDrawing_custom()}</option>
        </select>

        <button
          type="button"
          class="btn btn-ghost btn-square"
          onClick={() => {
            const dim = paperSizeMap.get(paperSizeLabel());
            if (!dim) return;
            setDimension(dim);
            setPaperSizeLabel("custom");
          }}
        >
          <PencilIcon />
          <span class="sr-only">{m.newDrawing_edit()}</span>
        </button>
      </Show>

      <Show when={paperSizeLabel() === "custom"}>
        <div class="contents sm:flex sm:items-center sm:gap-1">
          <NumberInput
            label={m.newDrawing_width()}
            unit="px"
            value={Number(dimension[0])}
            onInput={(width) => {
              setDimension(([, height]) => {
                const next: Dimension = [width, height];
                props.onInput?.(next);
                return next;
              });
            }}
          />

          <button type="button" class="btn btn-ghost btn-square" onClick={swap}>
            <ArrowLeftRightIcon />
            <span class="sr-only">{m.newDrawing_swapWidthHeight()}</span>
          </button>

          <NumberInput
            label={m.newDrawing_height()}
            unit="px"
            value={Number(dimension[1])}
            onInput={(height) => {
              setDimension(([width]) => {
                const next: Dimension = [width, height];
                props.onInput?.(next);
                return next;
              });
            }}
          />

          <button
            type="button"
            class="btn btn-ghost btn-square"
            onClick={() => {
              setPaperSizeLabel(DEFAULT_LABEL);
              setDimension(DEFAULT_CUSTOM_SIZE);
            }}
          >
            <RotateCcwIcon />
            <span class="sr-only">{m.newDrawing_reset()}</span>
          </button>
        </div>
      </Show>
    </div>
  );
}
