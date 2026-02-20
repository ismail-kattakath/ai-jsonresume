import { validateJSONResume } from '../jsonResumeSchema'

describe('jsonResumeSchema validator', () => {
  it('validates a complete valid resume', () => {
    const validResume = {
      basics: {
        name: 'John Doe',
        label: 'Programmer',
        email: 'john@example.com',
        url: 'https://johndoe.com',
        summary: 'A short summary...',
        location: {
          city: 'San Francisco',
          countryCode: 'US'
        },
        profiles: [
          {
            network: 'Twitter',
            username: 'johndoe',
            url: 'https://twitter.com/johndoe'
          }
        ]
      },
      work: [
        {
          name: 'Company',
          position: 'President',
          url: 'https://company.com',
          startDate: '2013-01-01',
          summary: 'Description...'
        }
      ],
      skills: [
        {
          name: 'Web Development',
          level: 'Master',
          keywords: ['HTML', 'CSS', 'JS']
        }
      ]
    }

    const result = validateJSONResume(validResume)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('returns errors for invalid data types', () => {
    const invalidResume = {
      basics: {
        name: 'John Doe',
        email: 'not-an-email' // Invalid format
      }
    }

    const result = validateJSONResume(invalidResume)
    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain('must match format "email"')
  })

  it('returns errors for invalid nested data', () => {
    const invalidResume = {
      work: [
        {
          name: 'Company',
          url: 'not-a-url' // Invalid format
        }
      ]
    }

    const result = validateJSONResume(invalidResume)
    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain('/work/0/url')
  })

  it('allows additional properties', () => {
    const resumeWithExtras = {
      basics: {
        name: 'John Doe',
        myCustomField: 'some value'
      },
      extraRootField: true
    }

    const result = validateJSONResume(resumeWithExtras)
    expect(result.valid).toBe(true)
  })

  it('handles empty object as valid (since no fields are required)', () => {
    const result = validateJSONResume({})
    expect(result.valid).toBe(true)
  })

  it('handles root level errors', () => {
    // e.g. passing a string instead of an object
    const result = validateJSONResume('not-an-object')
    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain('root: must be object')
  })
})
