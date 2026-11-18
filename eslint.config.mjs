import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // client-only reads after mount (storage, matchMedia, data-*) are deliberate: they keep SSR markup identical
    rules: { "react-hooks/set-state-in-effect": "warn" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/scrollcraft/**",
    "scripts/**",
    "scrollcraft/**",
  ]),
]);

export default eslintConfig;
