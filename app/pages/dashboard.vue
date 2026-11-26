<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Panel | STOCKAI CONTROL',
  description: 'Panel de trabajo del equipo StockAI.'
})

const { data: overview } = await useFetch('/api/dashboard')
const logoutError = ref('')
const user = computed(() => overview.value?.user)
const isAdmin = computed(() => user.value?.role === 'admin')

async function logout() {
  logoutError.value = ''

  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await navigateTo('/')
  } catch (error) {
    logoutError.value = getApiErrorMessage(error, 'No se pudo cerrar la sesión. Inténtalo otra vez.')
  }
}
</script>

<template>
  <div class="min-h-dvh bg-[#f5f7f4] text-[#21352d] lg:grid lg:grid-cols-[250px_1fr]">
    <aside class="hidden min-h-dvh flex-col bg-[#153c34] px-5 py-7 text-white lg:flex">
      <NuxtLink to="/dashboard" class="mb-12 flex items-center gap-3" aria-label="STOCKAI CONTROL">
        <span class="grid h-10 w-10 place-items-center rounded-xl bg-[#d7f278] text-base font-bold text-[#183d34]">S</span>
        <span class="flex flex-col leading-none">
          <span class="text-[16px] font-semibold tracking-[-0.05em]">STOCK<span class="text-[#d7f278]">AI</span></span>
          <span class="mt-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-white/55">CONTROL</span>
        </span>
      </NuxtLink>

      <p class="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Espacio de trabajo</p>
      <nav class="space-y-1">
        <NuxtLink to="/dashboard" class="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-sm font-medium text-white">
          <span class="grid h-7 w-7 place-items-center rounded-lg bg-white/10">⌂</span>
          Resumen
        </NuxtLink>
        <NuxtLink v-if="isAdmin" to="/users" class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/65 transition hover:bg-white/10 hover:text-white">
          <span class="grid h-7 w-7 place-items-center rounded-lg bg-white/10">+</span>
          Empleados
        </NuxtLink>
      </nav>

      <div class="mt-auto rounded-2xl border border-white/10 bg-white/[0.06] p-4">
        <p class="text-xs font-medium text-white/80">Cada persona suma.</p>
        <p class="mt-1 text-[11px] leading-5 text-white/45">Un espacio de trabajo para todo el equipo StockAI.</p>
      </div>
    </aside>

    <div class="min-w-0">
      <header class="flex h-[76px] items-center justify-between border-b border-[#e8ece7] bg-white px-5 sm:px-8 lg:px-10">
        <NuxtLink to="/dashboard" class="flex items-center gap-2.5 lg:hidden" aria-label="STOCKAI CONTROL">
          <span class="grid h-9 w-9 place-items-center rounded-xl bg-[#153c34] text-sm font-bold text-[#d7f278]">S</span>
          <span class="text-sm font-semibold tracking-[-0.04em]">STOCK<span class="text-[#789d4d]">AI</span> <span class="text-[9px] uppercase tracking-[0.14em] text-[#85918a]">CONTROL</span></span>
        </NuxtLink>
        <p class="hidden text-sm font-medium text-[#68766e] lg:block">Panel de trabajo <span class="mx-2 text-[#c8d0ca]">/</span> <span class="text-[#283d33]">Resumen</span></p>
        <div class="ml-auto flex items-center gap-3">
          <div class="hidden text-right sm:block">
            <p class="text-xs font-semibold text-[#2e4238]">{{ user?.displayName }}</p>
            <p class="mt-0.5 text-[10px] capitalize text-[#8b9690]">{{ user?.role === 'admin' ? 'Administrador' : 'Empleado' }}</p>
          </div>
          <span class="grid h-9 w-9 place-items-center rounded-full bg-[#e6eedf] text-xs font-semibold text-[#466449]">
            {{ user?.displayName?.slice(0, 1).toUpperCase() }}
          </span>
          <button type="button" class="rounded-lg px-2 py-2 text-xs font-medium text-[#728078] transition hover:bg-[#f1f4ef] hover:text-[#294b39]" @click="logout">
            Salir
          </button>
        </div>
      </header>

      <main class="mx-auto max-w-[1250px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div class="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#789d4d]">STOCKAI CONTROL</p>
            <h1 class="text-[30px] font-semibold tracking-[-0.055em] text-[#20372d] sm:text-[36px]">
              Hola, {{ user?.displayName }}.
            </h1>
            <p class="mt-2 text-sm text-[#7b8780]">Tu espacio de trabajo está listo. ¿Qué hacemos hoy?</p>
          </div>
          <NuxtLink v-if="isAdmin" to="/users" class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1d4939] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#153c34]">
            <span class="text-lg leading-none">+</span>
            Crear empleado
          </NuxtLink>
        </div>

        <p v-if="logoutError" role="alert" class="mb-6 rounded-xl border border-[#f1d7d2] bg-white px-4 py-3 text-sm text-[#a34c3f]">
          {{ logoutError }}
        </p>

        <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <article class="rounded-2xl border border-[#e7ebe5] bg-white p-5 shadow-[0_3px_14px_rgba(27,42,37,0.03)]">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-medium text-[#7d8981]">{{ isAdmin ? 'Personas en el equipo' : 'Tu acceso' }}</p>
                <p class="mt-3 text-[30px] font-semibold tracking-[-0.05em] text-[#243a30]">
                  {{ isAdmin ? overview?.metrics?.totalUsers : 'Activo' }}
                </p>
              </div>
              <span class="grid h-10 w-10 place-items-center rounded-xl bg-[#edf4e8] text-[#63845b]">◎</span>
            </div>
            <p class="mt-3 text-xs text-[#99a29c]">{{ isAdmin ? 'Cuentas registradas en StockAI' : 'Tu cuenta está lista para trabajar' }}</p>
          </article>

          <article class="rounded-2xl border border-[#e7ebe5] bg-white p-5 shadow-[0_3px_14px_rgba(27,42,37,0.03)]">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-medium text-[#7d8981]">Tu rol</p>
                <p class="mt-3 text-[24px] font-semibold tracking-[-0.045em] text-[#243a30]">{{ isAdmin ? 'Administrador' : 'Empleado' }}</p>
              </div>
              <span class="grid h-10 w-10 place-items-center rounded-xl bg-[#f5f1e5] text-[#a38a4e]">✳</span>
            </div>
            <p class="mt-3 text-xs text-[#99a29c]">{{ isAdmin ? 'Control del espacio de trabajo' : 'Parte del equipo StockAI' }}</p>
          </article>

          <article class="rounded-2xl border border-[#e7ebe5] bg-white p-5 shadow-[0_3px_14px_rgba(27,42,37,0.03)] sm:col-span-2 xl:col-span-1">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-medium text-[#7d8981]">{{ isAdmin ? 'Empleados' : 'Tu espacio' }}</p>
                <p class="mt-3 text-[30px] font-semibold tracking-[-0.05em] text-[#243a30]">
                  {{ isAdmin ? overview?.metrics?.employeeCount : 'StockAI' }}
                </p>
              </div>
              <span class="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf0f3] text-[#5d7e8d]">↗</span>
            </div>
            <p class="mt-3 text-xs text-[#99a29c]">{{ isAdmin ? 'Cuentas de empleado activas' : 'Juntos, todo fluye' }}</p>
          </article>
        </section>

        <section class="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div class="rounded-2xl border border-[#e7ebe5] bg-white p-5 sm:p-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-base font-semibold text-[#2c4136]">Personas del equipo</h2>
                <p class="mt-1 text-xs text-[#929c95]">Cuentas creadas recientemente</p>
              </div>
              <NuxtLink v-if="isAdmin" to="/users" class="text-xs font-semibold text-[#5f805b] hover:text-[#294b39]">Ver empleados</NuxtLink>
            </div>

            <div v-if="isAdmin && overview?.recentUsers.length" class="mt-5 divide-y divide-[#eff1ed]">
              <div v-for="person in overview.recentUsers" :key="person.id" class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span class="grid h-9 w-9 place-items-center rounded-full bg-[#edf4e8] text-xs font-semibold text-[#63845b]">
                  {{ person.displayName.slice(0, 1).toUpperCase() }}
                </span>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-[#3c4d43]">{{ person.displayName }}</p>
                  <p class="mt-0.5 text-xs text-[#9aa39d]">@{{ person.username }}</p>
                </div>
                <span class="rounded-full bg-[#f0f4ed] px-2.5 py-1 text-[10px] font-medium capitalize text-[#6b8069]">
                  {{ person.role === 'admin' ? 'Administrador' : 'Empleado' }}
                </span>
              </div>
            </div>

            <div v-else-if="isAdmin" class="mt-5 rounded-xl bg-[#f7f8f5] px-4 py-5 text-sm text-[#7c8980]">
              Aún no hay empleados. Crea la primera cuenta para invitar a tu equipo.
            </div>

            <div v-else class="mt-5 rounded-xl bg-[#f7f8f5] px-4 py-5">
              <p class="text-sm font-medium text-[#53665a]">Bienvenido a tu espacio StockAI.</p>
              <p class="mt-1 text-xs leading-5 text-[#8b9690]">Tu acceso está activo. El equipo está preparando más herramientas para ti.</p>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-2xl bg-[#193f35] p-6 text-white">
            <div class="absolute -bottom-16 -right-10 h-48 w-48 rounded-full border border-white/10" />
            <div class="relative">
              <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c5dfb1]">Equipo StockAI</p>
              <h2 class="mt-4 max-w-xs text-[25px] font-medium leading-tight tracking-[-0.04em]">Cada jornada suma a algo más grande.</h2>
              <p class="mt-3 max-w-xs text-sm leading-6 text-white/60">Gracias por ser parte de lo que estamos construyendo juntos.</p>
              <NuxtLink v-if="isAdmin" to="/users" class="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#d7f278] hover:text-white">
                Gestionar el equipo <span aria-hidden="true">→</span>
              </NuxtLink>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
