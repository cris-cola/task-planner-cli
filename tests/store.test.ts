import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { getTasks, writeTasksToFile, initializeJsonStore } from '../src/store';
import { Task, Status } from '../src/types';

describe('Store Module', () => {
  const testFilename = path.join(process.cwd(), 'store.module.test.json');

  beforeEach(() => {
    process.env.TASK_STORE_PATH = testFilename;
    if (fs.existsSync(testFilename)) {
      fs.unlinkSync(testFilename);
    }
  });
  
  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(testFilename)) {
      fs.unlinkSync(testFilename);
    }
    delete process.env.TASK_STORE_PATH;
  });

  describe('initializeJsonStore', () => {
    it('should create store.json file if it does not exist', () => {
      assert.strictEqual(fs.existsSync(testFilename), false);
      
      initializeJsonStore();
      
      assert.strictEqual(fs.existsSync(testFilename), true);
      const content = fs.readFileSync(testFilename, 'utf8');
      assert.deepStrictEqual(JSON.parse(content), []);
    });
  });

  describe('getTasks', () => {
    it('should return empty array when store file does not exist', () => {
      const tasks = getTasks();
      assert.deepStrictEqual(tasks, []);
    });

    it('should return empty array when store file is empty', () => {
      fs.writeFileSync(testFilename, '[]');
      const tasks = getTasks();
      assert.deepStrictEqual(tasks, []);
    });
  });

  describe('writeTasksToFile', () => {
    it('should write tasks to file', () => {
      const testTasks: Task[] = [{
        id: 1,
        description: 'Write test',
        status: Status.Todo,
        createdAt: new Date(),
        updatedAt: new Date()
      }];

      writeTasksToFile(testTasks);
      
      assert.strictEqual(fs.existsSync(testFilename), true);
      
      const savedTasks = JSON.parse(fs.readFileSync(testFilename, 'utf8'));
      assert.strictEqual(savedTasks.length, 1);
      assert.strictEqual(savedTasks[0].description, 'Write test');
    });
  });
});
