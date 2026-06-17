# Guía de Configuración — Colchones & Descanso

## Requisitos previos

- **Node.js** 18+ (recomendado 20 LTS)
- **npm**
- **Cuenta en Supabase** (gratuita: https://supabase.com)
- **Cuenta en Cloudinary** (gratuita: https://cloudinary.com)

---

## 1. Supabase — Base de datos en producción

### 1.1 Crear proyecto

1. Ir a https://supabase.com y crear una cuenta
2. Crear un **New Project**
3. Elegir nombre: `colchones-descanso`
4. Elegir **Database Password** (guardarla)
5. Elegir región cercana
6. Esperar a que termine la creación (~2 minutos)

### 1.2 Obtener DATABASE_URL

1. En el dashboard del proyecto, ir a **Project Settings > Database**
2. En **Connection string > URI**, copiar la cadena
3. Reemplazar `[YOUR-PASSWORD]` con la contraseña que elegiste
4. Pegarla en `.env` como `DATABASE_URL`

Formato esperado:
```
DATABASE_URL="postgresql://postgres:contraseña@db.un-id.supabase.co:5432/postgres?schema=public"
```

### 1.3 Ejecutar el setup SQL

1. En Supabase, ir a **SQL Editor**
2. Hacer clic en **New Query**
3. Abrir el archivo `prisma/setup.sql`
4. Copiar todo el contenido y pegarlo en el editor
5. Hacer clic en **Run** (▶)

Esto crea:
- 5 tablas (users, categories, products, product_images, store_settings)
- Índices para rendimiento
- Triggers para `updated_at` automático
- Seed data: admin, 8 categorías, configuración inicial

### 1.4 Verificar

Desde el SQL Editor, ejecutar:

```sql
SELECT '✅ Listo' AS resultado;
```

O explorar desde **Table Editor** en Supabase.

---

## 2. Variables de entorno

Editar `.env` con los valores reales:

```env
# ─── Supabase (ver paso 1.2) ───
DATABASE_URL="postgresql://postgres:password@db.un-id.supabase.co:5432/postgres?schema=public"

# ─── Auth.js ───
AUTH_SECRET="generar-con-npx-auth-secret"

# ─── Cloudinary ───
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"

# ─── URL base (cambiar en producción) ───
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### Generar AUTH_SECRET

```bash
npx auth secret
```

Esto genera un token y lo agrega automáticamente al `.env`.

---

## 3. Generar cliente Prisma

```bash
npx prisma generate
```

Esto lee el schema de `prisma/schema.prisma` y genera el cliente TypeScript.

> No es necesario ejecutar `prisma migrate` porque las tablas ya existen (las creó el SQL de Supabase). Si en el futuro cambia el schema, ejecutar:
> ```bash
> npx prisma migrate dev --name descripcion-del-cambio
> ```

---

## 4. Cloudinary

1. Crear cuenta gratuita en https://cloudinary.com
2. Ir a **Dashboard**
3. Copiar:
   - `Cloud name` → `CLOUDINARY_CLOUD_NAME`
   - `API Key` → `CLOUDINARY_API_KEY`
   - `API Secret` → `CLOUDINARY_API_SECRET`
4. Pegar en `.env`

---

## 5. Iniciar el servidor

```bash
npm run dev
```

Abrir http://localhost:3000

---

## 6. Acceder al panel admin

| Ruta | Descripción |
|---|---|
| `/admin` | Login |
| `/admin/dashboard` | Dashboard |
| `/admin/productos` | Gestionar productos |
| `/admin/categorias` | Gestionar categorías |
| `/admin/configuracion` | Configuración de la tienda |

**Credenciales por defecto:**

- **Email:** `admin@colchones.com`
- **Contraseña:** `Admin123!`

---

## 7. Configurar la tienda

1. Ir a `/admin/configuracion`
2. Completar:
   - **Nombre del negocio**
   - **Número de WhatsApp** (ej: `+59170000000`)
   - **Dirección** (opcional)
   - **Facebook / Instagram** (opcional)
   - **URL del logo** (opcional, puede ser de Cloudinary)

El número de WhatsApp se usa automáticamente en el botón flotante y en cada producto.

---

## 8. Comandos útiles

```bash
npm run dev              # Desarrollo local
npm run build            # Build producción
npm run start            # Servir build
npm run lint             # ESLint

npx prisma generate      # Regenerar cliente Prisma (después de cambios en schema)
npx prisma migrate dev   # Migración local (si usas DB local)
npx prisma studio        # Explorar datos (requiere DATABASE_URL)
```

---

## 9. Estructura del proyecto

```
src/
├── app/
│   ├── (public)/            Sitio público
│   ├── admin/               Panel administrativo
│   └── api/                 API routes (auth, upload)
│
├── components/
│   ├── ui/                  Componentes atómicos
│   ├── layout/              Header, Footer, Sidebar
│   ├── public/              Componentes del sitio público
│   ├── admin/               Componentes del panel admin
│   └── forms/               Formularios (React Hook Form)
│
├── actions/                 Server Actions
├── services/                Lógica de negocio
├── repositories/            Acceso a datos (Prisma)
├── validations/             Schemas Zod
├── types/                   Tipos TypeScript
├── hooks/                   Custom hooks
├── lib/                     Conexiones (Prisma, Auth, Cloudinary)
├── styles/                  Design tokens, reset, globales
└── middleware.ts            Protección de rutas admin

prisma/
├── schema.prisma            Modelos de base de datos
└── setup.sql                Script SQL completo para Supabase
```

---

## 10. Solución de problemas

### Error: `Can't reach database server`

- Verificar que `DATABASE_URL` en `.env` sea correcta
- En Supabase: **Project Settings > Database > Connection string**
- Asegurarse de que **IP Restrictions** no esté bloqueando (en Supabase: Authentication > Settings)

### Error: `relation "users" does not exist`

No se ejecutó el SQL. Ir a Supabase > **SQL Editor**, pegar `prisma/setup.sql` y ejecutar.

### Error: `AUTH_SECRET` no configurado

```bash
npx auth secret
```

### Error: Las imágenes no se cargan

Verificar credenciales de Cloudinary en `.env` y que `next.config.ts` tenga el hostname configurado.

### Error: No puedo iniciar sesión en /admin

- Verificar que el usuario existe en Supabase: **Table Editor > users**
- La contraseña debe estar hasheada con bcrypt (el setup.sql ya la incluye hasheada)
- Verificar `AUTH_SECRET`

---

## 11. Producción (despliegue)

### Vercel (recomendado)

```bash
npm i -g vercel
vercel
```

### Variables de entorno en producción

Todas las variables del `.env` deben configurarse en la plataforma de hosting:

```
DATABASE_URL=
AUTH_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_BASE_URL=https://tudominio.com
```

### Migraciones en producción

Si se agregan nuevas tablas o columnas:

```bash
npx prisma migrate deploy
```
