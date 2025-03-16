import type { JestConfigWithTsJest } from 'ts-jest';
import { createJsWithBabelPreset } from 'ts-jest';

const defaultTransform = createJsWithBabelPreset({
  tsconfig: '<rootDir>/tsconfig.test.json',
});

const esModules: string[] = [];

const config: JestConfigWithTsJest = {
  transform: {
    '\\.m?js$': [
      'babel-jest',
      { presets: [['@babel/preset-env', { targets: { node: 'current' } }]] },
    ],
    ...defaultTransform.transform,
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|css|scss|sass)$': 'identity-obj-proxy',
    '\\.module\\.(css|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.svg$': '<rootDir>/__mocks__/svgComponentMock.js',
    '\\.svg\\?url$': '<rootDir>/__mocks__/svgUrlMock.js',
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
    '<rootDir>/src/setupTests.ts',
  ],
  transformIgnorePatterns: [`node_modules/.pnpm/(?!(${esModules.join('|')})@)`],
};

export default config;
