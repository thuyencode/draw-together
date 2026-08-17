import { defineConfig } from "@julr/vite-plugin-validate-env";
import * as v from "valibot";

export default defineConfig({
  validator: "standard",
  schema: {
    VITE_PUBLIC_URL: v.pipe(v.string(), v.url()),
  },
});
