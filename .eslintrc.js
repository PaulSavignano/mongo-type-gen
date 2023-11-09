module.exports = {
  env: {
    node: true,
  },
  extends: [
    'plugin:yml/standard',
    'eslint:recommended',
    'prettier',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      rules: {
        '@typescript-eslint/naming-convention': ['error', { format: ['PascalCase'], selector: 'typeLike' }],
      },
    },
    {
      files: ['*.json', '*.json5', '*.jsonc', '**/*.json'],
      parser: 'jsonc-eslint-parser',
      rules: {
        'jsonc/sort-keys': ['error', 'asc'],
      },
    },
    {
      files: ['*.yaml', '*.yml', '.github/workflows/*.yml', '.github/workflows/*.yaml'],
      parser: 'yaml-eslint-parser',
      rules: {
        'yml/quotes': ['error', { prefer: 'single' }],
        'yml/sort-sequence-values': ['error', { order: { type: 'asc' }, pathPattern: '^.*$' }],
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    'jsonc',
    'sort-class-members',
    'sort-destructure-keys',
    'sort-keys-fix',
    'typescript-sort-keys',
    '@typescript-eslint',
  ],
  root: true,
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'import/no-cycle': 'error',
    'import/order': [
      'error',
      {
        alphabetize: { caseInsensitive: true, order: 'asc' },
        groups: [['builtin', 'external'], 'internal'],
        'newlines-between': 'always',
        pathGroups: [
          { group: 'external', pattern: 'newrelic', position: 'before' },
          { group: 'external', pattern: 'react', position: 'before' },
          { group: 'builtin', pattern: '@types' },
        ],
        pathGroupsExcludedImportTypes: ['react', '@types'],
      },
    ],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    'sort-class-members/sort-class-members': [
      2,
      {
        accessorPairPositioning: 'getThenSet',
        order: [
          '[static-properties]',
          '[static-methods]',
          '[properties]',
          '[conventional-private-properties]',
          'constructor',
          '[methods]',
          '[conventional-private-methods]',
        ],
      },
    ],
    'sort-destructure-keys/sort-destructure-keys': 2,
    'sort-keys-fix/sort-keys-fix': 'error',
    'typescript-sort-keys/interface': 'error',
    'typescript-sort-keys/string-enum': 'error',
  },
  settings: {
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
};
