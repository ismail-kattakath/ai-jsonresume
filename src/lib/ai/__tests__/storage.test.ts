import { loadCredentials, saveCredentials } from '../storage'

// Mock encryption with very simple implementation
jest.mock('@/lib/utils/encryption', () => ({
    encryptData: jest.fn().mockImplementation((data) => Promise.resolve(`enc-${data}`)),
    decryptData: jest.fn().mockImplementation((data) => {
        if (typeof data !== 'string') return Promise.reject(new Error('Invalid data'))
        return Promise.resolve(data.replace('enc-', ''))
    }),
    generateVaultKey: jest.fn().mockReturnValue('vault-key')
}))

describe('storage', () => {
    beforeEach(() => {
        localStorage.clear()
        jest.clearAllMocks()
    })

    it('should save and get AI credentials', async () => {
        const creds = { apiKey: 'test-key', providerKeys: {}, rememberCredentials: true }
        await saveCredentials(creds as any)
        const loaded = await loadCredentials()
        expect(loaded).toBeDefined()
        expect(loaded?.apiKey).toBe('test-key')
    })

    it('should return null if none saved', async () => {
        const loaded = await loadCredentials()
        expect(loaded).toBeNull()
    })

    it('should handle decryption errors gracefully', async () => {
        const { decryptData } = require('@/lib/utils/encryption')
        decryptData.mockRejectedValueOnce(new Error('Decryption failed'))

        const creds = { apiKey: 'test-key', providerKeys: {}, rememberCredentials: true }
        await saveCredentials(creds as any)
        const loaded = await loadCredentials()
        expect(loaded?.apiKey).toBe('') // Reset to empty on failure
    })
})
