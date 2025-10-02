import { describe, it } from 'node:test';
import assert from 'node:assert';
import { tryParseInt, colorizeGreen, colorizeRed } from '../src/utils';

describe('Utils Module', () => {
  describe('tryParseInt', () => {
    it('should parse valid integer strings', () => {
      assert.strictEqual(tryParseInt('123'), 123);
      assert.strictEqual(tryParseInt('0'), 0);
    });

    it('should throw for invalid strings', () => {
      ['abc', '12.5', '', '  ', '-5'].forEach(value => {
        assert.throws(() => tryParseInt(value), /Invalid task id/);
      });
    });

    it('should handle edge cases', () => {
      assert.throws(() => tryParseInt('123abc'), /Invalid task id/);
      assert.strictEqual(tryParseInt('  123  '), 123);
    });
  });

  describe('Color Functions', () => {
    it('should add green color codes', () => {
      const result = colorizeGreen('test');
      assert.ok(result.includes('test'));
      assert.ok(result.includes('\x1b[32m')); // Green color code
      assert.ok(result.includes('\x1b[0m'));  // Reset code
    });

    it('should add red color codes', () => {
      const result = colorizeRed('error');
      assert.ok(result.includes('error'));
      assert.ok(result.includes('\x1b[31m')); // Red color code
      assert.ok(result.includes('\x1b[0m'));  // Reset code
    });
  });
});
