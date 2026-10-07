/* ============================================================
   CORAZÓN ARTESANO — Panel de la artesana
   Interfaz simplificada: mis productos, mis ventas, mi perfil,
   mi historia y mi participación en la cooperativa.
   ============================================================ */

(function () {
  'use strict';

  var CA = window.CA;
  var s = window.CA_Auth.requerir('artesana');
  if (!s) return;

  function getArt() { return CA.artesana(s.artesanaId); }
  function getSt() { return window.CA_Store.get(); }
  function misPedidos() { return getSt().pedidos.filter(function (p) { return p.artesanaId === s.artesanaId; }); }
  function misProductos() { return getSt().productos.filter(function (p) { return p.artesanaId === s.artesanaId; }); }

  var IMG_POR_CATEGORIA = {
    palma: 'prod-bolso-iraca', filigrana: 'prod-pulsera-filigrana', tejidos: 'prod-mochila-tejida',
    bisuteria: 'prod-collar-bisuteria', gastronomia: 'prod-caja-dulces'
  };

  /* ---------- Barra superior ---------- */
  document.getElementById('perfil-topbar').innerHTML =
    '<a class="nav-brand" href="index.html" style="text-decoration:none"><img src="assets/images/logo.svg" alt="" style="width:40px;height:40px">' +
    '<span class="brand-text"><span class="brand-name">Corazón Artesano</span><span class="brand-sub">Mi panel de artesana</span></span></a>' +
    '<div class="tb-actions">' +
    '<span class="tb-chip">' + CA.icon('calendar') + CA.fmtFecha(CA.hoyISO()) + '</span>' +
    '<a class="btn btn-outline btn-sm" href="catalogo.html">' + CA.icon('store') + ' Ver la vitrina</a>' +
    '<button type="button" class="btn btn-primary btn-sm" id="btn-salir">' + CA.icon('logout') + ' Salir</button>' +
    '</div>';

  document.getElementById('btn-salir').addEventListener('click', function () {
    CA.confirmar({
      title: 'Cerrar sesión',
      mensaje: '¿Quieres salir de tu panel? Tus cambios quedan guardados en este navegador.',
      okLabel: 'Cerrar sesión',
      onOk: function () { window.CA.cerrarSesion(); }
    });
  });

  /* ---------- Bienvenida ---------- */
  function renderHero() {
    var art = getArt();
    var cat = CA.catInfo(art.especialidad);
    document.getElementById('hero-artesana').innerHTML =
      '<img class="avatar" src="' + CA.avatarURI(art.nombre) + '" alt="Retrato de ' + CA.esc(art.nombre) + '">' +
      '<div style="position:relative;z-index:2;flex:1;min-width:220px">' +
      '<h1>Bienvenida, ' + CA.esc(art.nombre.split(' ')[0]) + '</h1>' +
      '<p>Este es tu espacio en la vitrina colectiva. Desde aquí gestionas tus productos, tus ventas y tu historia.</p>' +
      '<div class="ah-chips">' +
      '<span class="ah-chip">' + CA.esc(cat.nombre) + '</span>' +
      '<span class="ah-chip">' + art.anios + ' años de oficio</span>' +
      '<span class="ah-chip">' + (art.comite ? CA.esc(art.comite) : 'Socia activa') + '</span>' +
      '</div></div>' +
      '<div class="ah-side">' +
      '<a class="btn btn-gold" href="catalogo.html">' + CA.icon('store') + ' Mi tienda pública</a>' +
      '</div>';
  }

  /* ---------- KPIs ---------- */
  function renderKpis() {
    var prod = misProductos();
    var pedidos = misPedidos();
    var ingresos = pedidos.reduce(function (t, p) { return t + p.valor; }, 0);
    var pendientes = pedidos.filter(function (p) { return p.estado === 'Pendiente' || p.estado === 'En preparación'; }).length;
    document.getElementById('kpis').innerHTML =
      kpiCard('box', 'gold', prod.length, 'Productos publicados') +
      kpiCard('package', 'navy', pedidos.length, 'Ventas') +
      kpiCard('coin', 'green', CA.fmtCOP(ingresos), 'Ingresos') +
      kpiCard('clock', 'purple', pendientes, 'Pedidos pendientes');
  }

  function kpiCard(icono, tono, valor, label) {
    return '<div class="kpi-card ' + tono + '">' +
      '<span class="kpi-ico">' + CA.icon(icono) + '</span>' +
      '<div><div class="kpi-value">' + valor + '</div><div class="kpi-label">' + label + '</div></div></div>';
  }

  /* ---------- Pestañas ---------- */
  var TABS = {
    productos: { label: 'Mis productos', icon: 'box' },
    ventas: { label: 'Mis ventas', icon: 'package' },
    perfil: { label: 'Mi perfil', icon: 'user' },
    historia: { label: 'Mi historia', icon: 'quote' },
    participacion: { label: 'Mi participación', icon: 'vote' }
  };
  CA.$$('#tabs .tab-btn').forEach(function (b) {
    var t = TABS[b.getAttribute('data-tab')];
    b.innerHTML = CA.icon(t.icon) + t.label;
    b.addEventListener('click', function () {
      CA.$$('#tabs .tab-btn').forEach(function (x) { x.classList.toggle('active', x === b); });
      CA.$$('.tab-pane').forEach(function (p) { p.classList.remove('active'); });
      document.getElementById('pane-' + b.getAttribute('data-tab')).classList.add('active');
      if (b.getAttribute('data-tab') === 'participacion') renderParticipacion();
    });
  });

  /* ---------- Mis productos ---------- */
  function renderProductos() {
    var lista = misProductos();
    var cont = document.getElementById('lista-productos');
    if (!lista.length) {
      cont.innerHTML =
        '<div class="empty"><div class="empty-icon">' + CA.icon('box') + '</div>' +
        '<h3>Aún no tienes productos publicados</h3><p>Registra tu primera pieza y empieza a venderla en la vitrina colectiva.</p>' +
        '<button type="button" class="btn btn-gold" id="vacio-agregar">' + CA.icon('plus') + ' Agregar mi primer producto</button></div>';
      document.getElementById('vacio-agregar').addEventListener('click', abrirNuevoProducto);
      return;
    }
    cont.innerHTML = lista.map(function (p) {
      return '<div class="list-row">' +
        '<img src="' + CA.imgSrc(p.imagen) + '" alt="">' +
        '<span class="lr-info"><strong>' + CA.esc(p.nombre) + '</strong>' +
        '<small>' + CA.fmtCOP(p.precio) + ' · ' + p.stock + ' unidad(es) · ' + (p.disponible ? 'visible en la vitrina' : 'oculto') + '</small></span>' +
        '<label class="switch" title="Mostrar u ocultar en la vitrina"><input type="checkbox" data-disp="' + p.id + '"' + (p.disponible ? ' checked' : '') + '><span class="track"></span></label>' +
        '<a class="btn btn-outline btn-sm" href="producto.html?id=' + p.id + '">' + CA.icon('eye') + ' Ver</a>' +
        '</div>';
    }).join('');

    CA.$$('[data-disp]', cont).forEach(function (sw) {
      sw.addEventListener('change', function () {
        var id = sw.getAttribute('data-disp');
        window.CA_Store.actualizar(function (st) {
          st.productos.forEach(function (p) { if (p.id === id) p.disponible = sw.checked; });
        });
        CA.toast(sw.checked ? 'Tu producto ya es visible en la vitrina.' : 'Tu producto se ocultó de la vitrina.', sw.checked ? 'success' : 'info');
        renderProductos();
      });
    });
  }

  function abrirNuevoProducto() {
    var art = getArt();
    CA.modal({
      title: 'Agregar un producto',
      html:
        '<p class="small muted" style="margin-bottom:16px">Completa los datos básicos. La cooperativa puede ayudarte a mejorar la descripción después.</p>' +
        '<div class="field"><label for="np-nombre">¿Qué hiciste? *</label><input type="text" id="np-nombre" placeholder="Ej.: Bolso tejido en palma de iraca"></div>' +
        '<div class="form-row">' +
        '<div class="field"><label for="np-categoria">Tipo de artesanía *</label><select id="np-categoria">' +
        CA_DATA.CATEGORIAS.map(function (c) { return '<option value="' + c.id + '"' + (c.id === art.especialidad ? ' selected' : '') + '>' + c.nombre + '</option>'; }).join('') +
        '</select></div>' +
        '<div class="field"><label for="np-precio">¿En cuánto lo vendes? (COP) *</label><input type="number" id="np-precio" min="1000" step="500" placeholder="85000"></div>' +
        '</div>' +
        '<div class="field"><label for="np-stock">¿Cuántas unidades tienes? *</label><input type="number" id="np-stock" min="1" step="1" value="1"></div>' +
        '<div class="field"><label for="np-desc">Cuéntanos de tu producto</label><textarea id="np-desc" rows="3" placeholder="¿Cómo lo hiciste? ¿Qué materiales usaste?"></textarea></div>',
      actions: [
        { label: 'Cancelar', cls: 'btn-outline' },
        {
          label: 'Publicar en la vitrina', cls: 'btn-gold', onClick: function (close, root) {
            var nombre = root.querySelector('#np-nombre').value.trim();
            var precio = Number(root.querySelector('#np-precio').value);
            var stock = Number(root.querySelector('#np-stock').value);
            var categoria = root.querySelector('#np-categoria').value;
            var desc = root.querySelector('#np-desc').value.trim() || 'Pieza elaborada a mano por una socia de Corazón Artesano.';
            if (nombre.length < 5) { CA.toast('Escribe el nombre de tu producto (mínimo 5 letras).', 'error'); return false; }
            if (!(precio >= 1000)) { CA.toast('Escribe un precio mayor a $1.000.', 'error'); return false; }
            if (!(stock >= 1)) { CA.toast('Indica cuántas unidades tienes disponibles.', 'error'); return false; }

            window.CA_Store.actualizar(function (st) {
              var maxSeq = st.productos.reduce(function (m, x) { return Math.max(m, x.seq || 0); }, 0);
              st.productos.push({
                id: 'p' + (maxSeq + 1), seq: maxSeq + 1, nombre: nombre, categoria: categoria, precio: precio,
                artesanaId: art.id, descripcion: desc, historia: desc,
                materiales: 'Materiales artesanales de la región', tiempo: 'Elaboración artesanal',
                stock: stock, disponible: true, imagen: IMG_POR_CATEGORIA[categoria] || 'prod-bolso-iraca',
                destacado: false, fechaPublicacion: CA.hoyISO(), unidadesVendidas: 0, ventasTotal: 0
              });
              st.artesanas.forEach(function (a) { if (a.id === art.id) a.productos += 1; });
            });
            CA.toast('“' + nombre + '” ya está publicado en la vitrina colectiva.', 'success', '¡Producto publicado!');
            renderProductos();
            renderKpis();
          }
        }
      ]
    });
  }

  document.getElementById('btn-agregar').addEventListener('click', abrirNuevoProducto);

  /* ---------- Mis ventas ---------- */
  function renderVentas() {
    var pedidos = misPedidos().slice().sort(function (a, b) { return a.fecha < b.fecha ? 1 : -1; });
    var ingresos = pedidos.reduce(function (t, p) { return t + p.valor; }, 0);
    var pendientes = pedidos.filter(function (p) { return p.estado === 'Pendiente' || p.estado === 'En preparación'; }).length;
    document.getElementById('resumen-ventas-artesana').innerHTML =
      '<span class="summary-chip">Ventas: <strong>' + pedidos.length + '</strong></span>' +
      '<span class="summary-chip">Ingresos: <strong>' + CA.fmtCOP(ingresos) + '</strong></span>' +
      '<span class="summary-chip">Por preparar: <strong>' + pendientes + '</strong></span>';

    var cont = document.getElementById('tabla-ventas');
    if (!pedidos.length) {
      cont.innerHTML = '<div class="empty"><div class="empty-icon">' + CA.icon('package') + '</div><h3>Sin ventas todavía</h3><p>Cuando alguien compre una de tus piezas, el pedido aparecerá aquí con todos los datos.</p></div>';
      return;
    }
    cont.innerHTML = '<div class="list-simple">' + pedidos.map(function (p) {
      var prod = null;
      getSt().productos.forEach(function (x) { if (x.id === p.productoId) prod = x; });
      return '<div class="list-row">' +
        '<span class="qa-ico" style="width:46px;height:46px;border-radius:12px;display:grid;place-items:center;flex:0 0 auto;background:var(--gold-100);color:var(--gold-600)">' + CA.icon('package') + '</span>' +
        '<span class="lr-info"><strong>' + CA.esc(prod ? prod.nombre : 'Producto retirado') + '</strong>' +
        '<small>' + p.id + ' · ' + CA.esc(p.cliente) + ' · ' + CA.fmtFecha(p.fecha) + ' · ' + CA.fmtCOP(p.valor) + '</small></span>' +
        CA.estadoBadge(p.estado) +
        '</div>';
    }).join('') + '</div>';
  }

  /* ---------- Mi perfil ---------- */
  function renderPerfil() {
    var art = getArt();
    document.getElementById('pf-nombre').value = art.nombre;
    document.getElementById('pf-telefono').value = art.telefono || '';
    document.getElementById('pf-municipio').value = art.municipio;
    document.getElementById('pf-especialidad').value = CA.catInfo(art.especialidad).nombre;
    document.getElementById('pf-estado').innerHTML = CA.estadoBadge(art.estado);
  }

  document.getElementById('btn-guardar-perfil').addEventListener('click', function () {
    var nombre = document.getElementById('pf-nombre').value.trim();
    var telefono = document.getElementById('pf-telefono').value.trim();
    var municipio = document.getElementById('pf-municipio').value.trim();
    if (nombre.length < 5) { CA.toast('Escribe tu nombre completo.', 'error'); return; }
    window.CA_Store.actualizar(function (st) {
      st.artesanas.forEach(function (a) {
        if (a.id === s.artesanaId) { a.nombre = nombre; a.telefono = telefono; a.municipio = municipio || a.municipio; }
      });
    });
    /* Actualizar también la sesión para que la barra superior use el nombre nuevo */
    s.nombre = nombre;
    CA.iniciarSesion(s);
    CA.toast('Tus datos se guardaron y ya se ven en la vitrina.', 'success', 'Perfil actualizado');
    renderHero();
    renderPerfil();
  });

  /* ---------- Mi historia ---------- */
  function renderHistoria() {
    document.getElementById('pf-bio').value = getArt().bio;
  }
  document.getElementById('btn-guardar-bio').addEventListener('click', function () {
    var bio = document.getElementById('pf-bio').value.trim();
    if (bio.length < 30) { CA.toast('Escribe un poco más de tu historia (mínimo 30 letras).', 'error'); return; }
    window.CA_Store.actualizar(function (st) {
      st.artesanas.forEach(function (a) { if (a.id === s.artesanaId) a.bio = bio; });
    });
    CA.toast('Tu historia quedó guardada y aparece en la página de tus productos.', 'success', 'Historia guardada');
  });

  /* ---------- Mi participación ---------- */
  function renderParticipacion() {
    var voto = window.CA_Store.votoGet();
    var votacion = getSt().votacion;
    var opcion = voto ? votacion.opciones.filter(function (o) { return o.id === voto.opcion; })[0] : null;
    var totalVotos = votacion.opciones.reduce(function (t, o) { return t + o.votos; }, 0);
    var art = getArt();

    document.getElementById('participacion-grid').innerHTML =
      '<div class="card">' +
      '<h3 style="font-size:1.05rem;margin-bottom:10px">' + CA.icon('vote') + ' La votación de la asamblea</h3>' +
      '<p class="small muted" style="margin-bottom:10px">' + CA.esc(votacion.pregunta) + '</p>' +
      (voto
        ? '<span class="badge badge-ok">Ya votaste por ' + CA.esc(opcion ? opcion.nombre : '—') + '</span>' +
          '<p class="small muted" style="margin-top:10px">' + CA.fmtNum(totalVotos) + ' votos contabilizados en la cooperativa.</p>'
        : '<p class="small" style="margin-bottom:12px">Todavía no has votado en esta consulta.</p>' +
          '<a class="btn btn-primary btn-sm" href="cooperativa.html#votacion">' + CA.icon('vote') + ' Ir a votar</a>') +
      '</div>' +
      '<div class="card">' +
      '<h3 style="font-size:1.05rem;margin-bottom:10px">' + CA.icon('users') + ' Mi comité</h3>' +
      (art.comite
        ? '<span class="badge badge-filigrana">' + CA.esc(art.comite) + '</span><p class="small muted" style="margin-top:10px">Tu voz representa a tus compañeras en este espacio de gestión.</p>'
        : '<p class="small muted">Aún no haces parte de un comité. Puedes postularte en la próxima asamblea: todas las socias pueden participar.</p>') +
      '</div>' +
      '<div class="card">' +
      '<h3 style="font-size:1.05rem;margin-bottom:10px">' + CA.icon('calendar') + ' Próximas citas</h3>' +
      '<div class="list-simple">' + getSt().asambleas.slice(0, 2).map(function (a) {
        return '<div style="display:flex;gap:10px;align-items:flex-start"><span class="dot dot-warn" style="margin-top:7px"></span>' +
          '<span class="small"><strong style="color:var(--navy-800)">' + CA.esc(a.titulo) + '</strong><br>' + CA.esc(a.fecha) + ' · ' + CA.esc(a.hora) + '<br><span class="muted">' + CA.esc(a.lugar) + '</span></span></div>';
      }).join('') + '</div></div>' +
      '<div class="card">' +
      '<h3 style="font-size:1.05rem;margin-bottom:10px">' + CA.icon('heart') + ' Mi voz cuenta</h3>' +
      '<p class="small muted" style="margin-bottom:12px">En Corazón Artesano cada socia vale igual: una persona, un voto. Tu participación decide el rumbo de la vitrina.</p>' +
      '<a class="btn btn-outline btn-sm" href="cooperativa.html">' + CA.icon('building') + ' Conocer la cooperativa</a>' +
      '</div>';
  }

  /* ---------- Arranque ---------- */
  renderHero();
  renderKpis();
  renderProductos();
  renderVentas();
  renderPerfil();
  renderHistoria();
})();
