import { setResponseHeader } from 'h3'
import { requireAdmin } from '../../utils/auth'
import { getDatabase } from '../../utils/database'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  await requireAdmin(event)

  const database = await getDatabase(event)
  const result = await database.query<{
    id: string
    username: string
    displayName: string
    role: 'admin' | 'employee'
    createdAt: Date
  }>(
    `SELECT id::text AS id,
            username,
            display_name AS "displayName",
            role,
            created_at AS "createdAt"
     FROM app_users
     ORDER BY created_at DESC`
  )

  return { users: result.rows }
})
