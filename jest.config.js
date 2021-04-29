/**
 * jest config
 */

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.js"
  ],
  moduleFileExtensions: [
    "js"
  ],
  setupFilesAfterEnv: [
    "./jest.setup.js"
  ],
  transformIgnorePatterns: [
    "/node_modules/",
  ],
  testMatch: ["<rootDir>/tests/**/*.(spec|test).js"],
  transform: {
    "\\.[jt]sx?$": "babel-jest"
  }
};
