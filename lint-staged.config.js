module.exports = {
  "*.{html,md,scss,yaml,yml}": "prettier -l",
  "*.js": ["prettier -l", "eslint"],
};
