# Sistema de Onboarding — Bases de Conocimiento · intra

Sistema para capturar la **Base de Conocimiento** que alimenta a los agentes de IA de
Intralabs, con dos caras:

- **Cliente** (`index.html`) — wizard interactivo, moderno y guiado. El cliente **solo llena
  y envía**; no exporta nada.
- **Administrador** (`admin.html`) — panel interno donde se **almacena, consulta y gestiona**
  todo. Solo aquí se **exporta el JSON** o se **genera el Documento Base de Conocimiento**.

Diseño inspirado en [intralabs.ai](https://www.intralabs.ai): tema oscuro, azul eléctrico,
glassmorphism, Inter + Source Serif 4.

## 🗂️ Arquitectura

| Archivo | Rol |
|---|---|
| `index.html` | Wizard del cliente. Envía/actualiza el envío en Supabase. Reeditable. |
| `admin.html` | Panel admin: login, lista, detalle, exportar JSON / Documento, eliminar. |
| `config.js` | **Único archivo a editar para conectar el backend** (URL + anon key) y la clave admin. |
| `schema.js` | Esquema del wizard (`HOTEL_SCHEMA`). Modular: para otro giro, define otro SCHEMA. |
| `app-data.js` | Capa de datos Supabase (CRUD) + generadores de JSON y Documento. |
| `styles.css` | Sistema de diseño compartido (cliente + admin). |
| `migrations/001_kb_submissions.sql` | Tabla `kb_submissions` + RLS. |

## 🔌 Backend (Supabase)

- Proyecto: `uqafbzazngdwznrafoyg`
- Tabla `kb_submissions`: `id`, `giro`, `nombre`, `data` (jsonb), `completion`, `status`,
  `created_at`, `updated_at`.
- El cliente hace **upsert** de su propio envío (guarda el `id` en su navegador → puede
  **reeditar y reenviar**). El admin lee todo y exporta.

### Puesta en marcha
1. Crear la tabla: ejecutar `migrations/001_kb_submissions.sql` en el proyecto Supabase.
2. En `config.js`, pegar la **anon (publishable) key** del proyecto.
3. Abrir `index.html` (cliente) y `admin.html` (admin, contraseña en `config.js`).

## 🔐 Seguridad (estado actual / MVP)

- El admin se protege con **contraseña en frontend** (`config.js`) — suficiente para arrancar.
- RLS permite insert/update/select con la anon key (el admin usa la misma key para leer).
- **Pendiente de endurecer** con Supabase Auth: login real, `select` solo para admin,
  `update` solo del propio registro. Documentado en la migración.

## 🧩 Flujo

```
Cliente → index.html (wizard) → [Enviar] → Supabase.kb_submissions
                                                  ↓
Admin → admin.html → lista/detalle → Exportar JSON | Generar Documento
```

## 🔜 Pendiente

- Definir **dónde se despliega** el wizard para enviarlo a clientes (Vercel/Netlify/Pages).
- Conectar el JSON exportado al pipeline del agente (n8n / sistema).
- Auth real para el admin.

---

Hecho con 💙 para **intralabs.ai**
