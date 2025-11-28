/**
 * Onboarding Tour Configuration
 * Defines the steps for the interactive tour of the Resume Builder
 */

import type { Step } from 'onborda'

export const onboardingSteps: Step[] = [
  // Part 1: Introduction (3 steps)
  {
    icon: '👋',
    title: 'Welcome to AI Resume Builder',
    content:
      'This interactive builder helps you create professional resumes and cover letters tailored to any job. Let me show you around!',
    selector: '#editor-header',
    side: 'bottom',
    showControls: true,
    pointerPadding: 10,
    pointerRadius: 8,
  },
  {
    icon: '🔄',
    title: 'Dual Mode Editor',
    content:
      'Switch between Resume and Cover Letter modes. Both share your personal information, so you only enter it once!',
    selector: '#mode-switcher',
    side: 'bottom',
    showControls: true,
    pointerPadding: 10,
    pointerRadius: 8,
  },
  {
    icon: '👁️',
    title: 'Real-Time Preview',
    content:
      'See your changes instantly in the preview pane. What you see is what you get when you print or download.',
    selector: '#preview-pane',
    side: 'left',
    showControls: true,
    pointerPadding: 10,
    pointerRadius: 8,
  },

  // Part 2: Core Features (6 steps)
  {
    icon: '📥',
    title: 'Import & Export',
    content:
      'Already have a JSON Resume? Import it here. You can also export your data to use with other tools that support the JSON Resume standard.',
    selector: '#section-import-export',
    side: 'right',
    showControls: true,
    pointerPadding: 10,
    pointerRadius: 8,
  },
  {
    icon: '🤖',
    title: 'AI Generation',
    content:
      'Configure your AI settings here to use AI-powered content generation. Works with OpenAI, local LLMs (Ollama, LM Studio), and any OpenAI-compatible API.',
    selector: '#section-ai-settings',
    side: 'right',
    showControls: true,
    pointerPadding: 10,
    pointerRadius: 8,
  },
  {
    icon: '👤',
    title: 'Personal Information',
    content:
      'Start by entering your basic information. This section is shared between your resume and cover letter.',
    selector: '#section-personal-info',
    side: 'right',
    showControls: true,
    pointerPadding: 10,
    pointerRadius: 8,
  },
  {
    icon: '💼',
    title: 'Work Experience',
    content:
      'Add your employment history with key achievements. Use the AI button to generate achievement bullets based on the job description!',
    selector: '#section-work-experience',
    side: 'right',
    showControls: true,
    pointerPadding: 10,
    pointerRadius: 8,
  },
  {
    icon: '⚙️',
    title: 'Skills',
    content:
      'Organize your skills into categories (Frontend, Backend, DevOps, etc.). Drag to reorder, and use the highlight feature to emphasize key skills.',
    selector: '#section-skills',
    side: 'right',
    showControls: true,
    pointerPadding: 10,
    pointerRadius: 8,
  },
  {
    icon: '📄',
    title: 'Print & Download',
    content:
      'When you\'re done, click the Print button to download as PDF. Your browser\'s print dialog lets you "Save as PDF".',
    selector: '#print-button',
    side: 'bottom',
    showControls: true,
    pointerPadding: 10,
    pointerRadius: 8,
  },

  // Part 3: Advanced Features (3 steps)
  {
    icon: '🔄',
    title: 'Drag & Drop',
    content:
      'Look for the grip icon (⋮⋮) on items - you can drag to reorder skills, achievements, and sections. Put your most impressive content first!',
    selector: '#section-skills',
    side: 'right',
    showControls: true,
    pointerPadding: 10,
    pointerRadius: 8,
  },
  {
    icon: '✨',
    title: 'AI-Powered Content',
    content:
      'Throughout the editor, you\'ll see "Generate" buttons. These use AI to write tailored content based on your job description and existing information.',
    selector: '#section-ai-settings',
    side: 'right',
    showControls: true,
    pointerPadding: 10,
    pointerRadius: 8,
  },
  {
    icon: '💾',
    title: 'Auto-Save',
    content:
      'Your data is automatically saved in your browser as you type. Come back anytime and continue where you left off!',
    selector: '#editor-header',
    side: 'bottom',
    showControls: true,
    pointerPadding: 10,
    pointerRadius: 8,
  },
]

export const ONBOARDING_STORAGE_KEY = 'resume_builder_onboarding_completed'
export const ONBOARDING_VERSION = '1.0' // Increment to re-show tour after major changes
