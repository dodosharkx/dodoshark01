import { getCloudflareContext } from '@opennextjs/cloudflare'

type D1PreparedStatementResult = {
  run(): Promise<unknown>
}

type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatementResult
}

type D1DatabaseBinding = {
  prepare(query: string): D1PreparedStatement
}

export type ContactLeadRecord = {
  id: string
  name: string
  email: string
  city: string
  whatsapp: string
  message: string
  createdAt: string
}

function getContactLeadsDb() {
  const { env } = getCloudflareContext()
  const db = env?.DB as D1DatabaseBinding | undefined

  if (!db) {
    throw new Error('Cloudflare D1 binding "DB" is not configured.')
  }

  return db
}

export async function insertContactLead(record: ContactLeadRecord) {
  const db = getContactLeadsDb()

  await db
    .prepare(
      `INSERT INTO contact_form_submissions (
        id,
        name,
        email,
        city,
        whatsapp,
        message,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      record.id,
      record.name,
      record.email,
      record.city,
      record.whatsapp,
      record.message,
      record.createdAt,
    )
    .run()
}
