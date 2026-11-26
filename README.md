# STOCKAI CONTROL — acceso de empleados

Portal de acceso para empleados de StockAI, construido con Nuxt, Vue, TypeScript y Tailwind CSS.

## Desarrollo local

```sh
yarn install
Copy-Item .env.example .env
yarn dev
```

Antes de iniciar, configura en `.env` una base PostgreSQL disponible y una contraseña privada para el administrador inicial. Abre `http://localhost:3000`.

## Backend y acceso inicial

El backend usa PostgreSQL y crea las tablas de usuarios y sesiones la primera vez que se utiliza. El administrador inicial tiene el usuario `angel`, nombre `Angel` y rol de administrador. Su contraseña se lee de `NUXT_BOOTSTRAP_ADMIN_PASSWORD`; nunca se guarda en el código ni en Git.

Las cuentas nuevas se crean desde **Empleados** en el panel. Las contraseñas se almacenan con bcrypt y las sesiones usan una cookie `HttpOnly`.

## Railway

Conecta este proyecto a un servicio de Railway desde su repositorio. Railway puede usar los scripts del proyecto:

- Build: `yarn build`
- Start: `yarn start`

Añade un servicio PostgreSQL y configura estas variables en el servicio de la aplicación:

- `NUXT_DATABASE_URL`: referencia a `DATABASE_URL` del servicio PostgreSQL.
- `NUXT_BOOTSTRAP_ADMIN_PASSWORD`: contraseña privada para crear al administrador inicial.
- `NUXT_BOOTSTRAP_ADMIN_USERNAME`: `angel` (opcional).
- `NUXT_BOOTSTRAP_ADMIN_NAME`: `Angel` (opcional).

La cuenta se crea de forma segura en la primera solicitud al backend. El servidor de producción de Nuxt escucha el puerto proporcionado por la variable `PORT` de Railway.

## Estado actual

El proyecto incluye inicio y cierre de sesión, sesiones persistentes, dashboard y administración de cuentas. Sin PostgreSQL y las variables de Railway configuradas, el backend muestra un error de configuración y no permite iniciar sesión.

## Producción local

```sh
yarn build
yarn start
```
