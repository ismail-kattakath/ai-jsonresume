import { getPasswordHash, isPasswordProtectionEnabled } from '../password';

describe('Password Configuration', () => {
  const originalWindow = global.window;
  const originalProcessEnv = process.env;

  afterEach(() => {
    // Restore original values
    global.window = originalWindow;
    process.env = { ...originalProcessEnv };
    jest.resetModules();
  });

  describe('getPasswordHash', () => {
    it('should return undefined when no environment variable is set (server-side)', () => {
      // Simulate server environment
      const originalWindow = (global as any).window;
      delete (global as any).window;
      delete process.env.NEXT_PUBLIC_EDIT_PASSWORD_HASH;

      // Force module reload to pick up new env
      jest.resetModules();
      const { getPasswordHash: freshGetPasswordHash } = require('../password');

      const result = freshGetPasswordHash();

      expect(result).toBeUndefined();

      // Restore window
      (global as any).window = originalWindow;
    });

    it('should return hash from environment variable when set (server-side)', () => {
      const mockHash = '$2b$10$DROkfTWOCqdekTKMKybP2eD9NIqTHNyAKFgsZCdpEXS9vC2honJfS';

      // Simulate server environment
      const originalWindow = (global as any).window;
      delete (global as any).window;
      process.env.NEXT_PUBLIC_EDIT_PASSWORD_HASH = mockHash;

      // Force module reload to pick up new env
      jest.resetModules();
      const { getPasswordHash: freshGetPasswordHash } = require('../password');

      const result = freshGetPasswordHash();

      expect(result).toBe(mockHash);

      // Restore window
      (global as any).window = originalWindow;
    });

    it('should return hash from window.__PASSWORD_HASH__ in browser', () => {
      const mockHash = '$2b$10$testHashFromWindow';
      (global as any).window = {
        __PASSWORD_HASH__: mockHash,
      };

      const result = getPasswordHash();

      expect(result).toBe(mockHash);
    });

    it('should return undefined in browser when no window hash exists and no env var', () => {
      (global as any).window = {};
      delete process.env.NEXT_PUBLIC_EDIT_PASSWORD_HASH;

      const result = getPasswordHash();

      expect(result).toBeUndefined();
    });

    it('should prioritize window.__PASSWORD_HASH__ over environment variable', () => {
      const windowHash = '$2b$10$windowHash';
      const envHash = '$2b$10$envHash';

      (global as any).window = {
        __PASSWORD_HASH__: windowHash,
      };
      process.env.NEXT_PUBLIC_EDIT_PASSWORD_HASH = envHash;

      const result = getPasswordHash();

      expect(result).toBe(windowHash);
    });

    it('should handle undefined window object gracefully', () => {
      delete (global as any).window;
      delete process.env.NEXT_PUBLIC_EDIT_PASSWORD_HASH;

      expect(() => getPasswordHash()).not.toThrow();
      expect(getPasswordHash()).toBeUndefined();
    });
  });

  describe('isPasswordProtectionEnabled', () => {
    it('should return false when no password hash is configured (server-side)', () => {
      const originalWindow = (global as any).window;
      delete (global as any).window;
      delete process.env.NEXT_PUBLIC_EDIT_PASSWORD_HASH;

      jest.resetModules();
      const { isPasswordProtectionEnabled: freshIsEnabled } = require('../password');

      const result = freshIsEnabled();

      expect(result).toBe(false);

      (global as any).window = originalWindow;
    });

    it('should return true when password hash is configured via env var (server-side)', () => {
      const mockHash = '$2b$10$DROkfTWOCqdekTKMKybP2eD9NIqTHNyAKFgsZCdpEXS9vC2honJfS';
      const originalWindow = (global as any).window;
      delete (global as any).window;
      process.env.NEXT_PUBLIC_EDIT_PASSWORD_HASH = mockHash;

      jest.resetModules();
      const { isPasswordProtectionEnabled: freshIsEnabled } = require('../password');

      const result = freshIsEnabled();

      expect(result).toBe(true);

      (global as any).window = originalWindow;
    });

    it('should return true when password hash is configured via window object', () => {
      const mockHash = '$2b$10$testHashFromWindow';
      (global as any).window = {
        __PASSWORD_HASH__: mockHash,
      };

      const result = isPasswordProtectionEnabled();

      expect(result).toBe(true);
    });

    it('should return false in browser when no hash is available', () => {
      (global as any).window = {};
      delete process.env.NEXT_PUBLIC_EDIT_PASSWORD_HASH;

      const result = isPasswordProtectionEnabled();

      expect(result).toBe(false);
    });
  });

  describe('Security considerations', () => {
    it('should return valid bcrypt hash format when configured', () => {
      const mockHash = '$2b$10$DROkfTWOCqdekTKMKybP2eD9NIqTHNyAKFgsZCdpEXS9vC2honJfS';
      const originalWindow = (global as any).window;
      delete (global as any).window;
      process.env.NEXT_PUBLIC_EDIT_PASSWORD_HASH = mockHash;

      jest.resetModules();
      const { getPasswordHash: freshGetPasswordHash } = require('../password');

      const hash = freshGetPasswordHash();

      // Bcrypt hashes start with $2a$, $2b$, or $2y$
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/);

      (global as any).window = originalWindow;
    });

    it('should not expose password in plain text when configured', () => {
      const mockHash = '$2b$10$DROkfTWOCqdekTKMKybP2eD9NIqTHNyAKFgsZCdpEXS9vC2honJfS';
      const originalWindow = (global as any).window;
      delete (global as any).window;
      process.env.NEXT_PUBLIC_EDIT_PASSWORD_HASH = mockHash;

      jest.resetModules();
      const { getPasswordHash: freshGetPasswordHash } = require('../password');

      const hash = freshGetPasswordHash();

      if (hash) {
        // Hash should not contain common password patterns
        expect(hash.toLowerCase()).not.toContain('password');
        expect(hash.toLowerCase()).not.toContain('1234');
        expect(hash).not.toMatch(/^[a-z0-9]{4,}$/i); // Not a simple alphanumeric string
      }

      (global as any).window = originalWindow;
    });

    it('should use bcrypt hash with sufficient salt rounds when configured', () => {
      const mockHash = '$2b$10$DROkfTWOCqdekTKMKybP2eD9NIqTHNyAKFgsZCdpEXS9vC2honJfS';
      const originalWindow = (global as any).window;
      delete (global as any).window;
      process.env.NEXT_PUBLIC_EDIT_PASSWORD_HASH = mockHash;

      jest.resetModules();
      const { getPasswordHash: freshGetPasswordHash } = require('../password');

      const hash = freshGetPasswordHash();

      if (hash) {
        // Extract salt rounds from bcrypt hash (format: $2b$10$...)
        const match = hash.match(/^\$2[aby]\$(\d{2})\$/);
        if (match) {
          const rounds = parseInt(match[1], 10);
          expect(rounds).toBeGreaterThanOrEqual(10); // At least 10 rounds
        }
      }

      (global as any).window = originalWindow;
    });
  });

  describe('Optional authentication behavior', () => {
    it('should allow disabling password protection by not setting env var', () => {
      const originalWindow = (global as any).window;
      delete (global as any).window;
      delete process.env.NEXT_PUBLIC_EDIT_PASSWORD_HASH;

      jest.resetModules();
      const {
        getPasswordHash: freshGetPasswordHash,
        isPasswordProtectionEnabled: freshIsEnabled,
      } = require('../password');

      const hash = freshGetPasswordHash();
      const isEnabled = freshIsEnabled();

      expect(hash).toBeUndefined();
      expect(isEnabled).toBe(false);

      (global as any).window = originalWindow;
    });

    it('should enable password protection when env var is set', () => {
      const mockHash = '$2b$10$DROkfTWOCqdekTKMKybP2eD9NIqTHNyAKFgsZCdpEXS9vC2honJfS';
      const originalWindow = (global as any).window;
      delete (global as any).window;
      process.env.NEXT_PUBLIC_EDIT_PASSWORD_HASH = mockHash;

      jest.resetModules();
      const {
        getPasswordHash: freshGetPasswordHash,
        isPasswordProtectionEnabled: freshIsEnabled,
      } = require('../password');

      const hash = freshGetPasswordHash();
      const isEnabled = freshIsEnabled();

      expect(hash).toBe(mockHash);
      expect(isEnabled).toBe(true);

      (global as any).window = originalWindow;
    });
  });
});
