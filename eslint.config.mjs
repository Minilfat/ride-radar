import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import hooksPlugin from 'eslint-plugin-react-hooks';
import reactPlugin from 'eslint-plugin-react';
import jestPlugin from 'eslint-plugin-jest';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
  {
    ignores: [
      'cache/*',
      'dist/*',
      'eslint.config.mjs',
      '.prettierrc',
      'public/**',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    settings: {
      react: {
        version: '19.0',
      },
    },
    ...reactPlugin.configs.flat.recommended,
  },
  {
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['**/*.{spec,test}.[jt]s?(x)', 'test/**'],
    ...jestPlugin.configs['flat/recommended'],
  },
  {
    files: ['**/*.{spec,test}.[jt]s?(x)', 'test/**'],
    ...testingLibraryPlugin.configs['flat/react'],
  },
  eslintConfigPrettier,
);
