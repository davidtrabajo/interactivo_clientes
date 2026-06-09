/* ============================================================
   INTRA · Esquema del wizard (data-driven, modular por giro)
   Para un nuevo giro: define otro SCHEMA y cambia ACTIVE_SCHEMA.
   Lo usan tanto el wizard (index.html) como el panel admin (admin.html).
   ============================================================ */
window.HOTEL_SCHEMA = {
  giro:'hotel',
  storageKey:'intra_kb_hotel_v1',
  steps:[
    /* 0 · Intro */
    { id:'intro', tipo:'intro',
      titulo:'Construyamos el cerebro de tu <span class="hl">agente de IA</span>',
      lead:'Este asistente recopila toda la información de tu hotel para que tu agente conversacional responda como tu mejor recepcionista — 24/7, sin equivocarse. Tómate tu tiempo: se guarda solo en tu navegador y puedes continuar luego.',
      feats:[
        {i:'🧠',t:'Alimenta a tu agente',d:'Cada dato se convierte en una respuesta precisa para tus huéspedes.'},
        {i:'⚡',t:'Interactivo y guiado',d:'Paso a paso, sin documentos planos ni formatos confusos.'},
        {i:'✅',t:'Envío directo',d:'Al terminar, tu información llega segura al equipo de Intralabs.'}
      ],
      meta:[{k:'⏱️ Duración',v:'10–15 min'},{k:'💾 Progreso',v:'Se guarda solo'},{k:'✏️ Editable',v:'Puedes reenviar'}]
    },

    /* 1 · Información general */
    { id:'general', icon:'🏨', eyebrow:'Identidad del hotel', titulo:'Información <span class="hl">general</span>',
      subtitulo:'Los datos base de tu propiedad. Son los que tu agente usará para identificarse y orientar al huésped.',
      fields:[
        {key:'nombre_oficial',label:'Nombre oficial del hotel',type:'text',req:true,half:true,ph:'Ej. Hampton Inn by Hilton™ Mérida'},
        {key:'codigo',label:'Código / clave interna',type:'text',half:true,ph:'Ej. MIDHXHX',help:'Código Hilton, PMS o el que uses internamente'},
        {key:'marca',label:'Marca / cadena',type:'text',half:true,ph:'Ej. Hilton — Hampton Inn'},
        {key:'categoria',label:'Categoría',type:'select',half:true,options:['','Económico','3 estrellas','4 estrellas','5 estrellas','Gran turismo','Boutique','Resort']},
        {key:'direccion',label:'Dirección completa',type:'textarea',req:true,full:true,ph:'Calle, número, colonia, ciudad, estado, C.P., país'},
        {key:'telefono',label:'Teléfono',type:'tel',half:true,req:true,ph:'(+52) 999 964 2345'},
        {key:'email',label:'Email de contacto',type:'email',half:true,ph:'reservas@tuhotel.com'},
        {key:'whatsapp',label:'WhatsApp',type:'tel',half:true,ph:'(+52) 1 999 000 0000'},
        {key:'sitio_web',label:'Sitio web',type:'url',half:true,ph:'https://...'},
        {key:'checkin',label:'Hora de check-in',type:'time',half:true},
        {key:'checkout',label:'Hora de check-out',type:'time',half:true},
        {key:'recepcion',label:'Horario de recepción',type:'text',half:true,ph:'Ej. 24 horas'},
        {key:'num_habitaciones',label:'Número de habitaciones',type:'number',half:true,ph:'Ej. 130'},
        {key:'descripcion',label:'Descripción breve del hotel',type:'textarea',full:true,ph:'Un párrafo que describa el hotel, su ubicación y a quién está dirigido. El agente lo usará para presentarlo.'}
      ]
    },

    /* 2 · Ubicación y accesos */
    { id:'ubicacion', icon:'📍', eyebrow:'Dónde estás y cómo llegar', titulo:'Ubicación y <span class="hl">accesos</span>',
      subtitulo:'Puntos de interés cercanos, aeropuerto, traslados y estacionamiento. Son las preguntas frecuentes #1 de los huéspedes.',
      fields:[
        {key:'aeropuerto',label:'Aeropuerto más cercano',type:'text',half:true,ph:'Ej. Aeropuerto Internacional de Mérida (MID)'},
        {key:'aeropuerto_dist',label:'Distancia al aeropuerto',type:'text',half:true,ph:'Ej. 13 millas / 21 km'},
        {key:'traslado_aeropuerto',label:'¿Traslado al aeropuerto?',type:'select',half:true,options:['','No disponible','Disponible con costo','Disponible de cortesía','Bajo solicitud']},
        {key:'traslado_local',label:'Traslado local / shuttle',type:'text',half:true,ph:'Ej. Gratuito en radio de 7 km'},
        {key:'estacionamiento',label:'Estacionamiento',type:'select',half:true,options:['','De cortesía','Con costo','Valet con costo','Valet de cortesía','No disponible']},
        {key:'carga_ev',label:'Carga de autos eléctricos',type:'select',half:true,options:['','Disponible','No disponible']},
        {key:'puntos',type:'repeater',label:'Puntos de interés cercanos',addLabel:'Agregar lugar',
          item:{ title:'nombre', fields:[
            {key:'nombre',label:'Lugar',type:'text',half:true,ph:'Ej. Centro de Convenciones Yucatán'},
            {key:'distancia',label:'Distancia / tiempo',type:'text',half:true,ph:'Ej. 4 min a pie / 1 km'}
          ]}}
      ]
    },

    /* 3 · Servicios */
    { id:'servicios', icon:'🛎️', eyebrow:'Lo que ofreces', titulo:'Servicios e <span class="hl">instalaciones</span>',
      subtitulo:'Activa lo que aplica y agrega el detalle. Solo lo encendido se le contará al huésped.',
      toggles:[
        {key:'wifi',label:'WiFi gratis',sub:'En habitaciones y áreas comunes',detail:'Detalle (cobertura, velocidad, contraseña…)'},
        {key:'desayuno',label:'Desayuno',sub:'Incluido / buffet / a la carta',detail:'Horario, tipo y si está incluido'},
        {key:'restaurante',label:'Restaurante / Bar',sub:'Alimentos y bebidas en sitio',detail:'Nombre, horario y tipo de cocina'},
        {key:'gimnasio',label:'Gimnasio',sub:'Fitness center',detail:'Horario y equipamiento'},
        {key:'alberca',label:'Alberca',sub:'Piscina',detail:'Tipo (exterior/climatizada), horario'},
        {key:'spa',label:'Spa / Wellness',sub:'',detail:'Servicios y horario'},
        {key:'centro_negocios',label:'Centro de negocios',sub:'',detail:'Equipos y horario'},
        {key:'salas_reunion',label:'Salas de reuniones',sub:'(El detalle de capacidades va en el paso de Eventos)',detail:'Cantidad y notas generales'},
        {key:'room_service',label:'Servicio a la habitación',sub:'',detail:'Horario y notas'},
        {key:'lavanderia',label:'Lavandería / Tintorería',sub:'',detail:'Tiempos y costo'},
        {key:'accesibilidad',label:'Accesibilidad',sub:'Para personas con discapacidad',detail:'Rampas, habitaciones adaptadas, elevador…'},
        {key:'mascotas_ok',label:'Pet friendly',sub:'Se permiten mascotas',detail:'(La tarifa va en el paso de Políticas)'}
      ]
    },

    /* 4 · Habitaciones */
    { id:'habitaciones', icon:'🛏️', eyebrow:'Tu inventario', titulo:'Tipos de <span class="hl">habitación</span>',
      subtitulo:'Agrega cada tipo de habitación. El agente recomendará según huéspedes, camas y presupuesto.',
      fields:[
        {key:'habs',type:'repeater',label:'Tipos de habitación',addLabel:'Agregar tipo de habitación',
          item:{ title:'nombre', fields:[
            {key:'nombre',label:'Nombre del tipo',type:'text',half:true,ph:'Ej. King Estándar'},
            {key:'capacidad',label:'Capacidad (personas)',type:'text',half:true,ph:'Ej. 2 adultos'},
            {key:'camas',label:'Camas',type:'text',half:true,ph:'Ej. 1 King / 2 Queen'},
            {key:'tamano',label:'Tamaño',type:'text',half:true,ph:'Ej. 28 m²'},
            {key:'precio_desde',label:'Precio desde (referencia)',type:'text',half:true,ph:'Ej. $1,800 MXN/noche'},
            {key:'vista',label:'Vista / piso',type:'text',half:true,ph:'Ej. Vista a la ciudad'},
            {key:'amenidades',label:'Amenidades destacadas',type:'textarea',full:true,ph:'Aire acondicionado, smart TV, caja fuerte, escritorio, cafetera…'}
          ]}}
      ]
    },

    /* 5 · Políticas */
    { id:'politicas', icon:'📋', eyebrow:'Las reglas de la casa', titulo:'Políticas del <span class="hl">hotel</span>',
      subtitulo:'Reglas claras = menos malentendidos. El agente las comunicará textualmente cuando se pregunten.',
      fields:[
        {key:'mascotas_politica',label:'Política de mascotas',type:'textarea',full:true,ph:'Ej. Se permiten mascotas. Tarifa: $450 MXN + impuestos por noche (no reembolsable). Máx. 2 por habitación.'},
        {key:'fumadores',label:'Política de fumadores',type:'textarea',full:true,ph:'Ej. Solo en áreas designadas. No hay habitaciones para fumadores.'},
        {key:'cancelacion',label:'Política de cancelación',type:'textarea',full:true,ph:'Ej. Cancelación gratuita hasta 48 h antes del check-in. Después se cobra la primera noche.'},
        {key:'edad_minima',label:'Edad mínima para registrarse',type:'text',half:true,ph:'Ej. 18 años'},
        {key:'metodos_pago',label:'Métodos de pago aceptados',type:'text',half:true,ph:'Ej. Visa, MasterCard, Amex, efectivo'},
        {key:'deposito',label:'Depósito / garantía',type:'text',half:true,ph:'Ej. Se requiere tarjeta al check-in'},
        {key:'ninos',label:'Política de niños',type:'text',half:true,ph:'Ej. Menores de 12 sin costo compartiendo habitación'},
        {key:'extras_politica',label:'Otras políticas importantes',type:'textarea',full:true,ph:'Identificación obligatoria, horarios de alberca, ruido, etc.'}
      ]
    },

    /* 6 · Salones y eventos */
    { id:'eventos', icon:'🎉', eyebrow:'Reuniones y celebraciones', titulo:'Salones y <span class="hl">eventos</span>',
      subtitulo:'Captura cada salón y su capacidad por tipo de montaje. El agente cotizará y orientará grupos al instante.',
      fields:[
        {key:'tiene_eventos',type:'toggle-only',label:'¿El hotel ofrece espacios para eventos?',sub:'Si lo desactivas, el agente dirá que no hay salones disponibles.'},
        {key:'eventos_intro',label:'Notas generales de eventos',type:'textarea',full:true,ph:'Ej. 8 salas de reuniones, espacio total 265 m², coordinador de eventos disponible.'},
        {key:'salas',type:'repeater',label:'Salones',addLabel:'Agregar salón',
          item:{ title:'nombre',
            fields:[
              {key:'nombre',label:'Nombre del salón',type:'text',half:true,ph:'Ej. Salón H-G'},
              {key:'area',label:'Área (m²)',type:'text',half:true,ph:'Ej. 82'}
            ],
            capacities:[
              {key:'banquete',label:'Banquete'},{key:'conferencia',label:'Conferencia'},
              {key:'mesa_cuadrada',label:'Mesa cuadrada'},{key:'coctel',label:'Recepción / Cóctel'},
              {key:'escolar',label:'Escolar'},{key:'teatro',label:'Teatro'},{key:'forma_u',label:'Forma de U'}
            ]}}
      ]
    },

    /* 7 · Voz del agente */
    { id:'agente', icon:'🤖', eyebrow:'La personalidad de tu IA', titulo:'Voz del <span class="hl">agente</span>',
      subtitulo:'Cómo debe sonar y comportarse tu agente. Esto define la experiencia que vive el huésped al escribirte.',
      fields:[
        {key:'nombre_agente',label:'Nombre del agente',type:'text',half:true,ph:'Ej. Sofía, Concierge Virtual'},
        {key:'idiomas',label:'Idiomas que debe manejar',type:'text',half:true,ph:'Ej. Español e inglés'},
        {key:'tono',label:'Tono / personalidad',type:'select',full:true,options:['','Cálido y cercano','Profesional y formal','Amigable y casual','Lujo y exclusividad','Eficiente y directo']},
        {key:'tono_detalle',label:'Describe el estilo con tus palabras',type:'textarea',full:true,ph:'Ej. Trato de usted, cordial, usa el nombre del huésped, nunca presiona, cierra siempre ofreciendo ayuda.'},
        {key:'horario_atencion',label:'Horario de atención del agente',type:'text',half:true,ph:'Ej. 24/7'},
        {key:'objetivo',label:'Objetivo principal del agente',type:'select',half:true,options:['','Reservar habitaciones','Resolver dudas','Cotizar eventos','Atención post-venta','Todo lo anterior']},
        {key:'siempre',label:'Siempre debe…',type:'textarea',full:true,ph:'Ej. Confirmar fechas y número de huéspedes, ofrecer el enlace de reserva oficial, despedirse cordialmente.'},
        {key:'nunca',label:'Nunca debe…',type:'textarea',full:true,ph:'Ej. Inventar precios, prometer disponibilidad sin confirmar, dar datos de otro hotel, compartir información interna.'},
        {key:'escalamiento',label:'¿Cuándo pasar a un humano?',type:'textarea',full:true,ph:'Ej. Quejas, grupos mayores a 10 habitaciones, cobros, o si el huésped lo pide.'},
        {key:'contacto_humano',label:'Contacto para escalar',type:'text',full:true,ph:'Ej. Recepción ext. 0 / WhatsApp +52...'}
      ]
    },

    /* 8 · Enlaces */
    { id:'enlaces', icon:'🔗', eyebrow:'Fuentes oficiales', titulo:'Enlaces <span class="hl">oficiales</span>',
      subtitulo:'Las URLs que el agente compartirá. Usa siempre los enlaces oficiales para no perder reservas.',
      fields:[
        {key:'url_reservas',label:'Enlace de reservación oficial',type:'url',full:true,ph:'https://...'},
        {key:'url_es',label:'Página principal (ES)',type:'url',half:true,ph:'https://...'},
        {key:'url_en',label:'Página principal (EN)',type:'url',half:true,ph:'https://...'},
        {key:'url_habitaciones',label:'Habitaciones',type:'url',half:true,ph:'https://...'},
        {key:'url_eventos',label:'Eventos',type:'url',half:true,ph:'https://...'},
        {key:'url_galeria',label:'Galería de fotos',type:'url',half:true,ph:'https://...'},
        {key:'url_ubicacion',label:'Ubicación / mapa',type:'url',half:true,ph:'https://...'},
        {key:'redes',label:'Redes sociales',type:'textarea',full:true,ph:'Instagram, Facebook, TikTok… (una por línea)'}
      ]
    },

    /* 9 · Revisión / envío */
    { id:'revision', tipo:'review', icon:'🚀', eyebrow:'Último paso', titulo:'Revisa y <span class="hl">envía</span>',
      subtitulo:'Verifica que todo esté correcto. Puedes editar cualquier sección antes de enviar tu información al equipo de Intralabs.' }
  ]
};

window.ACTIVE_SCHEMA = window.HOTEL_SCHEMA;
