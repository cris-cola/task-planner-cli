import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateCommand } from '../src/validation';

describe('CLI Validation', () => {
  it('should parse valid command and args', () => {
    const cases = [
      { argv: ['node', 'script', 'add', 'Task1'], cmd: 'add', args: ['Task1'] },
      { argv: ['node', 'script', 'delete', '42'], cmd: 'delete', args: ['42'] },
      { argv: ['node', 'script', 'update', '7', 'Desc'], cmd: 'update', args: ['7', 'Desc'] },
      { argv: ['node', 'script', 'mark-done', '3'], cmd: 'mark-done', args: ['3'] },
      { argv: ['node', 'script', 'mark-in-progress', '5'], cmd: 'mark-in-progress', args: ['5'] },
      { argv: ['node', 'script', 'list'], cmd: 'list', args: [] },
      { argv: ['node', 'script', 'list', 'todo'], cmd: 'list', args: ['todo'] }
    ];
    cases.forEach(({ argv, cmd, args }) => {
      const res = validateCommand(argv);
      assert.strictEqual(res.command, cmd);
      assert.deepStrictEqual(res.args, args);
    });
  });

  it('should throw on missing command', () => {
    assert.throws(() => validateCommand(['node', 'script']), /Missing command/);
  });

  it('should throw on unsupported command', () => {
    assert.throws(() => validateCommand(['node', 'script', 'foo']), /Unsupported command/);
  });

  it('should throw on missing args for required command', () => {
    assert.throws(() => validateCommand(['node', 'script', 'delete']), /Invalid arguments for 'delete'/);
  });

  it('should throw on invalid numeric argument', () => {
    assert.throws(() => validateCommand(['node', 'script', 'delete', 'abc']), /Invalid task id/);
  });

  it('should throw on invalid status argument', () => {
    assert.throws(() => validateCommand(['node', 'script', 'mark-done', '1', 'badstatus']), /Invalid arguments/);
  });

  it('should allow optional status argument in list', () => {
    const res = validateCommand(['node', 'script', 'list', 'done']);
    assert.strictEqual(res.command, 'list');
    assert.deepStrictEqual(res.args, ['done']);
  });

  it('should work list with no args', () => {
    const res = validateCommand(['node', 'script', 'list']);
    assert.strictEqual(res.command, 'list');
    assert.deepStrictEqual(res.args, []);
  });
});
