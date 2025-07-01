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
        // Voeg hier extra globals toe als Swiper, List, error en validator
        Swiper: "readonly",
        List: "readonly",
        error: "readonly",
        validator: "readonly"
      }
    }
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-unused-vars": ["error", { 
        "varsIgnorePattern": "^validator$", // Negeer specifiek de 'validator' variabele
        "argsIgnorePattern": "^_|^(file|next)$" // Negeer parameters die beginnen met _ of file/next zijn
      }]
    }
  }
];