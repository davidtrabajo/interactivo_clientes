/* ============================================================
   INTRA · Configuración del sistema
   Edita SOLO este archivo para conectar/cambiar el backend.
   ============================================================ */
window.SUPABASE_CONFIG = {
  // Proyecto Supabase (project_ref=uqafbzazngdwznrafoyg)
  url: "https://uqafbzazngdwznrafoyg.supabase.co",

  // ⚠️ PEGA AQUÍ tu llave pública (anon / publishable key) del proyecto.
  // La obtengo automáticamente al reconectar el MCP, o cópiala de:
  // Supabase → Project Settings → API → Project API keys → anon public
  anonKey: "PEGA_AQUI_TU_ANON_KEY",

  // Nombre de la tabla donde se guardan los envíos del wizard
  table: "kb_submissions",
};

window.ADMIN_CONFIG = {
  // Contraseña del panel administrativo (solo frontend por ahora).
  // Cámbiala por la que quieras. Se reemplazará por login real con el backend.
  password: "intra2026",
  // Título mostrado en el panel
  brand: "intra · Onboarding",
};
