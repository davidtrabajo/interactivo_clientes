/* ============================================================
   INTRA · Capa de datos (Supabase) + generadores de salida
   Compartido por el wizard (envío) y el admin (consulta/exportación).
   Depende de: config.js, schema.js y el SDK @supabase/supabase-js.
   ============================================================ */
(function(){
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function stripTags(s){ return String(s).replace(/<[^>]+>/g,''); }

  let _client=null;
  function client(){
    if(_client) return _client;
    const cfg=window.SUPABASE_CONFIG||{};
    if(!window.supabase) throw new Error('No cargó el SDK de Supabase.');
    if(!cfg.url || !cfg.anonKey || cfg.anonKey.indexOf('PEGA_AQUI')===0)
      throw new Error('Falta configurar la anon key en config.js.');
    _client=window.supabase.createClient(cfg.url, cfg.anonKey);
    return _client;
  }
  function configured(){ const c=window.SUPABASE_CONFIG||{}; return !!(c.url&&c.anonKey&&c.anonKey.indexOf('PEGA_AQUI')!==0); }
  function table(){ return (window.SUPABASE_CONFIG&&window.SUPABASE_CONFIG.table)||'kb_submissions'; }

  /* ---------- Métricas ---------- */
  function completion(data){
    const schema=window.ACTIVE_SCHEMA; let total=0,filled=0;
    schema.steps.forEach(s=>{
      (s.fields||[]).forEach(f=>{
        if(f.type==='repeater'||f.type==='toggle-only') return;
        total++; const v=((data[s.id]||{})[f.key]||'').toString().trim(); if(v) filled++;
      });
    });
    return total? Math.round(filled/total*100):0;
  }
  function nombre(data){ return ((data.general||{}).nombre_oficial||'').trim()||'Hotel sin nombre'; }
  function slug(data){ return (nombre(data).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'hotel'); }

  /* ---------- CRUD Supabase ---------- */
  async function save(rec){
    const data=rec.data||{};
    const row={ giro:window.ACTIVE_SCHEMA.giro, nombre:nombre(data), data:data,
      completion:completion(data), status:rec.status||'enviado', updated_at:new Date().toISOString() };
    if(rec.id) row.id=rec.id;
    const { data:res, error } = await client().from(table()).upsert(row).select('id').single();
    if(error) throw error; return res.id;
  }
  async function list(){
    const { data, error } = await client().from(table()).select('*').order('updated_at',{ascending:false});
    if(error) throw error; return data||[];
  }
  async function get(id){
    const { data, error } = await client().from(table()).select('*').eq('id',id).single();
    if(error) throw error; return data;
  }
  async function remove(id){
    const { error } = await client().from(table()).delete().eq('id',id); if(error) throw error;
  }

  /* ---------- Exportación: JSON ---------- */
  function buildExport(data){ return { giro:window.ACTIVE_SCHEMA.giro, generado:new Date().toISOString(), datos:data }; }
  function download(blob,name){ const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),2000); }
  function downloadJSON(data){ download(new Blob([JSON.stringify(buildExport(data),null,2)],{type:'application/json'}), slug(data)+'-base-conocimiento.json'); }

  /* ---------- Exportación: Documento Base de Conocimiento ---------- */
  function buildDocHTML(data){
    const get=(step,key)=>((data[step]||{})[key]||'');
    const g=k=>esc(get('general',k));
    const field=(step,key,label)=>{ const val=get(step,key); return val?`<p><b>${esc(label)}:</b> ${esc(val).replace(/\n/g,'<br>')}</p>`:''; };
    const repList=(step,key,render)=>{ const arr=(data[step]||{})[key]||[]; return arr.length? arr.map(render).join('') : '<p class="muted">No especificado.</p>'; };
    const toggleLine=(step,key,label)=>{ const st=data[step]||{}; const on=!!st[key]; const det=st[key+'_detalle']; return on?`<li><b>${esc(label)}:</b> Sí${det?' — '+esc(det):''}</li>`:''; };

    const servTog=window.ACTIVE_SCHEMA.steps.find(s=>s.id==='servicios').toggles;
    const servicios=servTog.map(t=>toggleLine('servicios',t.key,t.label)).filter(Boolean).join('')||'<li class="muted">No especificado.</li>';
    const fecha=new Date().toLocaleDateString('es-MX',{year:'numeric',month:'long',day:'numeric'});

    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Base de Conocimiento — ${g('nombre_oficial')||'Hotel'}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Source+Serif+4:wght@500;600;700&display=swap" rel="stylesheet">
    <style>
      *{box-sizing:border-box} body{font-family:'Inter',sans-serif;color:#0e1b2a;max-width:820px;margin:0 auto;padding:54px 48px;line-height:1.6}
      h1{font-family:'Source Serif 4',serif;font-size:30px;color:#01101d;margin-bottom:4px}
      .sub{color:#5a6b7d;font-size:13px;margin-bottom:30px;border-bottom:3px solid #0099ff;padding-bottom:18px}
      h2{font-family:'Source Serif 4',serif;font-size:19px;color:#0072d6;margin:30px 0 12px;padding-bottom:6px;border-bottom:1px solid #dfe7ef}
      p{margin:5px 0;font-size:14px} ul{margin:6px 0 6px 4px;font-size:14px} li{margin:3px 0;list-style:none}
      .muted{color:#9aa7b4;font-style:italic} .room,.hall{background:#f5f8fb;border:1px solid #e3eaf2;border-radius:10px;padding:14px 16px;margin:10px 0}
      .room h3,.hall h3{font-size:15px;color:#01101d;margin-bottom:6px} .caps{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
      .cap{background:#eaf4ff;color:#0072d6;font-size:12px;font-weight:600;padding:4px 10px;border-radius:999px}
      .brandbar{display:flex;align-items:center;gap:10px;margin-bottom:24px;font-weight:700;color:#0099ff}
      .brandbar .l{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#0099ff,#0066cc);color:#fff;display:grid;place-items:center}
      @media print{body{padding:24px}a{color:inherit;text-decoration:none}}
    </style></head><body>
    <div class="brandbar"><span class="l">i</span> intra · Base de Conocimiento</div>
    <h1>${g('nombre_oficial')||'Base de Conocimiento'}</h1>
    <div class="sub">${g('marca')?g('marca')+' · ':''}${g('codigo')?'Código '+g('codigo')+' · ':''}Generado ${fecha}</div>

    <h2>1 · Información general</h2>
    ${field('general','descripcion','Descripción')}
    ${field('general','direccion','Dirección')}
    ${field('general','telefono','Teléfono')}${field('general','email','Email')}${field('general','whatsapp','WhatsApp')}${field('general','sitio_web','Sitio web')}
    ${field('general','checkin','Check-in')}${field('general','checkout','Check-out')}${field('general','recepcion','Recepción')}${field('general','num_habitaciones','Habitaciones')}${field('general','categoria','Categoría')}

    <h2>2 · Ubicación y accesos</h2>
    ${field('ubicacion','aeropuerto','Aeropuerto')}${field('ubicacion','aeropuerto_dist','Distancia al aeropuerto')}${field('ubicacion','traslado_aeropuerto','Traslado al aeropuerto')}${field('ubicacion','traslado_local','Traslado local')}${field('ubicacion','estacionamiento','Estacionamiento')}${field('ubicacion','carga_ev','Carga de autos eléctricos')}
    <p><b>Puntos de interés cercanos:</b></p>
    <ul>${repList('ubicacion','puntos',p=>`<li>• ${esc(p.nombre||'')} ${p.distancia?'— '+esc(p.distancia):''}</li>`)}</ul>

    <h2>3 · Servicios e instalaciones</h2><ul>${servicios}</ul>

    <h2>4 · Tipos de habitación</h2>
    ${repList('habitaciones','habs',h=>`<div class="room"><h3>${esc(h.nombre||'Habitación')}</h3>
      <p>${[h.capacidad&&'Capacidad: '+esc(h.capacidad),h.camas&&'Camas: '+esc(h.camas),h.tamano&&'Tamaño: '+esc(h.tamano),h.vista&&esc(h.vista),h.precio_desde&&'Desde '+esc(h.precio_desde)].filter(Boolean).join(' · ')}</p>
      ${h.amenidades?`<p class="muted">${esc(h.amenidades)}</p>`:''}</div>`)}

    <h2>5 · Políticas</h2>
    ${field('politicas','mascotas_politica','Mascotas')}${field('politicas','fumadores','Fumadores')}${field('politicas','cancelacion','Cancelación')}${field('politicas','edad_minima','Edad mínima')}${field('politicas','metodos_pago','Métodos de pago')}${field('politicas','deposito','Depósito')}${field('politicas','ninos','Niños')}${field('politicas','extras_politica','Otras políticas')}

    <h2>6 · Salones y eventos</h2>
    ${field('eventos','eventos_intro','Notas generales')}
    ${repList('eventos','salas',s=>{const caps=[['Banquete','banquete'],['Conferencia','conferencia'],['Mesa cuadrada','mesa_cuadrada'],['Cóctel','coctel'],['Escolar','escolar'],['Teatro','teatro'],['Forma U','forma_u']].filter(c=>s[c[1]]).map(c=>`<span class="cap">${c[0]}: ${esc(s[c[1]])}</span>`).join('');
      return `<div class="hall"><h3>${esc(s.nombre||'Salón')} ${s.area?'· '+esc(s.area)+' m²':''}</h3><div class="caps">${caps||'<span class="muted">Sin capacidades</span>'}</div></div>`;})}

    <h2>7 · Voz del agente de IA</h2>
    ${field('agente','nombre_agente','Nombre del agente')}${field('agente','idiomas','Idiomas')}${field('agente','tono','Tono')}${field('agente','tono_detalle','Estilo')}${field('agente','horario_atencion','Horario')}${field('agente','objetivo','Objetivo')}${field('agente','siempre','Siempre debe')}${field('agente','nunca','Nunca debe')}${field('agente','escalamiento','Escalamiento')}${field('agente','contacto_humano','Contacto humano')}

    <h2>8 · Enlaces oficiales</h2>
    ${field('enlaces','url_reservas','Reservación oficial')}${field('enlaces','url_es','Sitio (ES)')}${field('enlaces','url_en','Sitio (EN)')}${field('enlaces','url_habitaciones','Habitaciones')}${field('enlaces','url_eventos','Eventos')}${field('enlaces','url_galeria','Galería')}${field('enlaces','url_ubicacion','Ubicación')}${field('enlaces','redes','Redes sociales')}
    </body></html>`;
  }
  function openDocument(data){
    const html=buildDocHTML(data); const w=window.open('','_blank');
    if(!w){ download(new Blob([html],{type:'text/html'}), slug(data)+'-base-conocimiento.html'); return 'download'; }
    w.document.write(html); w.document.close(); return 'window';
  }

  window.KB={ esc, stripTags, configured, client, save, list, get, remove,
    completion, nombre, slug, buildExport, downloadJSON, buildDocHTML, openDocument, download };
})();
