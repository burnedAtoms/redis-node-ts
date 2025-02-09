/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  extensionsToTreatAsEsm: ['.ts'],
  verbose: true,
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }]
  },
  // testPathIgnorePatterns: ['./dist']
};

export default config;
