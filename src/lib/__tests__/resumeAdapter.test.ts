import resumeData from '../resumeAdapter';
import jsonResumeData from '@/data/resume.json';

describe('Resume Adapter', () => {
  it('should export resume data', () => {
    expect(resumeData).toBeDefined();
    expect(typeof resumeData).toBe('object');
  });

  it('should have all required fields', () => {
    expect(resumeData).toHaveProperty('name');
    expect(resumeData).toHaveProperty('position');
    expect(resumeData).toHaveProperty('email');
    expect(resumeData).toHaveProperty('contactInformation');
    expect(resumeData).toHaveProperty('address');
    expect(resumeData).toHaveProperty('socialMedia');
    expect(resumeData).toHaveProperty('summary');
    expect(resumeData).toHaveProperty('education');
    expect(resumeData).toHaveProperty('workExperience');
    expect(resumeData).toHaveProperty('skills');
    expect(resumeData).toHaveProperty('languages');
    expect(resumeData).toHaveProperty('certifications');
  });

  it('should convert basics fields from JSON Resume', () => {
    expect(resumeData.name).toBe(jsonResumeData.basics.name);
    expect(resumeData.position).toBe(jsonResumeData.basics.label);
    expect(resumeData.email).toBe(jsonResumeData.basics.email);
    expect(resumeData.contactInformation).toBe(jsonResumeData.basics.phone);
  });

  it('should have socialMedia as an array', () => {
    expect(Array.isArray(resumeData.socialMedia)).toBe(true);
  });

  it('should strip http/https from social media URLs', () => {
    resumeData.socialMedia.forEach(social => {
      expect(social.link).not.toMatch(/^https?:\/\//);
    });
  });

  it('should have workExperience as an array', () => {
    expect(Array.isArray(resumeData.workExperience)).toBe(true);
  });

  it('should convert work experience with all fields', () => {
    if (resumeData.workExperience.length > 0) {
      const firstJob = resumeData.workExperience[0];
      expect(firstJob).toHaveProperty('company');
      expect(firstJob).toHaveProperty('position');
      expect(firstJob).toHaveProperty('description');
      expect(firstJob).toHaveProperty('keyAchievements');
      expect(firstJob).toHaveProperty('startYear');
      expect(firstJob).toHaveProperty('endYear');
      expect(firstJob).toHaveProperty('technologies');
      expect(Array.isArray(firstJob.technologies)).toBe(true);
    }
  });

  it('should have education as an array', () => {
    expect(Array.isArray(resumeData.education)).toBe(true);
  });

  it('should convert education with required fields', () => {
    if (resumeData.education.length > 0) {
      const firstEdu = resumeData.education[0];
      expect(firstEdu).toHaveProperty('school');
      expect(firstEdu).toHaveProperty('degree');
      expect(firstEdu).toHaveProperty('startYear');
      expect(firstEdu).toHaveProperty('endYear');
    }
  });

  it('should have skills as an array of skill groups', () => {
    expect(Array.isArray(resumeData.skills)).toBe(true);
    if (resumeData.skills.length > 0) {
      const firstSkillGroup = resumeData.skills[0];
      expect(firstSkillGroup).toHaveProperty('title');
      expect(firstSkillGroup).toHaveProperty('skills');
      expect(Array.isArray(firstSkillGroup.skills)).toBe(true);
    }
  });

  it('should have skill objects with text and highlight fields', () => {
    if (resumeData.skills.length > 0 && resumeData.skills[0].skills.length > 0) {
      const firstSkill = resumeData.skills[0].skills[0];
      expect(firstSkill).toHaveProperty('text');
      expect(firstSkill).toHaveProperty('highlight');
      expect(typeof firstSkill.text).toBe('string');
      expect(typeof firstSkill.highlight).toBe('boolean');
    }
  });

  it('should have languages as an array of strings', () => {
    expect(Array.isArray(resumeData.languages)).toBe(true);
    if (resumeData.languages.length > 0) {
      expect(typeof resumeData.languages[0]).toBe('string');
    }
  });

  it('should have certifications as an array', () => {
    expect(Array.isArray(resumeData.certifications)).toBe(true);
  });

  it('should have boolean flags with correct default values', () => {
    expect(resumeData.showSummary).toBe(true);
    expect(resumeData.showEducationDates).toBe(true);
    expect(resumeData.showLanguages).toBe(true);
  });

  it('should reconstruct address from location fields', () => {
    expect(typeof resumeData.address).toBe('string');
    expect(resumeData.address.length).toBeGreaterThan(0);
  });
});
