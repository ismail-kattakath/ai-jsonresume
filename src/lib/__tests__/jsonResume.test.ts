import { convertToJSONResume, convertFromJSONResume } from '../jsonResume'
import { ResumeData } from '@/types'

describe('jsonResume utility', () => {
  const mockResumeData: ResumeData = {
    name: 'John Doe',
    position: 'Software Engineer',
    contactInformation: '123-456-7890',
    email: 'john@example.com',
    address: '123 Fake St, Toronto, ON M5V 2L7, Canada',
    profilePicture: 'https://example.com/photo.jpg',
    summary: 'Experienced developer...',
    socialMedia: [
      { socialMedia: 'Github', link: 'github.com/johndoe' },
      { socialMedia: 'LinkedIn', link: 'linkedin.com/in/johndoe' },
      { socialMedia: 'Website', link: 'johndoe.com' }
    ],
    workExperience: [
      {
        organization: 'Tech Corp',
        position: 'Senior Dev',
        url: 'techcorp.com',
        startYear: '2020',
        endYear: 'Present',
        description: 'Working on stuff',
        keyAchievements: [{ text: 'Achievement 1' }],
        technologies: ['React', 'Node']
      }
    ],
    education: [
      {
        school: 'University of Toronto',
        area: 'Computer Science',
        studyType: 'Bachelor',
        startYear: '2016',
        endYear: '2020',
        url: 'utoronto.ca'
      }
    ],
    skills: [
      {
        title: 'Frontend',
        skills: [{ text: 'React' }, { text: 'TypeScript' }]
      }
    ],
    languages: ['English', 'French'],
    certifications: [
      { name: 'AWS Certified', issuer: 'Amazon', date: '2021', url: 'aws.com' }
    ],
    projects: [
      {
        name: 'Cool Project',
        description: 'A cool project',
        keyAchievements: [{ text: 'Done this' }],
        keywords: ['Next.js'],
        startYear: '2022',
        endYear: '2023',
        link: 'project.com'
      }
    ]
  }

  describe('convertToJSONResume', () => {
    it('converts basic info correctly', () => {
      const result = convertToJSONResume(mockResumeData)
      expect(result.basics.name).toBe('John Doe')
      expect(result.basics.label).toBe('Software Engineer')
      expect(result.basics.email).toBe('john@example.com')
    })

    it('parses address parts correctly including postal code and region', () => {
      const result = convertToJSONResume(mockResumeData)
      expect(result.basics.location.address).toBe('123 Fake St')
      expect(result.basics.location.city).toBe('Toronto')
      expect(result.basics.location.postalCode).toBe('M5V 2L7')
      expect(result.basics.location.region).toBe('ON')
    })

    it('handles work experience special cases (Present, highlights)', () => {
      const result = convertToJSONResume(mockResumeData)
      expect(result.work![0]!.endDate).toBe('')
      expect(result.work![0]!.highlights).toEqual(['Achievement 1'])
      expect(result.work![0]!.url).toBe('https://techcorp.com')
    })

    it('handles social media formatting (Github/LinkedIn cleanup)', () => {
      const result = convertToJSONResume(mockResumeData)
      const github = result.basics.profiles.find((p: any) => p.network === 'Github')
      const linkedin = result.basics.profiles.find((p: any) => p.network === 'LinkedIn')
      expect(github.username).toBe('johndoe')
      expect(linkedin.username).toBe('johndoe')
    })

    it('handles optional fields like certifications and projects', () => {
      const result = convertToJSONResume(mockResumeData)
      expect(result.certificates![0]!.name).toBe('AWS Certified')
      expect(result.projects![0]!.name).toBe('Cool Project')
    })
  })

  describe('convertFromJSONResume', () => {
    it('converts back basic info correctly', () => {
      const jsonResume = convertToJSONResume(mockResumeData)
      const result = convertFromJSONResume(jsonResume as any)
      expect(result?.name).toBe('John Doe')
      expect(result?.email).toBe('john@example.com')
    })

    it('reconstructs address string', () => {
      const jsonResume = convertToJSONResume(mockResumeData)
      const result = convertFromJSONResume(jsonResume as any)
      expect(result?.address).toContain('123 Fake St')
      expect(result?.address).toContain('Toronto')
      expect(result?.address).toContain('ON M5V 2L7')
    })

    it('handles skills keywords conversion', () => {
      const jsonResume = convertToJSONResume(mockResumeData)
      const result = convertFromJSONResume(jsonResume as any)
      expect(result?.skills?.[0]?.title).toBe('Frontend')
      expect(result?.skills?.[0]?.skills?.[0]?.text).toBe('React')
    })

    it('handles work experience endYear "Present"', () => {
      const jsonResume = convertToJSONResume(mockResumeData)
      const result = convertFromJSONResume(jsonResume as any)
      expect(result?.workExperience?.[0]?.endYear).toBe('Present')
    })

    it('returns null for invalid schema', () => {
      const result = convertFromJSONResume({ basics: { email: 'bad-email' } } as any)
      expect(result).toBeNull()
    })

    it('handles languages as objects', () => {
      const jsonResume = {
        basics: { name: 'Test' },
        languages: [{ language: 'Spanish', fluency: 'Fluent' }]
      }
      const result = convertFromJSONResume(jsonResume as any)
      expect(result?.languages).toEqual(['Spanish'])
    })

    it('handles basics.url mapping correctly', () => {
      const jsonResume = {
        basics: { name: 'Test', url: 'https://test.com' },
        socialMedia: []
      }
      const result = convertFromJSONResume(jsonResume as any)
      expect(result?.socialMedia[0]).toEqual({
        socialMedia: 'Website',
        link: 'test.com'
      })
    })

    it('handles validation errors correctly', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })
      const result = convertFromJSONResume(null as any)
      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Validation errors:'), expect.any(Object))
      consoleSpy.mockRestore()
    })
    it('should handle missing basics gracefully', () => {
      const result = convertFromJSONResume({})
      expect(result).toBeDefined()
      expect(result?.name).toBe('')
    })
    it('should handle missing fields in convertFromJSONResume', () => {
      // Use empty objects/arrays instead of nulls to pass schema validation but hit internal defaults
      const sparseResume = {
        basics: {
          name: 'Sparse User',
          email: 'test@example.com'
        },
        work: [],
        education: [],
        skills: [],
        languages: [],
        projects: []
      } as any

      const result = convertFromJSONResume(sparseResume)
      expect(result).not.toBeNull()
      if (result) {
        expect(result.name).toBe('Sparse User')
      }
    })

    it('should cover the catch block in convertFromJSONResume', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })

      // Use an object that is valid but throws on a specific property access
      const validButEvil = {
        basics: { name: 'Test', email: 'test@example.com' },
        get work() { throw new Error('Forced Error') }
      }

      const result = convertFromJSONResume(validButEvil as any)
      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error converting JSON Resume:'), expect.any(Error))

      consoleSpy.mockRestore()
    })
  })
})
