import fs from 'fs';
import '@types/jest';

import { beforeEach, afterEach } from 'node:test';

// Setup test environment
beforeEach(() => {
  const testFiles = ['test-store.json', 'store.json'];
  testFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
});

afterEach(() => {
  const testFiles = ['test-store.json', 'store.json'];
  testFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
});