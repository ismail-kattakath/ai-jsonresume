# Claude Code Development Guide

> **For:** Future Claude Code sessions working on this project
> **Purpose:** Fast onboarding, common patterns, development workflows
> **Last Updated:** 2025-01-25

## Quick Project Summary

**Type:** Next.js 15 portfolio website with static export
**Deploy:** GitHub Pages via GitHub Actions
**Data:** Single source of truth (`src/data/resume.json` - JSON Resume v1.0.0)
**Auth:** Optional client-side password protection (bcrypt + sessionStorage)
**AI:** OpenAI-compatible API integration for cover letter/summary generation
**Tests:** Jest + RTL (25 test files, ~500+ tests)

---

## Project Layout Cheat Sheet

```
src/
├── data/
│   └── resume.json                  # ⭐ SINGLE SOURCE OF TRUTH
│
├── lib/
│   ├── resumeAdapter.ts            # JSON Resume → Internal format
│   ├── jsonResume.ts               # Internal → JSON Resume
│   ├── jsonResumeSchema.ts         # AJV validator
│   ├── data/portfolio.ts           # Internal → Portfolio UI
│   ├── ai/
│   │   ├── openai-client.ts        # AI API client (streaming)
│   │   └── document-prompts.ts     # Prompt engineering
│   └── hooks/
│       └── useDocumentHandlers.ts  # State management hooks
│
├── types/
│   ├── json-resume.ts              # JSON Resume standard types
│   ├── resume.ts                   # Internal ResumeData types
│   ├── portfolio.ts                # UI display types
│   ├── cover-letter.ts             # Cover letter types
│   └── openai.ts                   # OpenAI API types
│
├── app/
│   ├── page.tsx                    # Homepage (Hero, About, Skills, etc.)
│   ├── resume/edit/page.tsx        # Resume editor (password-protected)
│   ├── cover-letter/edit/page.tsx  # Cover letter editor
│   └── resume/page.tsx             # Print view (auto-triggers print)
│
├── components/
│   ├── sections/                   # Homepage sections
│   ├── document-builder/           # Shared editor components
│   ├── resume/                     # Resume-specific components
│   ├── cover-letter/               # Cover letter components
│   └── auth/PasswordProtection.tsx # Auth wrapper
│
└── config/
    ├── password.ts                 # Password config (optional)
    ├── metadata.ts                 # SEO metadata generation
    └── site.ts                     # Site constants
```

---

## Data Flow Architecture

**CRITICAL:** All portfolio data derives from ONE file

```
src/data/resume.json (JSON Resume v1.0.0)
    ↓
src/lib/resumeAdapter.ts → convertFromJSONResume()
    ↓
Internal ResumeData format
    ↓
    ├── src/lib/data/portfolio.ts → Homepage
    ├── src/app/resume/edit/page.tsx → Editor
    ├── src/app/cover-letter/edit/page.tsx → Cover letter
    ├── src/config/metadata.ts → SEO
    └── src/app/opengraph-image.tsx → OG images
```

**When editing portfolio content:**
1. ✅ Modify `src/data/resume.json`
2. ❌ DO NOT edit display components directly
3. ✅ Changes automatically propagate everywhere

**When adding new data fields:**
1. Add to `src/data/resume.json`
2. Update `src/types/json-resume.ts` (if extending standard)
3. Update `src/lib/resumeAdapter.ts` (transformation logic)
4. Update `src/types/resume.ts` (internal type)
5. Update UI components to consume new field

---

## Common Development Tasks

### 1. Update Portfolio Content

**User Request:** "Update my work experience"

**Action:**
```typescript
// Edit src/data/resume.json
{
  "work": [
    {
      "name": "New Company",
      "position": "New Role",
      "startDate": "2024-01-15",
      "endDate": "",  // Present
      "summary": "Role description",
      "highlights": [
        "Achievement with metrics",
        "Another achievement"
      ],
      "keywords": ["Tech1", "Tech2"]
    }
  ]
}
```

