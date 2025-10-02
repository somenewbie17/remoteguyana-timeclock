// Hint for Next.js to keep this server-only, but avoid resolving in Vitest
try { require('server-only') } catch {}

export async function hashPassword(pw: string) {
  const { Argon2id } = await import('oslo/password')
  const hasher = new Argon2id()
  return await hasher.hash(pw)
}

export async function verifyPassword(hash: string, pw: string) {
  const { Argon2id } = await import('oslo/password')
  const hasher = new Argon2id()
  return await hasher.verify(hash, pw)
}
