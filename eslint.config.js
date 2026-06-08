// @ts-check

import js from "@eslint/js";
import * as tsParser from "@typescript-eslint/parser";
import jsxA11y from "eslint-plugin-jsx-a11y";
import solid from "eslint-plugin-solid/configs/typescript";
import storybook from "eslint-plugin-storybook";
import { defineConfig, globalIgnores } from "eslint/config";
import ts from "typescript-eslint";

export default [
  ...defineConfig([
    {
      files: ["src/**/*.{ts,tsx}"],
      extends: [
        js.configs.recommended,
        ts.configs.strict,
        ts.configs.stylistic,
      ],
      rules: {
        "no-unassigned-vars": "off",
        "@typescript-eslint/consistent-type-imports": "error",
      },
    },
    globalIgnores(["storybook-static/**/*", ".storybook/**/*"]),
  ]),
  ...storybook.configs["flat/recommended"],
  jsxA11y.flatConfigs.recommended,
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
];
