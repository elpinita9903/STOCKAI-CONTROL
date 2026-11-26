import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  sourcemap: {
    server: process.env.NODE_ENV !== 'production',
    client: process.env.NODE_ENV !== 'production'
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    databaseUrl: '',
    bootstrapAdminUsername: 'angel',
    bootstrapAdminName: 'Angel',
    bootstrapAdminPassword: ''
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
