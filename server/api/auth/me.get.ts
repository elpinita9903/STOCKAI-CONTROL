import { setResponseHeader } from 'h3'
import { getAuthenticatedUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')

  return {
    user: await getAuthenticatedUser(event)
  }
})
