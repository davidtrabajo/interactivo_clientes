# Onboarding Interactivo — Base de Conocimiento · intra

Formulario web **interactivo, moderno y guiado** para que los clientes (hoteles) capturen
toda la información que alimenta a su **agente de IA conversacional**, en lugar de llenar
un documento plano.

Inspirado en el sistema visual de [intralabs.ai](https://www.intralabs.ai): tema oscuro,
azul eléctrico, glassmorphism, tipografía Inter + Source Serif 4.

## ✨ Características

- **Wizard multi-paso** con barra de progreso, pasos clicables y validación inline.
- **Autoguardado** en el navegador (`localStorage`) — el cliente puede continuar luego.
- **Listas dinámicas** (puntos de interés, tipos de habitación, salones con capacidades).
- **Toggles con detalle** para servicios e instalaciones.
- **Sección "Voz del agente"** para definir tono, idiomas, qué debe y no debe hacer la IA.
- **Doble exportación al terminar:**
  - 🧩 **JSON estructurado** — listo para cargar en el sistema / agente.
  - 📄 **Documento "Base de Conocimiento"** formateado e imprimible a PDF.
- **100% responsive** (móvil y escritorio), sin dependencias ni build.

## 🚀 Uso

Abre `index.html` en cualquier navegador. Eso es todo — no requiere servidor ni instalación.

Para publicarlo: súbelo a **Vercel**, **Netlify** o **GitHub Pages** (es un sitio estático)
o incrústalo donde lo necesites.

## 🧩 Arquitectura (modular por giro)

Todo vive en `index.html`. El formulario es **data-driven**: el wizard se construye a partir
del objeto `HOTEL_SCHEMA`. Para crear el formulario de otro giro (casa de empeño, marina, etc.)
basta con definir un nuevo `SCHEMA` con sus pasos y campos, y apuntar `ACTIVE_SCHEMA` a él —
sin tocar el motor de render.

Tipos de campo soportados: `text`, `textarea`, `tel`, `email`, `number`, `time`, `url`,
`select`, `toggle` (con detalle), `toggle-only`, y `repeater` (con `capacities` opcionales).

## 🗂️ Pasos del wizard (hotel)

1. Información general
2. Ubicación y accesos
3. Servicios e instalaciones
4. Tipos de habitación
5. Políticas
6. Salones y eventos
7. Voz del agente de IA
8. Enlaces oficiales
9. Revisión y entrega

## 🔜 Pendiente (siguiente fase)

- Definir **dónde se almacena** la información (Supabase / API / n8n).
- Definir **dónde se despliega** públicamente para enviarlo a clientes.
- Botón de envío al backend (hoy genera JSON + documento descargable).

---

Hecho con 💙 para **intralabs.ai**
