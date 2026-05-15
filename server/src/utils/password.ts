// Uses Web Crypto API (available in CF Workers & modern browsers)
// PBKDF2 with SHA-256, 100k iterations + 16-byte random salt

/**
 * Hashes a plain-text password.
 * Returns a base64-encoded string: [16-byte salt | 32-byte hash]
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    256
  );

  const combined = new Uint8Array(16 + 32);
  combined.set(salt, 0);
  combined.set(new Uint8Array(hashBuffer), 16);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Verifies a plain-text password against a stored hash.
 * Uses constant-time comparison to prevent timing attacks.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const combined = Uint8Array.from(atob(storedHash), (c) => c.charCodeAt(0));

    const salt = combined.slice(0, 16);
    const stored = combined.slice(16);

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const hashBuffer = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
      keyMaterial,
      256
    );

    const incoming = new Uint8Array(hashBuffer);

    // Constant-time comparison
    if (incoming.length !== stored.length) return false;
    let diff = 0;
    for (let i = 0; i < incoming.length; i++) {
      diff |= incoming[i] ^ stored[i];
    }
    return diff === 0;
  } catch {
    return false;
  }
}
