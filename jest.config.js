/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        jsx: "react-jsx",
      },
    ],
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/src/__tests__/analytics.test.ts",
    "<rootDir>/src/__tests__/api.test.ts",
  ],

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

module.exports = config;