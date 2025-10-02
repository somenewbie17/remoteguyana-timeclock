import { Argon2id } from 'oslo/password'

async function main() {
  const pwd = process.argv[2]
  if (!pwd) {
    console.error('Usage: pnpm tsx scripts/hash-password.ts <password>')
    process.exit(1)
  }
  const hash = await new Argon2id().hash(pwd)
  console.log(hash)
}

main().catch((e) => { console.error(e); process.exit(1) })
