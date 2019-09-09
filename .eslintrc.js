/* eslint-disable-file */
/* eslint spellcheck/spell-checker:0 */
module.exports = {
  root: true,
  extends: ['eslint:recommended', 'standard', 'prettier', 'prettier/standard'],
  plugins: ['class-property'],
  rules: {
    'no-var': 2,
    'prefer-const': 2,
    'no-debugger': 2,
    'no-console': [2, { allow: ['info', 'error'] }],
    'import/no-extraneous-dependencies': 2,
  },
}
