# Guía de Configuración de Dominios en Vercel (SaaS Multiempresa)

Este documento explica cómo probar el comportamiento multiempresa de forma **gratuita** en Vercel y cómo configurar **dominios propios personalizados** para tus clientes una vez adquiridos, todo bajo el mismo proyecto de Next.js.

---

## 1. Simulación y Pruebas Gratuitas (subdominios .vercel.app)

Para probar la plataforma en producción de forma 100% gratuita y sin necesidad de comprar dominios de inmediato:

### Paso 1: Configurar en el panel de Vercel
1. Ingresa a tu panel de **Vercel** y selecciona tu proyecto.
2. Ve a la pestaña **Settings** (Configuración) -> **Domains** (Dominios).
3. Haz clic en **Add** (Añadir) e ingresa un subdominio personalizado de Vercel para tu primera tienda. Por ejemplo:
   ```text
   cristian-colchones.vercel.app
   ```
4. Vuelve a hacer clic en **Add** e ingresa otro para tu segunda tienda:
   ```text
   cristian-muebles.vercel.app
   ```

*Nota: Vercel te permite añadir múltiples subdominios `.vercel.app` de manera gratuita e instantánea.*

### Paso 2: Asociar en la Base de Datos (Supabase)
Debes configurar tu base de datos para que la app asocie esos nombres de dominio a sus respectivos inquilinos.
1. Abre tu base de datos de Supabase y ve a la tabla **Tenant** (o de tiendas/inquilinos).
2. Edita la columna `subdomain` para que coincida exactamente con la primera parte de las URLs registradas en Vercel:
   - Para la tienda de colchones, asigna en la columna `subdomain`: `cristian-colchones`
   - Para la tienda de muebles, asigna en la columna `subdomain`: `cristian-muebles`

### Paso 3: Probar accesos y administración
- Entra a `https://cristian-colchones.vercel.app/` -> Carga el catálogo de colchones.
- Entra a `https://cristian-muebles.vercel.app/` -> Carga el catálogo de muebles.
- El login en `https://cristian-colchones.vercel.app/admin` solo aceptará las credenciales del administrador asignado a Colchones (`admin@colchones.com`), bloqueando el acceso si intenta entrar desde la URL de muebles.

---

## 2. Configurar Dominios de Pago (Dominios Oficiales de Clientes)

Cuando tú o tus clientes decidan comprar sus propios dominios independientes (ej. `colchonesdescanso.com` o `mueblescristian.com`):

### Paso 1: Configurar en Vercel
1. En el panel de **Vercel** del proyecto, ve a **Settings** -> **Domains**.
2. Añade el dominio propio del cliente. Ej:
   ```text
   mueblescristian.com
   ```
3. Enlaza este dominio a la rama `main` de producción.
4. En el proveedor del dominio de tu cliente (Godaddy, Namecheap, etc.), configura las siguientes DNS:
   - Registro **A** con host `@` apuntando a la IP de Vercel: `76.76.21.21`
   - Registro **CNAME** con host `www` apuntando a: `cname.vercel-dns.com`

*Vercel creará y renovará de forma automática y gratuita el certificado de seguridad SSL (https) para el dominio de tu cliente.*

### Paso 2: Configurar en Supabase
Cuando un cliente acceda a `mueblescristian.com`, el middleware leerá el host y extraerá la primera parte.
1. En tu base de datos de Supabase (tabla **Tenant**), asigna en la columna `subdomain` exactamente la primera palabra del dominio:
   ```text
   mueblescristian
   ```
De esta forma, cuando Next.js reciba la petición de `mueblescristian.com`, buscará en la base de datos el tenant con `subdomain: "mueblescristian"` y aislará la información correctamente.

---

## 3. Configurar Subdominios Propios (Wildcard de tu Marca)

Si deseas dar subdominios gratuitos bajo un dominio de tu propiedad (ej: `empresa1.tudominio.com`, `empresa2.tudominio.com`):

1. En **Vercel** -> **Settings** -> **Domains**, añade tu dominio con un asterisco:
   ```text
   *.tudominio.com
   ```
2. En tu proveedor DNS, añade:
   - Registro **CNAME** con host `*` apuntando a `cname.vercel-dns.com`.
   - Registro **A** con host `@` apuntando a `76.76.21.21`.

---

## Resumen de Registros DNS de Apuntamiento

| Registro | Host | Valor / Destino | Propósito |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | Dominio raíz de tu marca o del cliente |
| **CNAME** | `*` | `cname.vercel-dns.com` | Todos los subdominios gratuitos ilimitados (`*.tudominio.com`) |
| **CNAME** | `www` | `cname.vercel-dns.com` | Alias www para dominios de clientes (`www.cliente.com`) |
