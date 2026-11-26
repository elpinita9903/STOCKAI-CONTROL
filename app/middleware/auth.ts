export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/') {
    return
  }

  const { data, error } = await useFetch('/api/auth/me')
  const user = data.value?.user

  if (error.value || !user) {
    return navigateTo('/')
  }

  if (to.path === '/users' && user.role !== 'admin') {
    return navigateTo('/dashboard')
  }
})
