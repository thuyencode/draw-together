import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import lucidePreprocess from "vite-plugin-lucide-preprocess";
import solid from "vite-plugin-solid";
import { ValidateEnv } from "@julr/vite-plugin-validate-env";
import { prerenderRoutes } from "./src/prerender.ts";

export default defineConfig({
  plugins: [
    ValidateEnv({ configFile: "./src/configs/env/env" }),
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      outputStructure: "message-modules",
      cookieName: "LOCALE",
      strategy: [
        "url",
        "cookie",
        "preferredLanguage",
        "baseLocale",
        "localStorage",
      ],
      urlPatterns: [
        {
          pattern: "/:path(.*)?",
          localized: [
            ["en", "/en/:path(.*)?"],
            ["vi", "/vi/:path(.*)?"],
          ],
        },
      ],
    }),
    // unstableRolldownAdapter(analyzer({ analyzerMode: "server" })),
    lucidePreprocess(),
    devtools(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        autoSubfolderIndex: true,
        autoStaticPathsDiscovery: false,
        crawlLinks: false,
        failOnError: true,
      },
      pages: prerenderRoutes,
    }),
    solid({ ssr: true }),
    nitro({
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
            {
              name: "eyedropper-polyfill",
              test: /node_modules[\\/]eyedropper-polyfill/,
              priority: 15,
            },
          ],
        },
      },
    },
  },
  server: {
    forwardConsole: true,
  },
});
