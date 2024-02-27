module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    es6: true,
    node: true,
  },
  overrides: [
    {
      files: ['*.js', '*.ts'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              ['^(@nestjs)(\\.*|$)'],
              ['^(?!(@translator\\/|@nestjs\\/|\\.\\.\\/|\\.\\/|$)).*'],
              ['^(@translator/core)(\\.*|$)'],
              ['^(@translator/messaging)(\\.*|$)'],
              ['^(@translator/shared)(\\.*|$)'],
              ['^(@translator/api)(\\.*|$)'],
            ],
          },
        ],
      },
    },
  ],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    // Suggestions
    'no-var': 'error',
    'one-var': [2, 'never'],
    'prefer-const': 'error',
    // Possible Problems
    'no-duplicate-imports': 'error',
    'no-self-compare': 'error',
    'no-use-before-define': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    // Layout & Formatting
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true,
      },
    ],
    semi: 'warn',
    curly: 2,
    indent: [
      'warn',
      2,
      {
        MemberExpression: 1,
        SwitchCase: 1,
        ignoredNodes: [
          'FunctionExpression > .params[decorators.length > 0]',
          'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
          'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
        ],
      },
    ],
    'no-multi-spaces': 'warn',
    'no-multiple-empty-lines': 'warn',
    'space-in-parens': 'warn',
    'no-trailing-spaces': 'warn',
    'array-element-newline': [
      'warn',
      {
        ArrayExpression: 'consistent',
        ArrayPattern: { minItems: 3 },
      },
    ],
    'arrow-spacing': 'warn',
    'key-spacing': [
      'warn',
      {
        beforeColon: false,
        afterColon: true,
      },
    ],
    'keyword-spacing': [
      'warn',
      {
        before: true,
        after: true,
      },
    ],
    'new-parens': ['warn', 'always'],
    'padding-line-between-statements': [
      'warn',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
    ],
    'rest-spread-spacing': ['warn', 'never'],
    quotes: ['warn', 'single'],
    'template-curly-spacing': ['warn', 'never'],
    'max-lines-per-function': ['warn', { max: 50, skipComments: true, skipBlankLines: true }],
    'newline-per-chained-call': ['warn', { ignoreChainWithDepth: 3 }],
  },
};