# Features & Usage Guide

Discover the powerful features built into AI JSONResume to help you craft the perfect professional presence.

## 📋 Table of Contents

- [1. AI Content Generator](#1-ai-content-generator)
- [2. Mobile Preview Scaling](#2-mobile-preview-scaling)
- [3. Tooltip Help System](#3-tooltip-help-system)

---

## 1. AI Content Generator

The AI Content Generator helps you craft professional, tailored content directly from your resume data.

### Key Capabilities

- **Tailored Cover Letters**: Generates customized letters based on your resume and a job description.
- **Professional Summaries**: Creates impactful 150-200 word summaries highlighting your strengths.
- **Real-Time Streaming**: Watch the content appear word-by-word as it's generated.

### Accuracy Guarantee

The AI is strictly instructed to **only use qualifications and experiences from your actual resume data**. It will not fabricate claims or invent skills you haven't listed.

### How to Use

1. Inside the **Cover Letter** or **Resume Builder**, click the **✨ Generate with AI** button.
2. Provide your API credentials (if not already saved).
3. Paste the job description or enter additional career highlights.
4. Click **Generate** and review the results.

---

## 2. Mobile Preview Scaling

We use professional CSS transform scaling to ensure your resume looks great on every device.

### How It Works

- **Proportional Scaling**: The preview maintains all aspect ratios, typography, and layout proportions, even on small screens.
- **Responsive Logic**: A custom hook calculates the scale factor based on your viewport width.
- **Performance**: Scaling is handled via GPU-accelerated CSS transforms for smooth performance.

### Benefits

- **Full Visibility**: Unlike other builders that hide the preview on mobile, you can see your exact resume layout on your phone.
- **Touch Friendly**: Interactive elements remain functional even when scaled.

---

## 3. Tooltip Help System

Contextual help is available throughout the application to guide you through the process.

### Features

- **Hover/Tap**: Simply hover over an element (or tap on mobile) to see a concise explanation.
- **Centralized Content**: All tooltip text is professionally written and centrally managed for consistency.
- **Action Oriented**: Tooltips use action verbs like "Click to...", "Drag to...", or "Toggle to..." to explain UI interactions.

### Best Practices for Content

If you are contributing to the codebase, ensure tooltips are:

- **Concise**: 10-15 words max.
- **Plain English**: Avoid jargon.
- **Value-Add**: Don't state the obvious (e.g., "Print button").

---

## Related Documentation

- [docs/CONFIGURATION.md](./CONFIGURATION.md) - Setup providers and API keys.
- [docs/DEVELOPMENT.md](./DEVELOPMENT.md) - Internal architecture and roadmap.
