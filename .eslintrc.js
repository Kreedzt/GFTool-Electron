module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'no-extra-semi': 'error',
    'comma-dangle': 'off',
    'implicit-arrow-linebreak': 'off',
    'arrow-parens': 'off',
    'no-new': 'off',
    'object-curly-newline': 'off'
  }
};
