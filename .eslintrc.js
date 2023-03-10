module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es2022": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "overrides": [
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "plugins": [
    "vue",
    "@typescript-eslint",
    "prettier",
  ],
  "rules": {
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-non-null-asserted-optional-chain": 1
  }
}
