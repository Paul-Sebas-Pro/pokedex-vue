import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      // Force l'utilisation de guillemets doubles
      quotes: [
        "error",
        "double",
        {
          avoidEscape: true, // Permet d'éviter les erreurs si des guillemets simples sont nécessaires dans la chaîne
          allowTemplateLiterals: true, // Permet l'utilisation de littéraux de gabarits
        },
      ],
    },
  },
  pluginVue.configs["flat/essential"],
  {
    // Configuration spécifique pour les fichiers Vue
    files: ["**/*.vue"],
    rules: {
      // Force les guillemets doubles dans les templates Vue
      "vue/html-quotes": [
        "error",
        "double",
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
    }
  }
]);
