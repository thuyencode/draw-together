import { CheckIcon } from "lucide-solid";
import { Index } from "solid-js";
import { Menu } from "./ui";
import type { Locale } from "~/paraglide/runtime";
import { getLocale, locales, setLocale } from "~/paraglide/runtime";
import { m } from "~/paraglide/messages";

export function LocaleSwitcher() {
  const locale = getLocale();

  return (
    <Menu.Root positioning={{ placement: "bottom" }}>
      <Menu.Trigger class="btn btn-ghost">
        {m.localeSwitcher_language({ locale })}
      </Menu.Trigger>

      <Menu.Positioner>
        <Menu.Content class="max-w-8">
          <Menu.RadioItemGroup
            value={locale}
            onValueChange={(e) => setLocale(e.value as Locale)}
          >
            <Menu.Arrow>
              <Menu.ArrowTip />
            </Menu.Arrow>
            <Index each={locales}>
              {(locale) => (
                <Menu.RadioItem value={locale()}>
                  <Menu.ItemText>
                    {m.localeSwitcher_language({ locale: locale() })}
                  </Menu.ItemText>
                  <Menu.ItemIndicator>
                    <CheckIcon />
                  </Menu.ItemIndicator>
                </Menu.RadioItem>
              )}
            </Index>
          </Menu.RadioItemGroup>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
