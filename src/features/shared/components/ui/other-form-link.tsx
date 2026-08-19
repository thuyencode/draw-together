import { Link } from "@tanstack/solid-router";
import { splitProps } from "solid-js";
import { cn } from "../../utils/cn";
import type { LinkComponentProps } from "@tanstack/solid-router";

export function OtherFormLink(_props: LinkComponentProps) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <Link
      class={cn("btn btn-ghost no-underline hover:underline", props.class)}
      {...rest}
    />
  );
}
