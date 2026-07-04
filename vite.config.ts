import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { analyzer, unstableRolldownAdapter } from "vite-bundle-analyzer";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    unstableRolldownAdapter(analyzer({ analyzerMode: "server" })),
    devtools(),
    tailwindcss(),
    tanstackStart(),
    solid({ ssr: true }),
    nitro({
      preset: "bun",
      compressPublicAssets: true,
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "ark-ui",
              test: /node_modules[\\/]@ark-ui/,
              priority: 20,
            },
            {
              name: "fabric",
              test: /node_modules[\\/]fabric/,
              priority: 15,
            },
          ],
        },
      },
    },
  },
});
