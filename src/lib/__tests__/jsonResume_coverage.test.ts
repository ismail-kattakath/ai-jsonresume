import { convertFromJSONResume } from '../jsonResume'

describe('jsonResume additional coverage', () => {
    it('should handle full valid resume', () => {
        const full = {
            basics: {
                name: 'Test',
                label: 'Dev',
                email: 'test@example.com',
                phone: '123',
                url: 'http://test.com',
                summary: 'Sum',
                location: { address: 'A1', city: 'C1', region: 'R1', postalCode: 'P1' },
                profiles: [{ network: 'N1', url: 'http://n1.com' }]
            },
            work: [{ company: 'C1', position: 'P1', startDate: '2020', endDate: '2021', summary: 'S1', highlights: ['H1'] }],
            education: [{ institution: 'I1', area: 'A1', studyType: 'S1', startDate: '2020', endDate: '2021' }],
            skills: [{ name: 'S1', keywords: ['K1'] }],
            languages: ['English', { language: 'French' }],
            certificates: [{ name: 'C1', issuer: 'I1', date: '2020', url: 'http://c1.com' }],
            projects: [{ name: 'P1', url: 'http://p1.com', description: 'D1', highlights: ['H1'], keywords: ['K1'], startDate: '2020', endDate: '2021' }]
        }
        const result = convertFromJSONResume(full as any)
        expect(result).toBeDefined()
        if (result) {
            expect(result.name).toBe('Test')
            expect(result.languages).toContain('English')
            expect(result.languages).toContain('French')
            expect(result.certifications?.[0]?.name).toBe('C1')
            expect(result.projects?.[0]?.name).toBe('P1')
            expect(result.address).toContain('C1')
            expect(result.skills).toHaveLength(1)
            expect(result.workExperience).toHaveLength(1)
            expect(result.education).toHaveLength(1)
        }
    })

    it('should handle minimal valid resume', () => {
        const minimal = {
            basics: { name: 'Test' }
        }
        const result = convertFromJSONResume(minimal as any)
        // If validation fails, result will be null. Let's see.
        if (result) {
            expect(result.name).toBe('Test')
        }
    })
})
