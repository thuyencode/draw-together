import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    devtools(),
    nitro({ preset: "bun" }),
    tailwindcss(),
    tanstackStart(),
    solid({ ssr: true }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(dirname, "./src"),
      "solid-konva": path.resolve(dirname, "./solid-konva/lib/index.ts"),
    },
  },
});
