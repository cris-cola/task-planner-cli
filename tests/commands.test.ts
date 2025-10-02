import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { executeCommand } from '../src/commands';
import { getTasks, initializeJsonStore } from '../src/store';
import { Status } from '../src/types';

describe('Commands Module', () => {
  const testFilename = path.join(process.cwd(), 'store.commands.test.json');

  beforeEach(() => {
    process.env.TASK_STORE_PATH = testFilename;
    if (fs.existsSync(testFilename)) {
      fs.unlinkSync(testFilename);
    }
    initializeJsonStore();
  });
  
  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(testFilename)) {
      fs.unlinkSync(testFilename);
    }
    delete process.env.TASK_STORE_PATH;
  });

  describe('Add Command', () => {
    it('should add a new task', () => {
      executeCommand(['add', 'Test task description']);
      
      const tasks = getTasks();
      assert.strictEqual(tasks.length, 1);
      assert.strictEqual(tasks[0].description, 'Test task description');
      assert.strictEqual(tasks[0].status, Status.Todo);
      assert.strictEqual(tasks[0].id, 1);
    });

    it('should add multiple tasks with incremental IDs', () => {
      executeCommand(['add', 'First task']);
      executeCommand(['add', 'Second task']);
      
      const tasks = getTasks();
      assert.strictEqual(tasks.length, 2);
      assert.strictEqual(tasks[0].id, 1);
      assert.strictEqual(tasks[1].id, 2);
      assert.strictEqual(tasks[0].description, 'First task');
      assert.strictEqual(tasks[1].description, 'Second task');
    });
  });

  describe('List Command', () => {
    it('should list all tasks when no filter provided', () => {
      executeCommand(['add', 'Task 1']);
      executeCommand(['add', 'Task 2']);
      executeCommand(['mark-in-progress', '1']);
      
      // This test mainly checks that the command executes without error
      // Output testing would require capturing console.log
      assert.doesNotThrow(() => executeCommand(['list']));
    });

    it('should list tasks by status filter', () => {
      executeCommand(['add', 'Todo task']);
      executeCommand(['add', 'Another task']);
      executeCommand(['mark-done', '2']);
      
      // Test that filtering commands execute without error
      assert.doesNotThrow(() => executeCommand(['list', 'todo']));
      assert.doesNotThrow(() => executeCommand(['list', 'done']));
      assert.doesNotThrow(() => executeCommand(['list', 'in-progress']));
    });
  });

  describe('Delete Command', () => {
    it('should delete existing task', () => {
      executeCommand(['add', 'Task to delete']);
      executeCommand(['add', 'Task to keep']);
      
      executeCommand(['delete', '1']);
      
      const tasks = getTasks();
      assert.strictEqual(tasks.length, 1);
      assert.strictEqual(tasks[0].description, 'Task to keep');
      assert.strictEqual(tasks[0].id, 2);
    });

    it('should throw error for non-existent task', () => {
      assert.throws(() => executeCommand(['delete', '999']), /not found/);
    });
  });

  describe('Update Command', () => {
    it('should update task description', () => {
      executeCommand(['add', 'Original description']);
      executeCommand(['update', '1', 'Updated description']);
      
      const tasks = getTasks();
      assert.strictEqual(tasks.length, 1);
      assert.strictEqual(tasks[0].description, 'Updated description');
    });

    it('should throw error for non-existent task', () => {
      assert.throws(() => executeCommand(['update', '999', 'New description']), /not found/);
    });
  });

  describe('Mark Status Commands', () => {
    it('should mark task as in-progress', () => {
      executeCommand(['add', 'Test task']);
      executeCommand(['mark-in-progress', '1']);
      
      const tasks = getTasks();
      assert.strictEqual(tasks[0].status, Status.InProgress);
    });

    it('should mark task as done', () => {
      executeCommand(['add', 'Test task']);
      executeCommand(['mark-done', '1']);
      
      const tasks = getTasks();
      assert.strictEqual(tasks[0].status, Status.Done);
    });

    it('should throw error for non-existent task', () => {
      assert.throws(() => executeCommand(['mark-done', '999']), /not found/);
      assert.throws(() => executeCommand(['mark-in-progress', '999']), /not found/);
    });
  });
});