**Verify:**
```bash
npm run dev
# Check http://localhost:3000 (homepage)
# Check http://localhost:3000/resume/edit (editor)
```

### 2. Add New Homepage Section

**User Request:** "Add a projects section"

**Steps:**
1. **Add data to resume.json:**
   ```json
   {
     "projects": [
       {
         "name": "Project Name",
         "description": "Description",
         "highlights": ["Feature 1", "Feature 2"],
         "keywords": ["React", "Node.js"],
         "url": "https://project.com"
       }
     ]
   }
   ```

2. **Create component:**
   ```typescript
   // src/components/sections/Projects.tsx
   import { projects } from '@/lib/data/portfolio'

   export default function Projects() {
     return (
       <section>
         {projects.map(project => (
           <div key={project.name}>
             <h3>{project.name}</h3>
             <p>{project.description}</p>
           </div>
         ))}
       </section>
     )
   }
   ```

3. **Add to homepage:**
   ```typescript
   // src/app/page.tsx
   import Projects from '@/components/sections/Projects'

   export default function Home() {
     return (
       <main>
         <Hero />
         <About />
         <Skills />
         <Experience />
         <Projects />  {/* ← Add here */}
         <Contact />
       </main>
     )
   }
   ```

4. **Update data adapter:**
   ```typescript
   // src/lib/data/portfolio.ts
   export const projects: Project[] = resumeData.projects.map(...)
   ```

### 3. Fix Build Errors

**Common Issue:** TypeScript errors after data changes

**Diagnosis:**
```bash
npm run build
# Read error messages carefully
# Look for type mismatches
```

**Fix Pattern:**
```typescript
// 1. Check types match data structure
// src/types/resume.ts
export interface ResumeData {
  newField?: string;  // Add optional field
}

// 2. Update adapter
// src/lib/resumeAdapter.ts
function convertFromJSONResume(jsonResume: JSONResume): ResumeData {
  return {
    ...
    newField: jsonResume.basics?.newField || '',
  }
}

// 3. Update UI component
// Check for undefined before using
{resumeData.newField && <div>{resumeData.newField}</div>}
```

### 4. Add New Test

**User Request:** "Test the new feature"

**Pattern:**
```typescript
// src/components/sections/__tests__/Projects.test.tsx
import { render, screen } from '@testing-library/react'
import Projects from '../Projects'

describe('Projects Section', () => {
  it('renders project name', () => {
    render(<Projects />)
    expect(screen.getByText(/Project Name/i)).toBeInTheDocument()
  })

  it('displays project description', () => {
    render(<Projects />)
    expect(screen.getByText(/Description/i)).toBeInTheDocument()
  })
})
```

**Run:**
```bash
npm test -- Projects.test.tsx
```

### 5. Modify Password Protection

**User Request:** "Change password" or "Disable password protection"

**Enable:**
```bash
# 1. Generate hash
node scripts/generate-password-hash.js "new-password"

# 2. Add to .env.local
echo 'NEXT_PUBLIC_EDIT_PASSWORD_HASH="$2b$10$..."' >> .env.local

# 3. Restart dev server
npm run dev
```

**Disable:**
```bash
# Remove from .env.local
# OR set to empty string
NEXT_PUBLIC_EDIT_PASSWORD_HASH=""
```

**Production:**
```
GitHub → Settings → Secrets → Actions
Update: NEXT_PUBLIC_EDIT_PASSWORD_HASH
```

### 6. Debug AI Generation Issues

**User Request:** "AI cover letter not working"

**Check:**
1. **API credentials configured?**
   - Open `/cover-letter/edit`
   - Click "Generate with AI"
   - Verify URL, API key, model name

2. **Network errors?**
   ```typescript
   // src/lib/ai/openai-client.ts
   // Check console for errors
   // Common: CORS issues, invalid API key, model not found
   ```

