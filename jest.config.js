module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.js"],
};
