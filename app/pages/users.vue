<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Empleados | STOCKAI CONTROL',
  description: 'Administra las cuentas de empleado de StockAI.'
})

const displayName = ref('')
const username = ref('')
const password = ref('')
const isSubmitting = ref(false)
const notice = ref('')
const noticeIsError = ref(false)

const { data, error: loadError, pending, refresh } = await useFetch('/api/users')
const users = computed(() => data.value?.users ?? [])

async function createEmployee() {
  if (isSubmitting.value) {
    return
  }

  isSubmitting.value = true
  notice.value = ''
  noticeIsError.value = false

  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: {
        displayName: displayName.value,
        username: username.value,
        password: password.value
      }
    })

    displayName.value = ''
    username.value = ''
    password.value = ''
    notice.value = 'La cuenta de empleado se creó correctamente.'
    await refresh()
  } catch (error) {
    notice.value = getApiErrorMessage(error, 'No se pudo crear la cuenta. Inténtalo de nuevo.')
    noticeIsError.value = true
  } finally {
    isSubmitting.value = false
  }
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/')
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
        <NuxtLink to="/dashboard" class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/65 transition hover:bg-white/10 hover:text-white">
          <span class="grid h-7 w-7 place-items-center rounded-lg bg-white/10">⌂</span>
          Resumen
        </NuxtLink>
        <NuxtLink to="/users" class="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-sm font-medium text-white">
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
        <p class="hidden text-sm font-medium text-[#68766e] lg:block">Panel de trabajo <span class="mx-2 text-[#c8d0ca]">/</span> <span class="text-[#283d33]">Empleados</span></p>
        <div class="ml-auto flex items-center gap-3">
          <NuxtLink to="/dashboard" class="rounded-lg px-3 py-2 text-xs font-medium text-[#728078] transition hover:bg-[#f1f4ef] hover:text-[#294b39]">Panel</NuxtLink>
          <button type="button" class="rounded-lg px-2 py-2 text-xs font-medium text-[#728078] transition hover:bg-[#f1f4ef] hover:text-[#294b39]" @click="logout">Salir</button>
        </div>
      </header>

      <main class="mx-auto max-w-[1250px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div class="mb-8">
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#789d4d]">Administración</p>
          <h1 class="text-[30px] font-semibold tracking-[-0.055em] text-[#20372d] sm:text-[36px]">Cuentas de empleados</h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-[#7b8780]">Crea accesos individuales para el equipo. Cada persona iniciará sesión con su usuario y contraseña.</p>
        </div>

        <div class="grid items-start gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <section class="rounded-2xl border border-[#e7ebe5] bg-white p-5 shadow-[0_3px_14px_rgba(27,42,37,0.03)] sm:p-6">
            <div class="mb-6">
              <h2 class="text-base font-semibold text-[#2c4136]">Crear cuenta</h2>
              <p class="mt-1 text-xs leading-5 text-[#929c95]">La cuenta nueva tendrá permisos de empleado.</p>
            </div>

            <form class="space-y-4" @submit.prevent="createEmployee">
              <div>
                <label for="display-name" class="mb-2 block text-[13px] font-medium text-[#33423b]">Nombre completo</label>
                <input id="display-name" v-model="displayName" required minlength="2" maxlength="100" autocomplete="name" placeholder="Ej. María López" class="h-12 w-full rounded-xl border border-[#e1e6e1] px-4 text-sm text-[#1e332d] outline-none transition placeholder:text-[#aab2ad] focus:border-[#638c69] focus:ring-4 focus:ring-[#638c69]/10">
              </div>

              <div>
                <label for="new-username" class="mb-2 block text-[13px] font-medium text-[#33423b]">Nombre de usuario</label>
                <input id="new-username" v-model="username" required minlength="3" maxlength="40" autocomplete="off" placeholder="maria.lopez" class="h-12 w-full rounded-xl border border-[#e1e6e1] px-4 text-sm text-[#1e332d] outline-none transition placeholder:text-[#aab2ad] focus:border-[#638c69] focus:ring-4 focus:ring-[#638c69]/10">
                <p class="mt-1.5 text-[11px] text-[#98a19b]">Letras, números, punto, guion o guion bajo.</p>
              </div>

              <div>
                <label for="new-password" class="mb-2 block text-[13px] font-medium text-[#33423b]">Contraseña inicial</label>
                <input id="new-password" v-model="password" type="password" required minlength="12" maxlength="72" autocomplete="new-password" placeholder="Mínimo 12 caracteres" class="h-12 w-full rounded-xl border border-[#e1e6e1] px-4 text-sm text-[#1e332d] outline-none transition placeholder:text-[#aab2ad] focus:border-[#638c69] focus:ring-4 focus:ring-[#638c69]/10">
                <p class="mt-1.5 text-[11px] text-[#98a19b]">Comparte la contraseña por un canal privado.</p>
              </div>

              <button type="submit" :disabled="isSubmitting" class="flex h-12 w-full items-center justify-center rounded-xl bg-[#1d4939] text-sm font-semibold text-white transition hover:bg-[#153c34] disabled:cursor-wait disabled:opacity-70">
                {{ isSubmitting ? 'Creando cuenta…' : 'Crear empleado' }}
              </button>
            </form>

            <p v-if="notice" :role="noticeIsError ? 'alert' : 'status'" class="mt-4 rounded-xl border px-4 py-3 text-[13px] leading-5" :class="noticeIsError ? 'border-[#f1d7d2] bg-[#fff9f8] text-[#a34c3f]' : 'border-[#dfe9d9] bg-[#f6faf3] text-[#52714d]'">
              {{ notice }}
            </p>
          </section>

          <section class="rounded-2xl border border-[#e7ebe5] bg-white p-5 shadow-[0_3px_14px_rgba(27,42,37,0.03)] sm:p-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-base font-semibold text-[#2c4136]">Equipo</h2>
                <p class="mt-1 text-xs text-[#929c95]">{{ users.length }} cuentas registradas</p>
              </div>
              <span class="grid h-10 w-10 place-items-center rounded-xl bg-[#edf4e8] text-[#63845b]">◎</span>
            </div>

            <p v-if="loadError" role="alert" class="mt-5 rounded-xl border border-[#f1d7d2] bg-[#fff9f8] px-4 py-3 text-sm text-[#a34c3f]">
              {{ getApiErrorMessage(loadError, 'No se pudo cargar la lista de empleados.') }}
            </p>
            <p v-else-if="pending" class="mt-5 py-8 text-center text-sm text-[#89948e]">Cargando equipo…</p>
            <div v-else-if="users.length" class="mt-5 divide-y divide-[#eff1ed]">
              <div v-for="person in users" :key="person.id" class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#edf4e8] text-xs font-semibold text-[#63845b]">
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
            <div v-else class="mt-5 rounded-xl bg-[#f7f8f5] px-4 py-8 text-center text-sm text-[#7c8980]">
              Todavía no hay cuentas de empleados.
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>
