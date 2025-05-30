import type { Config } from 'jest';
import { copyFileSync, existsSync } from 'fs';

if (process.env.NODE_ENV === 'test') {
  const source = '.babelrc.test';
  const destination = '.babelrc';
  if (existsSync(source)) {
    copyFileSync(source, destination);
  }
}

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)']
};

export default config;
