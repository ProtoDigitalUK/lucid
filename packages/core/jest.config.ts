/** @type {import('ts-jest').JestConfigWithTsJest} */
import { pathsToModuleNameMapper } from "ts-jest";

const paths = {
  "@controllers/*": ["./src/controllers/*"],
  "@middleware/*": ["./src/middleware/*"],
  "@routes/*": ["./src/routes/*"],
  "@services/*": ["./src/services/*"],
  "@utils/*": ["./src/utils/*"],
  "@data/*": ["./src/data/*"],
  "@db/*": ["./src/db/*"],
  "@schemas/*": ["./src/schemas/*"],
  "@root/*": ["./src/*"],
};

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: "<rootDir>" }),
  /*
  ignore:

      "./coverage",
    "./dist",
    "tests",
    "jest.config.ts",
    "./cms",
    "./node_modules",
    "./temp",
    "./.turbo",
    "./clear-db.ts"
*/
  testPathIgnorePatterns: [
    "./coverage",
    "./dist",
    "./cms",
    "./node_modules",
    "./temp",
    "./.turbo",
    "./clear-db.ts",
  ],
};
