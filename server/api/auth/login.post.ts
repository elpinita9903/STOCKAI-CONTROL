import bcrypt from 'bcryptjs'
import { createError, readBody } from 'h3'
import { createSession } from '../../utils/auth'
import { getDatabase } from '../../utils/database'

export default defineEventHandler(async (event) => {
  const body = await readBody<unknown>(event)

  if (
    typeof body !== 'object' ||
    body === null ||
    !('username' in body) ||
    !('password' in body) ||
    typeof body.username !== 'string' ||
    typeof body.password !== 'string'
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Escribe tu usuario y contraseña.' })
  }

  const username = body.username.trim().toLowerCase()
  const password = body.password

  if (!/^[a-z0-9._-]{3,40}$/.test(username) || Buffer.byteLength(password, 'utf8') > 72) {
    throw createError({ statusCode: 401, statusMessage: 'Usuario o contraseña incorrectos.' })
  }

  const database = await getDatabase(event)
  const result = await database.query<{
    id: string
    username: string
    displayName: string
    role: 'admin' | 'employee'
    passwordHash: string
  }>(
    `SELECT id::text AS id,
            username,
            display_name AS "displayName",
            role,
            password_hash AS "passwordHash"
     FROM app_users
     WHERE username = $1`,
    [username]
  )
  const user = result.rows[0]

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw createError({ statusCode: 401, statusMessage: 'Usuario o contraseña incorrectos.' })
  }

  const rememberMe = typeof body.rememberMe === 'boolean' ? body.rememberMe : false
  await createSession(event, user.id, rememberMe)

  return {
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role
    }
  }
})
