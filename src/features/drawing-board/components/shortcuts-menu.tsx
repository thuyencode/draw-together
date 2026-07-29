import { For, Index, Show } from "solid-js";
import { formatForDisplay } from "@tanstack/solid-hotkeys";
import { SHORTCUTS } from "../constants";

const registeredGrouped = Object.groupBy(
  [...SHORTCUTS.values()],
  (s) => s.category,
);

const canvasBuiltinShortcuts = [
  {
    hotkey: "ArrowUp",
    description: "Nudge selected object by 1px",
    category: "Canvas (built-in)",
  },
  {
    hotkey: "Shift",
    description: "Add to selection",
    action: "click",
    category: "Canvas (built-in)",
  },
  {
    hotkey: "Shift",
    description: "Constrain proportions while scaling",
    action: "drag",
    category: "Canvas (built-in)",
  },
  {
    hotkey: "Alt",
    description: "Scale from center",
    action: "drag",
    category: "Canvas (built-in)",
  },
  {
    hotkey: "Escape",
    description: "Exit text editing / deselect",
    category: "Canvas (built-in)",
  },
  {
    hotkey: "Enter",
    description: "New line inside text object",
    category: "Canvas (built-in)",
  },
];

const builtinGrouped = Object.groupBy(
  canvasBuiltinShortcuts,
  (s) => s.category,
);

export function ShortcutsMenu() {
  return (
    <div class="max-h-150 space-y-4 overflow-y-scroll px-3 [&>ul]:space-y-4">
      <For each={Object.entries(registeredGrouped)}>
        {([category, shortcuts]) => (
          <section class="space-y-2 [&>h4]:text-base [&>h4]:font-medium">
            <h4>{category}</h4>

            <ul class="bg-base-100 rounded-box [&>li]:border-b-base-content/10 shadow [&>li]:flex [&>li]:justify-between [&>li]:border-b [&>li]:p-4 [&>li]:last:border-none">
              <Index each={shortcuts}>
                {(s) => (
                  <li class="[&>p]:text-base-content/70 [&>p]:text-sm">
                    <p>{s().description}</p>
                    <div class="flex gap-1">
                      <Index
                        each={formatForDisplay(s().hotkey, {
                          separatorToken: " ",
                          useSymbols: false,
                        }).split(" ")}
                      >
                        {(token) => <kbd class="kbd kbd-sm">{token()}</kbd>}
                      </Index>
                    </div>
                  </li>
                )}
              </Index>
            </ul>
          </section>
        )}
      </For>

      <For each={Object.entries(builtinGrouped)}>
        {([category, shortcuts]) => (
          <section class="space-y-2 [&>h4]:text-base [&>h4]:font-medium">
            <h4>{category}</h4>

            <ul class="bg-base-100 rounded-box [&>li]:border-b-base-content/10 shadow [&>li]:flex [&>li]:justify-between [&>li]:border-b [&>li]:p-4 [&>li]:last:border-none">
              <Index each={shortcuts}>
                {(s) => (
                  <li class="[&>p]:text-base-content/70 [&>p]:text-sm">
                    <p>{s().description}</p>
                    <div class="flex items-center gap-1">
                      <Index each={s().hotkey.split(" ")}>
                        {(token) => <kbd class="kbd kbd-sm">{token()}</kbd>}
                      </Index>
                      <Show when={s().action}>
                        <span class="text-base-content/50 text-xs">
                          ({s().action})
                        </span>
                      </Show>
                    </div>
                  </li>
                )}
              </Index>
            </ul>
          </section>
        )}
      </For>
    </div>
  );
}
