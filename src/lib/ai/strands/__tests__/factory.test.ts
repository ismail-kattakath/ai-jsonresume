import { createModel } from '../factory'

describe('factory', () => {
    it('should create an openai-compatible model', () => {
        const model = createModel({ providerType: 'openai-compatible', apiKey: 'test', apiUrl: '', model: '' })
        expect(model).toBeDefined()
    })

    it('should create a gemini model', () => {
        const model = createModel({ providerType: 'gemini', apiKey: 'test', apiUrl: '', model: '' })
        expect(model).toBeDefined()
    })

    it('should fallback to openai if provider is unknown', () => {
        const model = createModel({ providerType: 'unknown' as any, apiKey: 'test', apiUrl: '', model: '' })
        expect(model).toBeDefined()
    })
})
