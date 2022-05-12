import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/demo/"]
};
export default config;
