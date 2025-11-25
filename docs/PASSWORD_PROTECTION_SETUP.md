# Password Protection Setup Guide

This guide explains how to **optionally** set up password protection for the edit pages (`/resume/edit` and `/cover-letter/edit`).

## 🔓 Password Protection is Optional!

**By default, edit pages are publicly accessible** - no password required. This makes it easy to get started.

**To enable password protection:**
- Set the `NEXT_PUBLIC_EDIT_PASSWORD_HASH` environment variable
- Follow the setup instructions below

**To disable password protection:**
- Simply don't set the environment variable
- Edit pages will be accessible to anyone who visits them

## ⚠️ Security Notice

**Important**: This is client-side password protection suitable for personal portfolios. It deters casual access but can be bypassed by someone with technical knowledge who inspects the built files. For production applications requiring real security, consider migrating to Vercel/Netlify with edge functions.

## 🎯 What's Protected

- `/resume/edit` - Resume editor page (when password protection is enabled)
- `/cover-letter/edit` - Cover letter editor page (when password protection is enabled)

## 📋 Setup Instructions (Optional)

### Step 1: Generate Password Hash

Run the included script to generate a bcrypt hash of your password:

```bash
node scripts/generate-password-hash.js
```

Or provide the password directly as an argument:

```bash
node scripts/generate-password-hash.js "your-strong-password"
```

**Password Recommendations:**
- Use at least 12 characters
- Include uppercase, lowercase, numbers, and special characters
- Don't reuse passwords from other services
- Example: `MyP0rtf0lio!2024@Edit`

The script will output a hash like:
```
$2a$10$N9qo8uLOickgx2ZMRZoMye7T8h9/qRBSMy1Wz0C.OvQ1rPLbSLbsG
```

### Step 2: Add Hash to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Set:
   - **Name**: `NEXT_PUBLIC_EDIT_PASSWORD_HASH`
   - **Value**: Paste the hash from Step 1
5. Click **Add secret**

### Step 3: Local Development Setup

Create a `.env.local` file in the project root:

```bash
# .env.local
NEXT_PUBLIC_EDIT_PASSWORD_HASH=$2a$10$N9qo8uLOickgx2ZMRZoMye7T8h9/qRBSMy1Wz0C.OvQ1rPLbSLbsG
```

**Note**: `.env.local` is in `.gitignore` and won't be committed to your repository.

**That's it!** Password protection is now enabled for local development.

### Step 4: Deploy

Push your changes to trigger GitHub Actions deployment:

```bash
git add .
git commit -m "feat: add password protection to edit pages"
git push origin main
```

The GitHub Actions workflow will automatically use the secret during build.

## 🔐 Usage

### Accessing Protected Pages

1. Navigate to `/resume/edit` or `/cover-letter/edit`
2. You'll see a password entry screen
3. Enter your password (the plain text one, not the hash)
4. Click "Unlock"
5. If correct, you'll access the editor
6. Session lasts 24 hours or until you click "Logout"

### Logout

A "Logout" button appears in the top-right corner when authenticated. Click it to clear your session.

### Session Management

- Sessions expire after 24 hours
- Sessions are stored in `sessionStorage` (cleared when tab closes)
- Each browser/tab requires separate authentication

## 🛠️ How It Works

1. **Build Time**: GitHub Actions injects the password hash into the static files
2. **Runtime**: When accessing edit pages, React checks for valid session
3. **Authentication**: User password is hashed client-side and compared with stored hash
4. **Session**: Valid authentication stores a token in `sessionStorage`

## 🔍 Technical Details

### Files Modified

- `src/components/auth/PasswordProtection.tsx` - Password UI and logic
- `src/config/password.ts` - Password hash configuration (reads from env var)
- `src/app/resume/edit/page.tsx` - Wrapped with PasswordProtection
- `src/app/cover-letter/edit/page.tsx` - Wrapped with PasswordProtection
- `.github/workflows/deploy.yml` - Uses GitHub secret during build
- `scripts/generate-password-hash.js` - Hash generation utility
- `.env.example` - Example environment variables
- `.gitignore` - Excludes .env files and password.ts from version control

### Dependencies Added

- `bcryptjs` - Password hashing library
- `@types/bcryptjs` - TypeScript types for bcryptjs

### Security Measures Implemented

✅ Password is hashed with bcrypt (10 salt rounds)
✅ Hash is stored in GitHub Secrets (not in code)
✅ Session has 24-hour expiry
✅ Sessions clear on tab close
✅ Logout functionality provided
✅ Password visibility toggle
✅ Loading states to prevent race conditions

### Security Limitations

❌ Hash is visible in built JavaScript files
❌ No rate limiting on failed attempts
❌ No server-side validation
❌ No audit logs
❌ Can be bypassed by tech-savvy users

## 🔄 Updating Password

To change the password:

1. Generate a new hash: `node scripts/generate-password-hash.js "new-password"`
2. Update the GitHub Secret with the new hash
3. Redeploy: `git commit --allow-empty -m "redeploy" && git push`

## ❓ Troubleshooting

### Password Protection Not Working

**Issue**: Edit pages show password prompt but you want them publicly accessible.

**Solution**:
- Remove `NEXT_PUBLIC_EDIT_PASSWORD_HASH` from `.env.local`
- Or comment it out with `#`
- Restart dev server
- Edit pages will now be publicly accessible

**Issue**: Password prompt not showing when you want protection enabled.

**Solution**:
1. **Local Development**:
   - Create `.env.local` with: `NEXT_PUBLIC_EDIT_PASSWORD_HASH=your-hash`
   - Restart dev server: `npm run dev`

2. **Production**:
   - Verify GitHub Secret exists: Settings → Secrets → Actions
   - Check secret name is exactly: `NEXT_PUBLIC_EDIT_PASSWORD_HASH`
   - Redeploy to trigger new build with secret

### Password Doesn't Work

**Causes**:
- Hash was generated incorrectly
- Hash doesn't match GitHub secret
- Browser cached old version

**Solutions**:
1. Regenerate hash and update secret
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try incognito/private mode
4. Check browser console for errors (F12)

### Page Loads Without Password Prompt

**Causes**:
- Already authenticated (session active)
- Environment variable not injected

**Solutions**:
1. Click "Logout" button or clear `sessionStorage`
2. Verify GitHub secret is set correctly
3. Check browser console: `console.log(process.env.NEXT_PUBLIC_EDIT_PASSWORD_HASH)`

## 📚 Additional Resources

- [bcrypt.js Documentation](https://github.com/dcodeIO/bcrypt.js)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## 🚀 For Better Security

If you need real authentication, consider:

1. **Vercel**: Free hosting with edge middleware
   - Real authentication before page loads
   - Environment variables properly secured
   - Better Next.js support

2. **Netlify**: Similar to Vercel with edge functions

3. **Cloudflare Workers**: Add authentication layer in front of GitHub Pages

4. **Auth0/Clerk**: Full authentication service

---

**Questions?** Check the GitHub Issues or README for support.
