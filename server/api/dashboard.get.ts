import { setResponseHeader } from 'h3'
import { requireUser } from '../utils/auth'
import { getDatabase } from '../utils/database'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  const user = await requireUser(event)
  const database = await getDatabase(event)

  if (user.role !== 'admin') {
    return { user, metrics: null, recentUsers: [] }
  }

  const [counts, recentUsers] = await Promise.all([
    database.query<{ totalUsers: number; employeeCount: number }>(
      `SELECT COUNT(*)::int AS "totalUsers",
              COUNT(*) FILTER (WHERE role = 'employee')::int AS "employeeCount"
       FROM app_users`
    ),
    database.query<{
      id: string
      username: string
      displayName: string
      role: 'admin' | 'employee'
    }>(
      `SELECT id::text AS id,
              username,
              display_name AS "displayName",
              role
       FROM app_users
       ORDER BY created_at DESC
       LIMIT 5`
    )
  ])

  return {
    user,
    metrics: counts.rows[0],
    recentUsers: recentUsers.rows
  }
})
