import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

/**
 * Shared base ESLint flat config for all Welcome Germany packages.
 * Framework-specific additions (Next.js plugin, a11y) arrive in Stage 2.
 */
export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/.next-build/**", // production build output (see apps/web/next.config.mjs)
      "**/out/**",
      "**/dist/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/playwright-report/**",
      "**/test-results/**",
    ],
  },
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "always"],
    },
  },
  {
    // Plain JS config files (eslint.config.mjs, next.config.mjs, …) are not
    // part of a TS project — lint them without type information.
    files: ["**/*.mjs", "**/*.js"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    // Build scripts and evaluation runners are CLI tools: printing to stdout
    // is their purpose, unlike application code where logging is a privacy
    // control. Evaluation runners only ever handle synthetic fixtures, so
    // there is no user content that could be printed.
    files: ["**/scripts/**", "**/evals/**"],
    rules: { "no-console": "off" },
  },
  prettier,
);