3. **Test connection:**
   ```typescript
   import { testConnection } from '@/lib/ai/openai-client'

   const config = {
     baseURL: 'https://api.openai.com',
     apiKey: 'sk-...',
     model: 'gpt-4o-mini'
   }

   const success = await testConnection(config)
   console.log('Connection:', success ? 'OK' : 'FAILED')
   ```

4. **Validate response:**
   ```typescript
   // Check if AI returned empty content
   // Check if streaming is working
   // Look for validation warnings in console
   ```

---

## Development Workflows

### Local Development

```bash
# Start dev server
npm run dev

# Run tests in watch mode
npm test:watch

# Check types
npx tsc --noEmit

# Lint
npm run lint
```

### Pre-Commit Checklist

- [ ] All tests passing (`npm test`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] Changes reflected in dev server (`npm run dev`)
- [ ] Updated relevant documentation
- [ ] Git commit message follows convention

### Deployment Workflow

```bash
# 1. Make changes
git add .
git commit -m "feat: add new feature"

# 2. Push to main
git push origin main

# 3. GitHub Actions runs:
#    - npm ci (install)
#    - npm test (tests MUST pass)
#    - npm run build (build + sitemap)
#    - Deploy to GitHub Pages

# 4. Check deployment status
# GitHub → Actions tab → View workflow

# 5. Site live in 2-3 minutes
```

**Important:** Deployment FAILS if ANY test fails

---

## Code Patterns & Conventions

### File Naming

- **Components:** PascalCase (`PersonalInformation.tsx`)
- **Utilities:** camelCase (`resumeAdapter.ts`)
- **Types:** kebab-case (`json-resume.ts`)
- **Tests:** Same as file with `.test.tsx` suffix

### Component Structure

```typescript
// 1. Imports
import React from 'react'
import type { ResumeData } from '@/types'

// 2. Types (if needed)
interface Props {
  data: ResumeData
}

// 3. Component
export default function MyComponent({ data }: Props) {
  // 4. Hooks
  const [state, setState] = useState()

  // 5. Handlers
  const handleClick = () => { ... }

  // 6. Render
  return <div>...</div>
}
```

### State Management

**Resume/Cover Letter Editors:**
- Use `ResumeContext` / `DocumentContext`
- Centralized state in parent component
- Handlers in custom hooks (`useDocumentHandlers`)

**Homepage:**
- Static data from `portfolio.ts`
- No client-side state needed

### Data Transformation

**Pattern:** Always use adapter functions

```typescript
// ✅ Good
import resumeData from '@/lib/resumeAdapter'
const experience = resumeData.workExperience

// ❌ Bad
import jsonResume from '@/data/resume.json'
const experience = jsonResume.work  // Wrong format!
```

### Type Safety

**Always define types:**
```typescript
// ✅ Good
function formatDate(date: string): string { ... }

// ❌ Bad
function formatDate(date) { ... }  // Implicit 'any'
```

**Use existing types:**
```typescript
import type { ResumeData, WorkExperience } from '@/types'
```

---

## Common Pitfalls

### 1. Editing Wrong Files

❌ **DON'T** edit display components for content changes
✅ **DO** edit `src/data/resume.json`

### 2. Missing Type Updates

❌ **DON'T** add fields to JSON without updating types
✅ **DO** update types → adapter → UI in that order

### 3. Breaking Password Protection

❌ **DON'T** modify `src/config/password.ts` logic
✅ **DO** only set environment variable

### 4. Test Failures

❌ **DON'T** skip failing tests
✅ **DO** fix tests before deployment (GitHub Actions enforces this)

### 5. Direct State Mutation

```typescript
// ❌ Bad
resumeData.name = "New Name"

// ✅ Good
setResumeData({ ...resumeData, name: "New Name" })
```

---

## Testing Guidelines

### What to Test

