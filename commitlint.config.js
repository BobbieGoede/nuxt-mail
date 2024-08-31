export default {
  extends: ["@commitlint/config-conventional"],
  ignores: [(commit) => commit.startsWith("release:")],
  rules: {
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
};
