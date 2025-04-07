import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        // Voeg Node.js globals toe (zoals process, Buffer, etc.)
        ...globals.node
      }
    }
  },
  {
    // Voeg hier browser globals toe voor je client-side code
    languageOptions: {
      globals: {
        ...globals.browser,
        // Voeg hier extra globals toe als Swiper, List en error
        Swiper: "readonly",
        List: "readonly",
        error: "readonly"
      }
    }
  },
  pluginJs.configs.recommended,
];
