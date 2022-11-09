module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
    commonjs: true,
  },
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'no-underscore-dangle': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'no-useless-constructor': ['warn'],
    'no-plusplus': ['error'],
    'prefer-template': ['error'],
    'jsx-quotes': ['error', 'prefer-single'],
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false,
      },
    ],
  },
};
