module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single']
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
      rules: {
        'no-console': 'off'
      }
    }
  ],
  globals: {
    'document': 'readonly',
    'window': 'readonly',
    'localStorage': 'readonly',
    'alert': 'readonly',
    'confirm': 'readonly'
  }
};