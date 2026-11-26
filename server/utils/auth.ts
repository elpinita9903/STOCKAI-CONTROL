import { createHash, randomBytes } from 'node:crypto'
import { createError, deleteCookie, getCookie, setCookie, type H3Event } from 'h3'
import { getDatabase } from './database'

const SESSION_COOKIE = 'stockai_session'
const SESSION_DURATION = {
  remembered: 30 * 24 * 60 * 60,
  temporary: 12 * 60 * 60
} as const

export interface AuthenticatedUser {
  id: string
  username: string
  displayName: string
  role: 'admin' | 'employee'
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function createSession(
  event: H3Event,
  userId: string,
  rememberMe: boolean
): Promise<void> {
  const database = await getDatabase(event)
  const token = randomBytes(32).toString('base64url')
  const duration = rememberMe ? SESSION_DURATION.remembered : SESSION_DURATION.temporary
  const expiresAt = new Date(Date.now() + duration * 1000)

  await database.query(
    'INSERT INTO app_sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)',
    [hashToken(token), userId, expiresAt]
  )

  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: duration,
    expires: expiresAt
  })
}

export async function getAuthenticatedUser(event: H3Event): Promise<AuthenticatedUser | null> {
  const token = getCookie(event, SESSION_COOKIE)

  if (!token) {
    return null
  }

  const database = await getDatabase(event)
  const result = await database.query<AuthenticatedUser>(
    `SELECT u.id::text AS id,
            u.username,
            u.display_name AS "displayName",
            u.role
     FROM app_sessions s
     JOIN app_users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
    [hashToken(token)]
  )

  if (!result.rows[0]) {
    deleteCookie(event, SESSION_COOKIE, { path: '/' })
    return null
  }

  return result.rows[0]
}

export async function requireUser(event: H3Event): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(event)

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Inicia sesión para continuar.' })
  }

  return user
}

export async function requireAdmin(event: H3Event): Promise<AuthenticatedUser> {
  const user = await requireUser(event)

  if (user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Esta acción requiere permisos de administrador.' })
  }

  return user
}

export async function destroySession(event: H3Event): Promise<void> {
  const token = getCookie(event, SESSION_COOKIE)
  deleteCookie(event, SESSION_COOKIE, { path: '/' })

  if (!token) {
    return
  }

  const database = await getDatabase(event)
  await database.query('DELETE FROM app_sessions WHERE token_hash = $1', [hashToken(token)])
}
