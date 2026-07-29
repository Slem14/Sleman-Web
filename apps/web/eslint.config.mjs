import base from "@wg/eslint-config";

// Next.js-specific lint rules (@next/eslint-plugin-next, jsx-a11y) are added
// in Stage 2 together with the real UI work.
export default [
  ...base,
  {
    ignores: ["next-env.d.ts", ".next/**"],
  },
];