**Unit Tests:**
- Data transformations (adapters)
- Utility functions
- Component rendering
- Form interactions

**Integration Tests:**
- Page workflows (edit → save → load)
- Password protection flow
- JSON import/export

**E2E Tests:**
- Complete user journeys
- Cross-page functionality

### Test Patterns

**Component Test:**
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('renders and handles interaction', async () => {
  const user = userEvent.setup()
  render(<MyComponent />)

  // Check rendering
  expect(screen.getByRole('button')).toBeInTheDocument()

  // Simulate interaction
  await user.click(screen.getByRole('button'))

  // Verify result
  expect(screen.getByText(/success/i)).toBeInTheDocument()
})
```

**Mocking:**
```typescript
// Mock API calls
jest.mock('@/lib/ai/openai-client', () => ({
  generateCoverLetter: jest.fn().mockResolvedValue('Generated content'),
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))
```

---

## Performance Considerations

### Build Optimization

- **Static export:** All pages pre-rendered at build time
- **Code splitting:** Automatic route-based splitting
- **Tree shaking:** Unused code removed
- **CSS purging:** Tailwind removes unused classes

### Image Handling

```typescript
// ❌ Don't use Next.js Image component (not supported in static export)
import Image from 'next/image'

// ✅ Use regular <img> tag
<img src="/path/to/image.png" alt="Description" />
```

### Bundle Size

**Check bundle:**
```bash
npm run build
# Look at "Route (app)" output
# Aim for < 200 kB First Load JS
```

**Reduce size:**
- Dynamic imports for heavy components
- Lazy load non-critical features
- Remove unused dependencies

---

## Debugging Tips

### Client-Side Issues

**Browser Console:**
```javascript
// Check resume data
import resumeData from '@/lib/resumeAdapter'
console.log(resumeData)

// Check auth state
console.log(sessionStorage.getItem('edit-auth-token'))

// Test AI connection
import { testConnection } from '@/lib/ai/openai-client'
testConnection({ baseURL: '...', apiKey: '...', model: '...' })
```

### Build Issues

**TypeScript Errors:**
```bash
# Check types
npx tsc --noEmit

# Show detailed errors
npm run build -- --verbose
```

**Test Failures:**
```bash
# Run specific test
npm test -- path/to/test.test.tsx

# Verbose output
npm test -- --verbose

# Update snapshots (if using)
npm test -- -u
```

### Production Issues

**GitHub Actions Failed:**
1. Go to Actions tab
2. Click failed workflow
3. Expand failed step
4. Read error message
5. Fix locally, test, push

**Site Not Updating:**
1. Check deployment succeeded (Actions tab)
2. Hard refresh browser (Ctrl+Shift+R)
3. Check GitHub Pages settings
4. Wait 2-3 minutes for CDN cache

---

## Quick Reference

### Key Files to Remember

| Task | File |
|------|------|
| **Update content** | `src/data/resume.json` |
| **Add homepage section** | `src/components/sections/` |
| **Modify editor form** | `src/components/resume/forms/` |
| **Change types** | `src/types/` |
| **Update metadata** | `src/config/metadata.ts` |
| **Modify auth** | `src/components/auth/PasswordProtection.tsx` |
| **AI prompts** | `src/lib/ai/document-prompts.ts` |

### Essential Commands

```bash
npm run dev          # Dev server
npm test             # Run tests
npm run build        # Production build
npm run lint         # Check code style

node scripts/generate-password-hash.js "password"  # Generate hash
npx tsc --noEmit     # Type check
npm test:coverage    # Coverage report
```

### Environment Variables

```bash
# .env.local (local development)
NEXT_PUBLIC_EDIT_PASSWORD_HASH="$2b$10$..."

# GitHub Secrets (production)
NEXT_PUBLIC_EDIT_PASSWORD_HASH
```

### Common Queries

**"Where is the homepage?"**
→ `src/app/page.tsx`

**"Where is the resume editor?"**
→ `src/app/resume/edit/page.tsx`

**"Where is the data?"**
→ `src/data/resume.json`

**"Where are tests?"**
→ `src/**/__tests__/` and `src/**/*.test.tsx`

**"How to add password?"**
→ Generate hash, set `NEXT_PUBLIC_EDIT_PASSWORD_HASH`

**"How to customize colors?"**
→ `src/app/globals.css`

**"How to deploy?"**
→ Push to main branch (GitHub Actions auto-deploys)

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     User Request                              │
│  "Update my portfolio" / "Add new feature"                   │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│              Identify Change Type                             │
│  Content Change → Edit resume.json                           │
│  UI Change → Edit components                                 │
│  Feature Change → Add/modify code                            │
└────────────────────┬─────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐        ┌────────────────┐
│ Edit Data     │        │ Edit Code      │
│ resume.json   │        │ Components/    │
│               │        │ Types/Logic    │
└───────┬───────┘        └────────┬───────┘
        │                         │
        │                         ▼
        │                ┌────────────────┐
        │                │ Update Types   │
        │                │ if needed      │
        │                └────────┬───────┘
        │                         │
        └─────────┬───────────────┘
                  │
                  ▼
        ┌──────────────────┐
        │   Add Tests       │
        │   (if needed)     │
        └────────┬──────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  npm test         │
        │  npm run build    │
        └────────┬──────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  git commit       │
        │  git push         │
        └────────┬──────────┘
                 │
                 ▼
        ┌──────────────────┐
        │ GitHub Actions    │
        │ - Test            │
        │ - Build           │
        │ - Deploy          │
        └────────┬──────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  Live on          │
        │  GitHub Pages     │
        └───────────────────┘
```

---

## Advanced Topics

### Custom Data Fields

**Example:** Add "Awards" section

1. **Extend JSON Resume** (optional, for portability):
   ```json
   {
     "awards": [
       {
         "title": "Award Name",
         "date": "2023-06-15",
         "awarder": "Organization",
         "summary": "Description"
       }
     ]
   }
   ```

2. **Update Internal Types:**
   ```typescript
   // src/types/resume.ts
   export interface Award {
     title: string;
     date: string;
     awarder: string;
     summary: string;
   }

   export interface ResumeData {
     ...
     awards?: Award[];
   }
   ```

3. **Update Adapter:**
   ```typescript
   // src/lib/resumeAdapter.ts
   function convertFromJSONResume(jsonResume: JSONResume): ResumeData {
     return {
       ...
       awards: jsonResume.awards || [],
     }
   }
   ```

4. **Create Component:**
   ```typescript
   // src/components/sections/Awards.tsx
   export default function Awards() {
     return <section>{/* Render awards */}</section>
   }
   ```

5. **Add to Editor (optional):**
   ```typescript
   // src/components/resume/forms/Awards.tsx
   // Add form for editing awards
   ```

### Extending AI Features

**Example:** Add AI-generated achievements

1. **Create Prompt:**
   ```typescript
   // src/lib/ai/document-prompts.ts
   export function buildAchievementPrompt(
     jobTitle: string,
     skills: string[]
   ): string {
     return `Generate 3 achievement bullet points for ${jobTitle}...`
   }
   ```

2. **Add Client Function:**
   ```typescript
   // src/lib/ai/openai-client.ts
   export async function generateAchievements(
     config: OpenAIConfig,
     jobTitle: string,
     skills: string[]
   ): Promise<string[]> {
     // Implementation
   }
   ```

3. **Create UI:**
   ```typescript
   // Component with "Generate Achievements" button
   ```

---

**For More Details:** See `ARCHITECTURE.md` (deep technical reference)

**For User Guide:** See `QUICKSTART.md` (end-user setup)

**For Docs:** See `docs/` directory (comprehensive guides)
