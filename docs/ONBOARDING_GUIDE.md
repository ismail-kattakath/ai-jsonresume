# Onboarding Guide Documentation

## Overview

The Resume Builder features an interactive onboarding tour that automatically appears for first-time users. Built with **onborda** and **Framer Motion**, it provides a smooth,guided introduction to key features.

## Architecture

### Components

1. **OnboardingContext** (`src/lib/contexts/OnboardingContext.tsx`)
   - Manages tour state (shown/completed)
   - Persists completion in localStorage
   - Provides hooks for tour control

2. **OnboardingTour** (`src/components/onboarding/OnboardingTour.tsx`)
   - Renders the tour UI
   - Custom styled cards
   - Progress indicator

3. **Tour Configuration** (`src/config/onboarding.ts`)
   - 12 steps covering all major features
   - Element selectors for spotlight
   - Step content and icons

### User Flow

```
First Visit → Tour Automatically Shows → User Completes/Skips → Stored in localStorage → Never Shows Again
```

## Tour Steps

### Part 1: Introduction (Steps 1-3)

1. **Welcome** - Overview of the editor
2. **Dual Mode** - Resume vs Cover Letter
3. **Preview** - Real-time preview feature

### Part 2: Core Features (Steps 4-9)

4. **Import/Export** - Data management
5. **AI Settings** - Configure AI generation
6. **Personal Info** - Basic data entry
7. **Work Experience** - Adding achievements
8. **Skills** - Organizing skills
9. **Print & Download** - Getting final document

### Part 3: Advanced (Steps 10-12)

10. **Drag & Drop** - Reordering items
11. **AI Generation** - Using AI features
12. **Auto-Save** - Data persistence

## Integration

### Wrap Your App

```tsx
import { OnboardingProvider } from '@/lib/contexts/OnboardingContext'
import { OnboardingTour } from '@/components/onboarding/OnboardingTour'

export default function App() {
  return (
    <OnboardingProvider>
      <OnboardingTour />
      {/* Your app */}
    </OnboardingProvider>
  )
}
```

### Add Element IDs

Elements referenced in the tour must have IDs:

```tsx
// src/config/onboarding.ts
{
  selector: '#editor-header',
  title: 'Welcome',
  // ...
}

// In your component
<div id="editor-header">
  {/* Content */}
</div>
```

## Customization

### Modifying Tour Steps

Edit `src/config/onboarding.ts`:

```typescript
export const onboardingSteps: Step[] = [
  {
    icon: '👋', // Emoji or component
    title: 'Step Title', // Bold header
    content: 'Step description', // Body text
    selector: '#element-id', // CSS selector
    side: 'bottom', // Placement
    showControls: true, // Show next/back buttons
    pointerPadding: 10, // Spotlight padding
    pointerRadius: 8, // Spotlight corner radius
  },
  // ... more steps
]
```

### Styling the Cards

Customize in `src/components/onboarding/OnboardingTour.tsx`:

```tsx
cardComponent={(props) => (
  <div className="custom-card-styles">
    {/* Custom card content */}
  </div>
)}
```

### Changing Version

Force tour to re-show by bumping version in `src/config/onboarding.ts`:

```typescript
export const ONBOARDING_VERSION = '2.0' // Increment to re-show
```

## User Controls

### Tour Navigation

- **Next Button** - Advances to next step
- **Back Button** - Returns to previous step (hidden on first step)
- **Skip Tour** - Dismisses tour immediately (first step only)
- **Get Started** - Completes tour (final step)

### Keyboard Navigation

- **Escape** - Close tour
- **Enter** - Next step
- **Arrow Keys** - Navigate steps (when focused)

### Programmatic Control

```tsx
import { useOnboarding } from '@/lib/contexts/OnboardingContext'

function MyComponent() {
  const { showTour, completeTour, resetTour } = useOnboarding()

  return (
    <>
      <button onClick={showTour}>Replay Tour</button>
      <button onClick={resetTour}>Reset Tour State</button>
    </>
  )
}
```

## Storage

### localStorage Key

```
resume_builder_onboarding_completed
```

### Stored Data

```json
{
  "version": "1.0",
  "completedAt": "2025-01-28T10:30:00Z"
}
```

### Privacy

- **No tracking** - Only stores completion status
- **Local only** - Never leaves user's browser
- **No cookies** - Uses localStorage only

## Technical Details

### Library: onborda

- **Size:** ~15KB (with Framer Motion already in project)
- **Animation:** Powered by Framer Motion
- **Next.js:** Built specifically for Next.js 15
- **Mobile:** Fully responsive

### Animation

```typescript
cardTransition={{
  type: 'spring',
  stiffness: 300,
  damping: 30,
}}
```

### Spotlight Effect

- **Background:** rgba(0,0,0,0.8)
- **Target Element:** Highlighted with rounded border
- **Padding:** 10px around element
- **Radius:** 8px corners

## Testing

Mocked in tests to avoid component complexity:

```javascript
// jest.setup.js
jest.mock('onborda', () => ({
  OnbordaProvider: ({ children }) => children,
  Onborda: () => null,
  useOnborda: () => ({
    step: 0,
    nextStep: jest.fn(),
    previousStep: jest.fn(),
    closeOnborda: jest.fn(),
  }),
}))
```

## Troubleshooting

### Tour Not Showing

1. **Check localStorage:** Clear `resume_builder_onboarding_completed`
2. **Check Context:** Ensure `<OnboardingProvider>` wraps app
3. **Check Component:** Verify `<OnboardingTour />` is rendered
4. **Check IDs:** Element selectors must match actual IDs

### Element Not Highlighted

- Ensure element has correct ID: `id="element-id"`
- Check element is visible (not `display: none`)
- Verify selector syntax in `onboarding.ts`

### Card Positioning Wrong

- Use `side` property: "top" | "right" | "bottom" | "left"
- Adjust `pointerPadding` for more/less space
- Check z-index conflicts

### Tour Stuck

- User can always press Escape to exit
- Programmatically: `const { completeTour } = useOnboarding(); completeTour()`

## Best Practices

### Writing Step Content

✅ **DO:**

- Keep titles under 5 words
- Keep content under 20 words
- Use emojis for visual interest
- Focus on "why" not "what"

❌ **DON'T:**

- Write long paragraphs
- Explain obvious features
- Use technical jargon
- Have too many steps (12 max)

### Step Order

1. **Introduction** - Welcome, overview
2. **Core Features** - Most important functionality
3. **Advanced** - Power user features
4. **Conclusion** - Next steps, encouragement

### Testing Tour Changes

```bash
# 1. Clear localStorage
localStorage.removeItem('resume_builder_onboarding_completed')

# 2. Refresh page
# 3. Tour should appear

# Or in console:
localStorage.clear()
location.reload()
```

## Performance

- **Initial Load:** ~15KB (onborda + config)
- **Animation:** 60 FPS with Framer Motion
- **Memory:** Minimal - unloaded after completion
- **First Visit:** Tour loads immediately
- **Subsequent:** Tour code not loaded

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile Safari/Chrome (touch-optimized)

## Related Files

- `src/lib/contexts/OnboardingContext.tsx` - State management
- `src/components/onboarding/OnboardingTour.tsx` - UI component
- `src/config/onboarding.ts` - Tour steps configuration
- `src/app/resume/builder/page.tsx` - Integration example
- `jest.setup.js` - Test mocks

## Future Enhancements

- [ ] Add step completion tracking
- [ ] Allow skipping individual steps
- [ ] Add tooltips to tour cards
- [ ] Support for multiple tours
- [ ] Analytics integration (opt-in)
