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
  'extends': [
    'google',
  ],
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  'rules': {
    'max-len': 'off',
    'valid-jsdoc': 'off',
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
