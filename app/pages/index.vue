<script setup lang="ts">
const username = ref('angel')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(true)
const isSubmitting = ref(false)
const notice = ref('')

useSeoMeta({
  title: 'Acceso de empleados | STOCKAI CONTROL',
  description: 'Accede de forma segura al espacio de trabajo del equipo StockAI.'
})

async function handleSubmit() {
  if (isSubmitting.value) {
    return
  }

  notice.value = ''
  isSubmitting.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value,
        rememberMe: rememberMe.value
      }
    })
    await navigateTo('/dashboard')
  } catch (error) {
    notice.value = getApiErrorMessage(error, 'No se pudo iniciar sesión. Inténtalo de nuevo.')
  } finally {
    isSubmitting.value = false
  }
}

function handleRecovery() {
  notice.value = 'Para recuperar el acceso, contacta al administrador del sistema.'
}
</script>

<template>
  <main class="login-shell min-h-dvh bg-[#f7f8f5] p-1 sm:p-4 lg:p-5">
    <div class="login-frame mx-auto grid min-h-[calc(100dvh-0.5rem)] max-w-[1440px] overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_rgba(27,42,37,0.09)] sm:min-h-[calc(100dvh-2rem)] lg:min-h-[calc(100dvh-2.5rem)] lg:grid-cols-[1.05fr_0.95fr] lg:rounded-[32px]">
      <section class="login-promo relative hidden overflow-hidden bg-[#153c34] px-7 py-6 text-white lg:flex lg:flex-col lg:px-12 lg:py-8 xl:px-16">
        <div class="absolute -left-36 -top-32 h-[440px] w-[440px] rounded-full border border-white/[0.08]" />
        <div class="absolute -left-20 -top-16 h-[310px] w-[310px] rounded-full border border-white/[0.08]" />
        <div class="absolute bottom-0 -right-36 h-[338px] w-[530px] rounded-full bg-[#2c6555]/50 blur-[2px]" />

        <a class="relative z-10 inline-flex w-fit items-center gap-3" href="/" aria-label="STOCKAI CONTROL, inicio">
          <span class="grid h-11 w-11 place-items-center rounded-2xl bg-[#d7f278] text-lg font-bold tracking-[-0.06em] text-[#183d34]">
            S
          </span>
          <span class="flex items-baseline gap-2">
            <span class="text-[20px] font-semibold tracking-[-0.055em]">STOCK<span class="text-[#d7f278]">AI</span></span>
            <span class="text-[9px] font-semibold uppercase tracking-[0.17em] text-white/55">CONTROL</span>
          </span>
        </a>

        <div class="login-promo-copy relative z-10 mt-16 max-w-xl xl:mt-20">
          <p class="mb-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#c5dfb1]">
            <span class="h-1.5 w-1.5 rounded-full bg-[#d7f278]" />
            Portal privado del equipo
          </p>
          <h1 class="max-w-lg text-5xl font-medium leading-[1.08] tracking-[-0.055em] xl:text-[60px]">
            El siguiente gran paso de StockAI empieza contigo.
          </h1>
          <p class="mt-6 max-w-md text-base leading-7 text-white/65">
            Tu espacio para comenzar la jornada, encontrar tus herramientas y avanzar junto al equipo.
          </p>
        </div>

        <div class="login-preview relative z-10 mt-auto pt-8">
          <div class="mx-auto max-w-[430px] rounded-[22px] border border-white/10 bg-[#f8faf5] p-5 text-[#1e332d] shadow-[0_28px_70px_rgba(4,23,17,0.28)] xl:translate-x-5">
            <div class="flex items-center justify-between border-b border-[#e8ece6] pb-3">
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#74817b]">StockAI · equipo</p>
                <p class="mt-1 text-[22px] font-semibold tracking-[-0.05em]">Juntos, todo fluye.</p>
              </div>
              <span class="grid h-9 w-9 place-items-center rounded-xl bg-[#e6f4d5] text-[#456b37]">
                <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
            <div class="mt-3 grid grid-cols-3 gap-2 text-center">
              <div class="rounded-xl bg-[#edf2eb] px-2 py-3">
                <span class="mb-2 grid h-7 w-7 place-items-center rounded-lg bg-white text-[10px] font-semibold text-[#567c5b]">01</span>
                <span class="text-[10px] font-medium text-[#53645a]">Tu jornada</span>
              </div>
              <div class="rounded-xl bg-[#edf2eb] px-2 py-3">
                <span class="mb-2 grid h-7 w-7 place-items-center rounded-lg bg-white text-[10px] font-semibold text-[#567c5b]">02</span>
                <span class="text-[10px] font-medium text-[#53645a]">Tus herramientas</span>
              </div>
              <div class="rounded-xl bg-[#edf2eb] px-2 py-3">
                <span class="mb-2 grid h-7 w-7 place-items-center rounded-lg bg-white text-[10px] font-semibold text-[#567c5b]">03</span>
                <span class="text-[10px] font-medium text-[#53645a]">Tu equipo</span>
              </div>
            </div>
          </div>
          <p class="mt-5 text-xs text-white/45">Cada persona suma. Cada jornada cuenta.</p>
        </div>
      </section>

      <section class="login-form-section flex items-center justify-center px-5 py-6 sm:px-10 lg:px-12 xl:px-20">
        <div class="w-full max-w-[420px]">
          <a class="login-mobile-brand mb-6 inline-flex items-center gap-2.5 lg:hidden" href="/" aria-label="STOCKAI CONTROL, inicio">
            <span class="grid h-10 w-10 place-items-center rounded-[14px] bg-[#153c34] text-base font-bold tracking-[-0.06em] text-[#d7f278]">
              S
            </span>
            <span class="flex items-baseline gap-2">
              <span class="text-[18px] font-semibold tracking-[-0.055em] text-[#1e332d]">STOCK<span class="text-[#789d4d]">AI</span></span>
              <span class="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#89948e]">CONTROL</span>
            </span>
          </a>

          <div class="login-form-heading mb-5">
            <p class="mb-2 text-sm font-medium text-[#789d4d]">Portal de empleados</p>
            <h2 class="text-[34px] font-semibold leading-tight tracking-[-0.055em] text-[#1e332d] sm:text-[38px]">Qué bueno tenerte aquí.</h2>
            <p class="mt-2 text-[15px] leading-6 text-[#78817c]">Inicia sesión con tu cuenta StockAI para comenzar tu jornada.</p>
          </div>

          <form class="space-y-3" @submit.prevent="handleSubmit">
            <div>
              <label for="username" class="mb-2 block text-[13px] font-medium text-[#33423b]">Usuario</label>
              <input
                id="username"
                v-model="username"
                type="text"
                name="username"
                autocomplete="username"
                placeholder="angel"
                required
                maxlength="40"
                class="h-12 w-full rounded-xl border border-[#e1e6e1] bg-white px-4 text-sm text-[#1e332d] outline-none transition placeholder:text-[#aab2ad] hover:border-[#c5d0c7] focus:border-[#638c69] focus:ring-4 focus:ring-[#638c69]/10"
              >
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between">
                <label for="password" class="block text-[13px] font-medium text-[#33423b]">Contraseña</label>
                <button type="button" class="text-xs font-medium text-[#5b815b] transition hover:text-[#254d39]" @click="handleRecovery">
                  ¿La olvidaste?
                </button>
              </div>
              <div class="relative">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  name="password"
                  autocomplete="current-password"
                  placeholder="Escribe tu contraseña"
                  required
                  maxlength="128"
                  class="h-12 w-full rounded-xl border border-[#e1e6e1] bg-white px-4 pr-12 text-sm text-[#1e332d] outline-none transition placeholder:text-[#aab2ad] hover:border-[#c5d0c7] focus:border-[#638c69] focus:ring-4 focus:ring-[#638c69]/10"
                >
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 grid w-12 place-items-center text-[#8c9690] transition hover:text-[#385b48]"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  :aria-pressed="showPassword"
                  @click="showPassword = !showPassword"
                >
                  <svg v-if="!showPassword" viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="none" aria-hidden="true">
                    <path d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                    <circle cx="12" cy="12" r="2.7" stroke="currentColor" stroke-width="1.6" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="none" aria-hidden="true">
                    <path d="m3 3 18 18M10.6 6.2A10.7 10.7 0 0 1 12 6c6.3 0 9.5 6 9.5 6a15 15 0 0 1-3 3.5M6.2 6.8C3.8 8.3 2.5 12 2.5 12s3.2 6 9.5 6c1 0 1.9-.2 2.7-.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            <label class="inline-flex cursor-pointer items-center gap-2.5 pt-0.5 text-[13px] text-[#626f67]">
              <input v-model="rememberMe" type="checkbox" class="h-4 w-4 rounded border-[#cdd5ce] accent-[#315d45] focus:ring-[#638c69]">
              Mantener sesión iniciada
            </label>

            <button type="submit" :disabled="isSubmitting" class="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1d4939] text-sm font-semibold text-white shadow-[0_5px_12px_rgba(29,73,57,0.12)] transition hover:bg-[#153c34] focus:outline-none focus:ring-4 focus:ring-[#638c69]/25 disabled:cursor-wait disabled:opacity-70">
              {{ isSubmitting ? 'Verificando acceso…' : 'Entrar a mi cuenta' }}
              <svg viewBox="0 0 20 20" class="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" aria-hidden="true">
                <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </form>

          <p v-if="notice" role="alert" class="mt-5 rounded-xl border border-[#e6e8d4] bg-[#faf9ef] px-4 py-3 text-[13px] leading-5 text-[#646144]">
            {{ notice }}
          </p>

          <div class="login-divider my-5 flex items-center gap-4">
            <span class="h-px flex-1 bg-[#edf0ec]" />
            <span class="text-[11px] font-medium uppercase tracking-[0.12em] text-[#a2aaa4]">Acceso seguro</span>
            <span class="h-px flex-1 bg-[#edf0ec]" />
          </div>

          <p class="text-center text-xs leading-5 text-[#98a19b]">
            Al continuar, aceptas nuestros
            <a href="#" class="text-[#637c65] underline decoration-[#c6d1c5] underline-offset-2 hover:text-[#315d45]">términos de servicio</a>
            y
            <a href="#" class="text-[#637c65] underline decoration-[#c6d1c5] underline-offset-2 hover:text-[#315d45]">política de privacidad</a>.
          </p>

          <p class="login-footer mt-5 text-center text-xs text-[#a2aaa4]">© 2026 STOCKAI CONTROL · Acceso exclusivo para el equipo.</p>
        </div>
      </section>
    </div>
  </main>
</template>
