module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "prettier"],
  overrides: [
    {
      files: [".eslintrc.js", "jest.config.js", "webpack.config.js"],
      env: {
        commonjs: true,
        node: true,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {},
  ignorePatterns: ["/dist/**/*.js"],
};
