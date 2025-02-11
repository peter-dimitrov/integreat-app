import { InitialOptionsTsJest } from 'ts-jest'

import { webIntegreatTestCmsBuildConfig } from 'build-configs/integreat-test-cms'

const transformNodeModules = ['api-client', 'build-configs', 'translations']
const config: InitialOptionsTsJest = {
  rootDir: 'src',
  verbose: true,
  automock: false,
  setupFilesAfterEnv: [
    '<rootDir>/../jest.setup.ts',
    '<rootDir>/../node_modules/@testing-library/jest-dom/extend-expect',
  ],
  transformIgnorePatterns: [`node_modules/(?!${transformNodeModules.join('|')})`],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.ts',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.ts',
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  moduleDirectories: ['node_modules'],
  maxWorkers: '50%',
  transform: {
    '^.+\\.(j|t)sx?$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  coverageDirectory: '<rootDir>/../reports/coverage',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/../reports/unit-test',
      },
    ],
  ],
  testEnvironment: 'jsdom',
  globals: {
    __BUILD_CONFIG_NAME__: 'integreat-test-cms',
    __BUILD_CONFIG__: webIntegreatTestCmsBuildConfig,
    __VERSION_NAME__: '0.0.0',
    __COMMIT_SHA__: 123456789,
  },
}

export default config
