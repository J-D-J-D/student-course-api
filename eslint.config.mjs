import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    ignores: ['node_modules', 'dist', 'coverage'],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 2021,
      sourceType: 'commonjs',
    },

    plugins: {
      prettier: eslintPluginPrettier,
    },

    rules: {
      ...js.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      'prettier/prettier': ['error'],
      'no-console': 'off',
      'no-underscore-dangle': 'off',
    },
  },
];
