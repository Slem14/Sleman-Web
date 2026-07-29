import base from "@wg/eslint-config";
import next from "@wg/eslint-config/next";

export default [
  ...base,
  ...next,
  {
    ignores: ["next-env.d.ts", ".next/**", "playwright-report/**", "test-results/**"],
  },
];
