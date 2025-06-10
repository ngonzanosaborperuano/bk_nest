export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json"],
  rootDir: "./",
  testRegex: ".*\\.spec\\.ts$",
  coverageDirectory: "./coverage",
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
