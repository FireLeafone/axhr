module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-base', 'prettier', 'airbnb-typescript'],
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 'latest', // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    project: ['./tsconfig.eslint.json'],
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'linebreak-style': 0,
    'implicit-arrow-linebreak': 0,
    'operator-linebreak': 0,
    semi: ['error', 'always'],
    'prefer-const': 2,
    'spaced-comment': 2,
    'jsx-quotes': 2,
    'key-spacing': 2,
    camelcase: 0,
    'comma-spacing': 2,
    'global-require': 2,
    'no-console': 0,
    'func-call-spacing': ['error', 'never'],
    'block-spacing': 2,
    'space-before-function-paren': 2,
    'no-underscore-dangle': 0,
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    'object-curly-newline': 0,
    'max-classes-per-file': 0,
    'function-paren-newline': 0,
    'no-confusing-arrow': 0,
    'class-methods-use-this': 0,
    'no-plusplus': 0,
    'consistent-return': 0,
    'no-param-reassign': 0,
    'react/jsx-filename-extension': 0,

    'prettier/prettier': 'error',

    'import/prefer-default-export': 0,
    'import/no-cycle': 0,
    // "import/no-extraneous-dependencies": ["error", {"devDependencies": ["./scripts/**"]}],
    'import/no-extraneous-dependencies': 0,

    '@typescript-eslint/no-unused-expressions': [
      'error',
      { allowShortCircuit: true },
    ],
    '@typescript-eslint/lines-between-class-members': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/no-useless-constructor': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/brace-style': 0,
    '@typescript-eslint/dot-notation': 0,
    '@typescript-eslint/default-param-last': 0,
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'no-unused-vars': 'error',
        'no-console': 'off',
      },
    },
  ],
};
