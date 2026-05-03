export function encodeUserForPath(username?: string) {
  if (!username) return '';
  return encodeURIComponent(username);
}

export function sanitizeUsernameToSlug(username?: string) {
  if (!username) return '';

  try {
    // 1. Decode percent-encoded characters (e.g., "gonçalo%40!tomás" → "gonçalo@!tomás")
    let slug = decodeURIComponent(username);

    // 2. Normalize unicode and remove diacritics (ç→c, á→a, etc.)
    slug = slug.normalize('NFD').replace(/\p{Diacritic}/gu, '');

    // 3. Convert to lowercase
    slug = slug.toLowerCase();

    // 4. Replace spaces and sequences of invalid chars with single hyphen
    slug = slug
      .replace(/\s+/g, '-') // spaces → hyphens
      .replace(/[^\p{L}\p{N}-]/gu, '-') // invalid chars → hyphens
      .replace(/-+/g, '-'); // collapse consecutive hyphens

    // 5. Trim hyphens from start/end
    slug = slug.replace(/^-+|-+$/g, '');

    // 6. Return empty string if result is empty (all chars were invalid)
    return slug || '';
  } catch {
    // Fallback if decodeURIComponent throws
    return '';
  }
}

export type ValidationResult = {
  valid: boolean;
  error?: string;
};

// All reserved routes that can't be used as usernames
const RESERVED_USERNAMES = [
  // Auth routes
  'login',
  'register',
  'onboarding',
  'auth',

  'account',
  'present',
  'future',
  'others',
  'recommendations',

  // API/System
  'api',
  'settings',
  'user',
  'users',

  'home',
  'about',
  'help',
  'contact',
  'search',
];

export function validateUsername(slug: string): ValidationResult {
  if (!slug) {
    return { valid: false, error: 'Username cannot be empty' };
  }

  if (slug.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (slug.length > 30) {
    return { valid: false, error: 'Username must be at most 30 characters' };
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and hyphens' };
  }

  if (RESERVED_USERNAMES.includes(slug)) {
    return { valid: false, error: `"${slug}" is a reserved name and cannot be used as a username` };
  }

  return { valid: true };
}

export function isValidUsername(slug: string): boolean {
  return validateUsername(slug).valid;
}
