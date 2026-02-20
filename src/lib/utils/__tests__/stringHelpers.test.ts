import { splitTextIntoSentences } from '../stringHelpers'

describe('stringHelpers - splitTextIntoSentences', () => {
    it('should return an empty array for empty input', () => {
        expect(splitTextIntoSentences('')).toEqual([])
        expect(splitTextIntoSentences(null as any)).toEqual([])
        expect(splitTextIntoSentences(undefined as any)).toEqual([])
    })

    it('should split simple sentences', () => {
        const text = 'Hello world. How are you?'
        expect(splitTextIntoSentences(text)).toEqual(['Hello world.', 'How are you?'])
    })

    it('should split sentences with exclamation marks', () => {
        const text = 'Stop! Hammer time.'
        expect(splitTextIntoSentences(text)).toEqual(['Stop!', 'Hammer time.'])
    })

    it('should handle multiple spaces', () => {
        const text = 'Sentence one.   Sentence two.'
        expect(splitTextIntoSentences(text)).toEqual(['Sentence one.', 'Sentence two.'])
    })

    it('should handle newlines', () => {
        const text = 'Sentence one.\nSentence two.\r\nSentence three.'
        expect(splitTextIntoSentences(text)).toEqual([
            'Sentence one.',
            'Sentence two.',
            'Sentence three.',
        ])
    })

    it('should NOT split on mid-sentence decimals', () => {
        const text = 'The version is 1.5 grams. It works well.'
        expect(splitTextIntoSentences(text)).toEqual([
            'The version is 1.5 grams.',
            'It works well.',
        ])
    })

    it('should NOT split on common abbreviations', () => {
        const text = 'Mr. Smith went to Dr. Jones. It was a nice day.'
        expect(splitTextIntoSentences(text)).toEqual([
            'Mr. Smith went to Dr. Jones.',
            'It was a nice day.',
        ])
    })

    it('should handle ellipses correctly', () => {
        const text = 'Thinking... maybe tomorrow. Let us see.'
        expect(splitTextIntoSentences(text)).toEqual([
            'Thinking... maybe tomorrow.',
            'Let us see.',
        ])
    })

    it('should handle sentences ending with quotes', () => {
        const text = 'He said, "Hello." Then he left.'
        expect(splitTextIntoSentences(text)).toEqual([
            'He said, "Hello."',
            'Then he left.',
        ])
    })

    it('should handle URLs', () => {
        const text = 'Visit https://example.com for more info. It is great.'
        expect(splitTextIntoSentences(text)).toEqual([
            'Visit https://example.com for more info.',
            'It is great.',
        ])
    })

    it('should handle messy input with multiple dots', () => {
        const text = 'Too many dots.... Still one sentence.'
        expect(splitTextIntoSentences(text)).toEqual(['Too many dots.', 'Still one sentence.'])
    })

    describe('User provided scenarios', () => {
        it('should NOT split on commas', () => {
            const text = 'Sentence 1, Sentense 2, sentense 3'
            expect(splitTextIntoSentences(text)).toEqual(['Sentence 1, Sentense 2, sentense 3'])
        })

        it('should handle etc. followed by a comma', () => {
            const text = 'Sentence 1, Sentense 2 etc., sentense 3'
            expect(splitTextIntoSentences(text)).toEqual(['Sentence 1, Sentense 2 etc., sentense 3'])
        })

        it('should handle etc. at the end of a line', () => {
            const text = 'Sentence 1\nSentense 2 etc.\nsentense 3'
            expect(splitTextIntoSentences(text)).toEqual([
                'Sentence 1',
                'Sentense 2 etc.',
                'sentense 3',
            ])
        })

        it('should handle double dots and etc.', () => {
            const text = 'Sentence 1.\nSentense 2 etc..\nsentense 3.'
            expect(splitTextIntoSentences(text)).toEqual([
                'Sentence 1.',
                'Sentense 2 etc..',
                'sentense 3.',
            ])
        })

        it('should handle list items correctly', () => {
            const text = '- Sentence 1\n- Sentense 2 etc.\n- sentense 3'
            expect(splitTextIntoSentences(text)).toEqual([
                '- Sentence 1',
                '- Sentense 2 etc.',
                '- sentense 3',
            ])
        })

        it('should handle commas without spaces', () => {
            const text = 'Sentence 1,Sentense 2, sentense 3'
            expect(splitTextIntoSentences(text)).toEqual(['Sentence 1,Sentense 2, sentense 3'])
        })

        it('should handle etc. with commas and newlines', () => {
            const text = 'Sentence 1,Sentense 2 etc.\nsentense 3'
            expect(splitTextIntoSentences(text)).toEqual([
                'Sentence 1,Sentense 2 etc.',
                'sentense 3',
            ])
        })

        it('should handle etc. with spaces and newlines', () => {
            const text = 'Sentence 1, Sentense 2 etc.\nsentense 3'
            expect(splitTextIntoSentences(text)).toEqual([
                'Sentence 1, Sentense 2 etc.',
                'sentense 3',
            ])
        })

        it('should handle etc. with dots and commas', () => {
            const text = 'Sentence 1.\nSentense 2 etc., sentense 3.'
            expect(splitTextIntoSentences(text)).toEqual([
                'Sentence 1.',
                'Sentense 2 etc., sentense 3.',
            ])
        })
    })
})
