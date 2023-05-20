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
  "@root/*": ["./src/*"],
};

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: "<rootDir>" }),
};
