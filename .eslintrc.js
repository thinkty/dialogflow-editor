module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "react/forbid-prop-types": 'off',
    "react/jsx-filename-extension": [1, { extensions: ['.js', '.jsx'] }],
    "react/jsx-fragments": 'off',
    "react/prefer-stateless-function": 'off',
    "import/no-extraneous-dependencies": 'off',
    "import/no-unresolved": 'off',
    "import/extensions": 'off',
    "no-unused-vars": 'off',
  },
  settings: {
    react: {
      version: 'latest'
    }
  }
};
