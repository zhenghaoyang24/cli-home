import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/vendor/**"],
  },
  {
    rules: {
      "no-unused-vars": ["warn",
        {
          argsIgnorePattern: '^_', // 忽略以 _ 开头的参数
          varsIgnorePattern: '^_', // 忽略以 _ 开头的变量
          caughtErrorsIgnorePattern: '^_' 
        }
      ]
      "no-console": ["error", { allow: ["error"] }],
    },
  },
  eslintConfigPrettier,
]);
