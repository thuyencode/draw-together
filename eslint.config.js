// @ts-check

import js from "@eslint/js";
import * as tsParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import solid from "eslint-plugin-solid/configs/typescript";
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
];
