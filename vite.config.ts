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

export default defineConfig({
  plugins: [
    devtools(),
    nitro({
      preset: "bun",
      compressPublicAssets: true,
    }),
    tailwindcss(),
    tanstackStart(),
    solid({ ssr: true }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(dirname, "./src"),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/konva")) {
            return "konva";
          }

          if (id.includes("node_modules/@ark-ui")) {
            return "ark-ui";
          }
        },
      },
    },
  },
});
