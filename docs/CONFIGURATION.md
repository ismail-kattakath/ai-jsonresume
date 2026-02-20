# Configuration & Setup Guide

This guide covers all aspects of configuring and setting up your AI JSONResume portfolio, from personal data to AI providers and analytics.

## 📋 Table of Contents

- [1. Data Setup (JSON Resume)](#1-data-setup-json-resume)
- [2. AI Configuration](#2-ai-configuration)
- [3. Password Protection (Optional)](#3-password-protection-optional)
- [4. Google Analytics 4 (Optional)](#4-google-analytics-4-optional)
- [5. Troubleshooting](#5-troubleshooting)

---

## 1. Data Setup (JSON Resume)

The entire portfolio website is driven by a **single source of truth**: `src/data/resume.json`, which follows the [JSON Resume](https://jsonresume.org) v1.0.0 standard format.

### Single Source of Truth

- **Location**: `src/data/resume.json`
- **Why It's Important**: Change your data once, it updates everywhere—homepage, resume builder, cover letter generator, SEO metadata, and API endpoint.

### Customization Steps

1. **Open the File**: Edit `src/data/resume.json`.
2. **Update Basics**: Fill in your name, label, email, phone, and professional summary.
3. **Social Profiles**: Add your GitHub, LinkedIn, and other professional links.
4. **Work & Education**: List your experiences in reverse chronological order. Use ISO date format (`YYYY-MM-DD`).
5. **Skills & Projects**: Group skills by category and highlight your key projects.

### Data Validation

The project uses **AJV** for schema validation. Run `npm run build` to verify your JSON structure. Common errors include missing required fields or invalid date formats.

---

## 2. AI Configuration

The AI interface allows you to connect to multiple AI providers for generating cover letters and professional summaries.

### Supported Providers

- **Google Gemini (Recommended)**: Free tier, high quality, direct integration.
- **OpenRouter**: Access to 100+ models with one key.
- **OpenAI**: Official GPT-4 and GPT-3.5 models.
- **Local (LM Studio)**: For full privacy and no API costs.
- **Custom**: Any OpenAI-compatible API.

### Setup Instructions

1. **Access Settings**: In the Resume Builder (`/resume/builder`), click the **⚙️ Settings** tab.
2. **Select Provider**: Choose your preferred AI provider.
3. **Enter API Key**: Provide your key (starts with `AIza...` for Gemini, `sk-...` for OpenAI/OpenRouter).
4. **Load Models**: The application will automatically fetch available models.
5. **Saved Data**: Credentials are stored in your browser's `localStorage` and are never sent to our servers.

---

## 3. Password Protection (Optional)

You can optionally protect your edit pages (`/resume/builder` and `/cover-letter/edit`) with a password.

### How to Enable

1. **Generate Hash**: Run `node scripts/generate-password-hash.mjs "your-password"`.
2. **GitHub Secret**: Add the generated hash as `NEXT_PUBLIC_EDIT_PASSWORD_HASH` in your repository secrets.
3. **Local Setup**: Add the hash to your `.env.local` file for local development.

### Access & Logout

- Navigate to a protected page and enter your plain-text password.
- Sessions last 24 hours (stored in `sessionStorage`).
- Click "Logout" in the top-right corner to clear your session.

---

## 4. Google Analytics 4 (Optional)

Track user engagement and feature usage with GA4.

### Setup Steps

1. **Create Property**: Set up a GA4 property in the [Google Analytics Admin](https://analytics.google.com).
2. **Get Measurement ID**: Copy your ID (`G-XXXXXXXXXX`).
3. **Configure Environment**:
   - Local: Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to `.env.local`.
   - Production: Add as a GitHub Action Secret.

### Privacy-First Tracking

- **Anonymized Patterns**: Page views, feature usage, and AI generation stats.
- **No PII**: We never track emails, resume content, API keys, or password hashes.

---

## 5. Troubleshooting

- **Changes Not Appearing?**: Hard reload your browser or restart the dev server (`npm run dev`).
- **AI Won't Connect?**: Verify your API key and ensured the provider matches the key type.
- **Password Prompt Missing?**: Check if `NEXT_PUBLIC_EDIT_PASSWORD_HASH` is correctly set in your environment.
- **Analytics Missing?**: Disable ad blockers and verify your Measurement ID.

For more detailed technical info, see [docs/DEVELOPMENT.md](./DEVELOPMENT.md).
