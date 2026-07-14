import { tanstackConfig } from "@tanstack/eslint-config";
import router from "@tanstack/eslint-plugin-router";
import * as tsParser from "@typescript-eslint/parser";
import jsxA11y from "eslint-plugin-jsx-a11y";
import solid from "eslint-plugin-solid/configs/typescript";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  ...tanstackConfig,
  ...router.configs["flat/recommended"],
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/naming-convention": "off",
      "no-use-before-define": "warn",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ...solid,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
    },
  },
  {
    ignores: [".output/**/*", "./fabricjs-psbrush/**/*"],
  },
  {
    files: ["src/routes/**/*.{ts,tsx}"],
    rules: {
      "no-use-before-define": "off",
    },
  },
];
