import { formatForDisplay } from "@tanstack/solid-hotkeys";
import { For, Index, Show } from "solid-js";
import { m } from "~/paraglide/messages";

interface Shortcut {
  id: string;
  hotkey: string;
  description: string;
  category: string;
  action?: string;
}

const shortcuts = JSON.parse(m.shortcuts()) as Shortcut[];
const grouped = Object.groupBy(shortcuts, (s) => s.category);

export function ShortcutsMenu() {
  return (
    <div class="max-h-150 space-y-4 overflow-y-scroll px-3 [&>ul]:space-y-4">
      <For each={Object.entries(grouped)}>
        {([category, items]) => (
          <section class="space-y-2 [&>h4]:text-base [&>h4]:font-medium">
            <h4>{category}</h4>

            <ul class="bg-base-100 rounded-box [&>li]:border-b-base-content/10 shadow [&>li]:flex [&>li]:justify-between [&>li]:border-b [&>li]:p-4 [&>li]:last:border-none">
              <Index each={items}>
                {(s) => (
                  <li class="[&>p]:text-base-content/70 [&>p]:text-sm">
                    <p>{s().description}</p>
                    <div class="flex items-center gap-1">
                      <Index
                        each={formatForDisplay(s().hotkey, {
                          separatorToken: " ",
                          useSymbols: false,
                        }).split(" ")}
                      >
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
