// @ts-check

// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import * as tsParser from "@typescript-eslint/parser";
import jsxA11y from "eslint-plugin-jsx-a11y";
import solid from "eslint-plugin-solid/configs/typescript";
import { defineConfig } from "eslint/config";
import ts from "typescript-eslint";

export default [
  ...defineConfig(
    js.configs.recommended,
    ts.configs.recommended,
    ts.configs.strict,
    ts.configs.stylistic,
  ),
  {
    files: ["**/*.{ts,tsx}"],
    ...solid,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
  },
  ...storybook.configs["flat/recommended"],
  jsxA11y.flatConfigs.recommended,
];
