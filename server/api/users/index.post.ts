import bcrypt from 'bcryptjs'
import { createError, readBody } from 'h3'
import { requireAdmin } from '../../utils/auth'
import { getDatabase } from '../../utils/database'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody<unknown>(event)

  if (
    typeof body !== 'object' ||
    body === null ||
    !('username' in body) ||
    !('displayName' in body) ||
    !('password' in body) ||
    typeof body.username !== 'string' ||
    typeof body.displayName !== 'string' ||
    typeof body.password !== 'string'
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Completa los datos del empleado.' })
  }

  const username = body.username.trim().toLowerCase()
  const displayName = body.displayName.trim()
  const password = body.password

  if (!/^[a-z0-9._-]{3,40}$/.test(username)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El usuario debe tener entre 3 y 40 caracteres: letras, números, punto, guion o guion bajo.'
    })
  }

  if (displayName.length < 2 || displayName.length > 100) {
    throw createError({ statusCode: 400, statusMessage: 'El nombre debe tener entre 2 y 100 caracteres.' })
  }

  if (password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
    throw createError({
      statusCode: 400,
      statusMessage: 'La contraseña debe tener al menos 12 caracteres y no superar 72 bytes.'
    })
  }

  const config = useRuntimeConfig(event)
  if (username === config.bootstrapAdminUsername.trim().toLowerCase()) {
    throw createError({ statusCode: 409, statusMessage: 'Ese usuario está reservado para el administrador inicial.' })
  }

  const database = await getDatabase(event)
  const passwordHash = await bcrypt.hash(password, 12)

  try {
    const result = await database.query<{
      id: string
      username: string
      displayName: string
      role: 'employee'
      createdAt: Date
    }>(
      `INSERT INTO app_users (username, display_name, password_hash, role)
       VALUES ($1, $2, $3, 'employee')
       RETURNING id::text AS id,
                 username,
                 display_name AS "displayName",
                 role,
                 created_at AS "createdAt"`,
      [username, displayName, passwordHash]
    )

    return { user: result.rows[0] }
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'Ese nombre de usuario ya está registrado.' })
    }

    throw error
  }
})
