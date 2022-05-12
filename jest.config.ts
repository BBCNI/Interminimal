import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/demo/"],
  collectCoverage: true,
  coverageThreshold: {
    global: { branches: 100, functions: 100, lines: 100, statements: 100 }
  }
};

export default config;
