import {
  stripProtocol,
  ensureProtocol,
  formatUrl,
  normalizeUrlForDisplay,
  normalizeUrlForExternal,
} from '@/lib/utils/urlHelpers'

describe('urlHelpers', () => {
  describe('stripProtocol', () => {
    it('should remove https:// protocol', () => {
      expect(stripProtocol('https://example.com')).toBe('example.com')
    })

    it('should remove http:// protocol', () => {
      expect(stripProtocol('http://example.com')).toBe('example.com')
    })

    it('should leave URL without protocol unchanged', () => {
      expect(stripProtocol('example.com')).toBe('example.com')
    })

    it('should handle empty string', () => {
      expect(stripProtocol('')).toBe('')
    })

    it('should handle URL with path', () => {
      expect(stripProtocol('https://example.com/path')).toBe('example.com/path')
    })

    it('should handle URL with query parameters', () => {
      expect(stripProtocol('https://example.com?query=value')).toBe(
        'example.com?query=value'
      )
    })
  })

  describe('ensureProtocol', () => {
    it('should add https:// protocol by default', () => {
      expect(ensureProtocol('example.com')).toBe('https://example.com')
    })

    it('should add http:// protocol when specified', () => {
      expect(ensureProtocol('example.com', 'http')).toBe('http://example.com')
    })

    it('should leave https:// URL unchanged', () => {
      expect(ensureProtocol('https://example.com')).toBe('https://example.com')
    })

    it('should leave http:// URL unchanged', () => {
      expect(ensureProtocol('http://example.com')).toBe('http://example.com')
    })

    it('should handle empty string', () => {
      expect(ensureProtocol('')).toBe('')
    })

    it('should handle URL with path', () => {
      expect(ensureProtocol('example.com/path')).toBe(
        'https://example.com/path'
      )
    })

    it('should handle URL with query parameters', () => {
      expect(ensureProtocol('example.com?query=value')).toBe(
        'https://example.com?query=value'
      )
    })
  })

  describe('formatUrl', () => {
    it('should add http:// protocol to URL without protocol', () => {
      expect(formatUrl('example.com')).toBe('http://example.com')
    })

    it('should leave https:// URL unchanged', () => {
      expect(formatUrl('https://example.com')).toBe('https://example.com')
    })

    it('should leave http:// URL unchanged', () => {
      expect(formatUrl('http://example.com')).toBe('http://example.com')
    })

    it('should handle empty string', () => {
      expect(formatUrl('')).toBe('')
    })

    it('should handle URL with path', () => {
      expect(formatUrl('example.com/path')).toBe('http://example.com/path')
    })
  })

  describe('normalizeUrlForDisplay', () => {
    it('should remove https:// protocol', () => {
      expect(normalizeUrlForDisplay('https://example.com')).toBe('example.com')
    })

    it('should remove http:// protocol', () => {
      expect(normalizeUrlForDisplay('http://example.com')).toBe('example.com')
    })

    it('should leave URL without protocol unchanged', () => {
      expect(normalizeUrlForDisplay('example.com')).toBe('example.com')
    })

    it('should handle empty string', () => {
      expect(normalizeUrlForDisplay('')).toBe('')
    })

    it('should handle URL with subdomain', () => {
      expect(normalizeUrlForDisplay('https://www.example.com')).toBe(
        'www.example.com'
      )
    })
  })

  describe('normalizeUrlForExternal', () => {
    it('should add https:// protocol to URL without protocol', () => {
      expect(normalizeUrlForExternal('example.com')).toBe('https://example.com')
    })

    it('should leave https:// URL unchanged', () => {
      expect(normalizeUrlForExternal('https://example.com')).toBe(
        'https://example.com'
      )
    })

    it('should leave http:// URL unchanged', () => {
      expect(normalizeUrlForExternal('http://example.com')).toBe(
        'http://example.com'
      )
    })

    it('should handle empty string', () => {
      expect(normalizeUrlForExternal('')).toBe('')
    })

    it('should handle URL with path and query', () => {
      expect(normalizeUrlForExternal('example.com/path?query=value')).toBe(
        'https://example.com/path?query=value'
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle URLs with ports', () => {
      expect(stripProtocol('https://example.com:3000')).toBe('example.com:3000')
      expect(ensureProtocol('example.com:3000')).toBe(
        'https://example.com:3000'
      )
    })

    it('should handle localhost URLs', () => {
      expect(stripProtocol('http://localhost:3000')).toBe('localhost:3000')
      expect(ensureProtocol('localhost:3000')).toBe('https://localhost:3000')
    })

    it('should handle URLs with username and password', () => {
      expect(stripProtocol('https://user:pass@example.com')).toBe(
        'user:pass@example.com'
      )
      expect(ensureProtocol('user:pass@example.com')).toBe(
        'https://user:pass@example.com'
      )
    })

    it('should handle URLs with hash fragments', () => {
      expect(stripProtocol('https://example.com#section')).toBe(
        'example.com#section'
      )
      expect(ensureProtocol('example.com#section')).toBe(
        'https://example.com#section'
      )
    })
  })
})
