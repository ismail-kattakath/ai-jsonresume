import {
  buildOnDeviceCoverLetterPrompt,
  buildOnDeviceSummaryPrompt,
  buildOnDeviceWorkExperiencePrompt,
} from '@/lib/ai/on-device/prompts'

describe('prompts', () => {
  const mockResumeData = {
    name: 'John Doe',
    position: 'Developer',
    workExperience: [
      {
        position: 'SDE',
        organization: 'Google',
        keyAchievements: ['Achievement 1', { text: 'Achievement 2' }],
      },
    ],
    skills: [
      {
        title: 'Languages',
        skills: [{ text: 'JS' }, { text: 'TS' }],
      },
    ],
  }

  describe('buildOnDeviceCoverLetterPrompt', () => {
    it('builds prompt with resume data', () => {
      const prompt = buildOnDeviceCoverLetterPrompt(mockResumeData as any, 'Target JD')
      expect(prompt).toContain('John Doe')
      expect(prompt).toContain('SDE at Google')
      expect(prompt).toContain('Achievement 1; Achievement 2')
      expect(prompt).toContain('Languages: JS, TS')
    })

    it('handles sparse/missing data branches', () => {
      const prompt = buildOnDeviceCoverLetterPrompt({} as any, 'JD')
      expect(prompt).toContain('Name: Not provided')
      expect(prompt).toContain('Position: Not provided')
      expect(prompt).toContain('No work experience provided.')
      expect(prompt).toContain('No skills provided.')
    })

    it('handles achievements without text property and null skills', () => {
      const resume = {
        workExperience: [{ position: 'P', organization: 'O', keyAchievements: [{}] }],
        skills: [{ title: 'T' }], // skills array missing for this group
      }
      const prompt = buildOnDeviceCoverLetterPrompt(resume as any, 'JD')
      expect(prompt).toContain('P at O')
      expect(prompt).toContain('T:')
    })

    it('handles workExperience being undefined', () => {
      const prompt = buildOnDeviceCoverLetterPrompt({ name: 'N' } as any, 'JD')
      expect(prompt).toContain('No work experience provided.')
    })
  })

  describe('buildOnDeviceSummaryPrompt', () => {
    it('handles fallback branches and long JD slicing', () => {
      const prompt = buildOnDeviceSummaryPrompt({} as any, 'A'.repeat(1000))
      expect(prompt).toContain('CANDIDATE: Candidate')
      expect(prompt).toContain('Professional')
      // Verify it doesn't crash on long JD
      expect(prompt.length).toBeLessThan(1500)
    })

    it('handles valid resume data', () => {
      const prompt = buildOnDeviceSummaryPrompt(mockResumeData as any, 'JD')
      expect(prompt).toContain('John Doe')
      expect(prompt).toContain('JS, TS')
    })
  })

  describe('buildOnDeviceWorkExperiencePrompt', () => {
    it('handles achievements array with mix of strings and objects', () => {
      const prompt = buildOnDeviceWorkExperiencePrompt('D', 'P', 'O', ['S', { text: 'O' }], 'JD')
      expect(prompt).toContain('S; O')
    })

    it('handles missing achievements and description and long JD', () => {
      const prompt = buildOnDeviceWorkExperiencePrompt('', 'P', 'O', [], 'A'.repeat(500))
      expect(prompt).toContain('EXISTING DESCRIPTION: None')
      expect(prompt).toContain('KEY ACHIEVEMENTS: None')
      // prompt construction should work
      expect(prompt).toContain('TARGET JOB')
    })
  })
})
