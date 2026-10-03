/**
 * Native Web Crypto API PBKDF2 Implementation
 * Runs in native C++ V8 isolate on Cloudflare Workers (< 1-2ms CPU time),
 * completely bypassing pure-JS bcrypt/argon2 CPU timeouts on the Free Plan.
 */

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  // Generate a cryptographically random 16-byte salt
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  const salt = bufferToHex(saltBytes.buffer);

  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 20000,
      hash: "SHA-256",
    },
    keyMaterial,
    256 // 32 bytes
  );

  const hash = bufferToHex(derivedBits);
  return { hash, salt };
}

export async function verifyPassword(
  password: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 20000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const computedHash = bufferToHex(derivedBits);
  return timingSafeEqual(computedHash, storedHash);
}
