import { Argon2id } from 'oslo/password'

function uuid() {
  return (globalThis.crypto ?? require('node:crypto').webcrypto).randomUUID()
}

async function main() {
  const managerPass = await new Argon2id().hash('manager123')
  const employeePass = await new Argon2id().hash('employee123')

  const managerId = uuid()
  const employeeId = uuid()

  const sql = `-- Paste into Turso SQL console
INSERT INTO users (id, email, password_hash, role, first_name, last_name, timezone)
VALUES
  ('${managerId}', 'manager@example.com', '${managerPass.replace(/'/g, "''")}', 'manager', 'Manager', 'User', 'America/Guyana'),
  ('${employeeId}', 'employee@example.com', '${employeePass.replace(/'/g, "''")}', 'employee', 'Employee', 'User', 'America/Guyana');
`
  console.log(sql)
}

main()
