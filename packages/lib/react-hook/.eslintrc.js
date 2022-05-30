module.exports = {

  'env': {
    'browser': true,
    'es6': true,
    'node': true,
  },
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parser': '@typescript-eslint/parser',
  'settings': {
    'react': {
      version: 'detect',
    },
  },
  'extends': [
    'google',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true,
    },
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
  ],
  'rules': {
    'max-len': 'off',
    'react/prop-types': 0,
    'valid-jsdoc': 'off',
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'error', // Checks effect dependencies
    'new-cap': 'off',
    'no-invalid-this': 'off',
    'camelcase': 'off',
    '@typescript-eslint/no-unused-vars' : [ 'error' ],
    "linebreak-style":"off"
  },
  'ignorePatterns': [
    "**/*.js",
  ],
};
