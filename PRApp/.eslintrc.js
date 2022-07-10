module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 13,
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'prettier', 'prettier'],
  rules: {
    indent: ['error', 2, {SwitchCase: 1}],
    quotes: ['error', 'single', {avoidEscape: true}],
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'always'],
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'prettier/prettier': 'error',
    'import/no-unresolved': 'off',
    'import/default': 'off',
    'import/export': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'off',
    'comma-dangle': ['error', 'never'],
    'comma-spacing': [
      1,
      {
        before: false,
        after: true
      }
    ],
    'object-curly-spacing': ['error', 'never'],
    'object-curly-newline': 0,
    'no-param-reassign': 0,
    'no-shadow': 'off',
    'wrap-iife': ['error', 'any'],
    'no-default-export': 0,
    'prefer-destructuring': ['error', {object: true, array: false}],
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 0,
    'max-len': [2, {code: 180, tabWidth: 2, ignoreUrls: true}],
    // customized
    'no-unused-expressions': 'off',
    'no-nested-ternary': 'off',
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    'operator-linebreak': 'off',
    'no-confusing-arrow': 'off',
    'implicit-arrow-linebreak': 'off',
    'array-callback-return': 'off',
    'no-useless-escape': 'off',
    'consistent-return': 'off',
    'function-paren-newline': 'off',
    'no-debugger': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.object.name='console'][callee.property.name!=/^(group|groupEnd|debug|log|warn|error|info|trace)$/]",
        message: 'Unexpected property on console object was called'
      }
    ],
    'no-console': [
      'error',
      {
        allow: ['error', 'info', 'group', 'groupEnd']
      }
    ],
    'newline-per-chained-call': 'off',
    'nonblock-statement-body-position': 'off',
    'import/no-extraneous-dependencies': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      'babel-module': {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.native.js']
      }
    }
  }
};
