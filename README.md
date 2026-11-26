# STOCKAI CONTROL — acceso de empleados

Portal de acceso para empleados de StockAI, construido con Nuxt, Vue, TypeScript y Tailwind CSS.

## Desarrollo local

```sh
yarn install
yarn dev
```

Abre `http://localhost:3000`.

## Railway

Conecta este proyecto a un servicio de Railway desde su repositorio. Railway puede usar los scripts del proyecto:

- Build: `yarn build`
- Start: `yarn start`

El servidor de producción de Nuxt escucha el puerto proporcionado por la variable `PORT` de Railway.

## Estado actual

La pantalla de acceso es solo la interfaz: todavía no hay autenticación conectada ni se envían credenciales. Hay que configurar un proveedor de autenticación antes de usarla con cuentas reales.

## Producción local

```sh
yarn build
yarn start
```
