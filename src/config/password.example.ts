// Password hash configuration TEMPLATE
// Copy this file to password.ts and add your bcrypt hash

// To generate a password hash:
// 1. Run: node scripts/generate-password-hash.js
// 2. Enter your desired password
// 3. Copy the hash below

// Password hash configuration
export const PASSWORD_HASH =
  typeof window !== 'undefined'
    ? undefined // Client-side: will be injected at build time
    : process.env.NEXT_PUBLIC_EDIT_PASSWORD_HASH ||
      'YOUR_BCRYPT_HASH_HERE'; // Replace with your bcrypt hash

// For client components, export a function that gets the hash
export function getPasswordHash(): string | undefined {
  // Try to get from window object (injected at build time)
  if (typeof window !== 'undefined' && (window as any).__PASSWORD_HASH__) {
    return (window as any).__PASSWORD_HASH__;
  }

  // Fallback to environment variable (works in dev mode)
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_EDIT_PASSWORD_HASH;
  }

  // Last resort: hardcoded for local development
  return 'YOUR_BCRYPT_HASH_HERE'; // Replace with your bcrypt hash
}
