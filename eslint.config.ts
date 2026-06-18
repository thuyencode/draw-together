import { tanstackConfig } from "@tanstack/eslint-config";
import router from "@tanstack/eslint-plugin-router";
import * as tsParser from "@typescript-eslint/parser";
import jsxA11y from "eslint-plugin-jsx-a11y";
import solid from "eslint-plugin-solid/configs/typescript";
import storybook from "eslint-plugin-storybook";

export default [
  ...tanstackConfig,
  ...storybook.configs["flat/recommended"],
  ...router.configs["flat/recommended"],
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/naming-convention": "off",
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
    ignores: [".output/**/*"],
  },
];
