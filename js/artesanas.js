/* ============================================================
   CORAZÓN ARTESANO — Las 75 artesanas
   Grid con filtros, orden y modal de perfil con productos.
   ============================================================ */

(function () {
  'use strict';

  var CA = window.CA;
  var estado = { q: '', esp: 'todas', est: 'todos', orden: 'orden', visibles: 12 };
  var grid = document.getElementById('grid');

  var st = window.CA_Store.get();

  /* ---------- Cifras superiores ---------- */
  var activas = st.artesanas.filter(function (a) { return a.estado === 'Activa'; }).length;
  var ventasTotales = st.artesanas.reduce(function (s, a) { return s + a.ventas; }, 0);
  document.getElementById('hero-stats').innerHTML =
    '<div class="ph-stat"><strong>' + st.artesanas.length + '</strong> socias en la cooperativa</div>' +
    '<div class="ph-stat"><strong>' + activas + '</strong> activas hoy</div>' +
    '<div class="ph-stat"><strong>5</strong> especialidades artesanales</div>' +
    '<div class="ph-stat"><strong>' + CA.fmtCOP(ventasTotales) + '</strong> ventas directas acumuladas</div>';

  function filtrar() {
    var q = estado.q.toLowerCase();
    var lista = st.artesanas.filter(function (a) {
      if (estado.esp !== 'todas' && a.especialidad !== estado.esp) return false;
      if (estado.est !== 'todos' && a.estado !== estado.est) return false;
      if (!q) return true;
      return (a.nombre + ' ' + CA.catInfo(a.especialidad).nombre + ' ' + (a.comite || '')).toLowerCase().indexOf(q) >= 0;
    });
    switch (estado.orden) {
      case 'ventas': lista.sort(function (a, b) { return b.ventas - a.ventas; }); break;
      case 'productos': lista.sort(function (a, b) { return b.productos - a.productos; }); break;
      case 'oficio': lista.sort(function (a, b) { return b.anios - a.anios; }); break;
      case 'nombre': lista.sort(function (a, b) { return a.nombre.localeCompare(b.nombre, 'es'); }); break;
      default: lista.sort(function (a, b) { return Number(a.id.slice(1)) - Number(b.id.slice(1)); });
    }
    return lista;
  }

  function render() {
    var lista = filtrar();
    var visibles = lista.slice(0, estado.visibles);

    grid.innerHTML = visibles.map(function (a) {
      var cat = CA.catInfo(a.especialidad);
      var punto = a.estado === 'Activa' ? 'dot-ok' : a.estado === 'Nueva' ? 'dot-warn' : 'dot-off';
      return '<article class="artesana-card">' +
        '<img class="avatar" src="' + CA.avatarURI(a.nombre) + '" alt="Retrato de ' + CA.esc(a.nombre) + '">' +
        '<h3>' + CA.esc(a.nombre) + '</h3>' +
        '<span class="badge badge-' + cat.id + '">' + CA.esc(cat.nombre) + '</span>' +
        '<span class="ac-meta"><span class="dot ' + punto + '"></span>' + CA.esc(a.estado) + ' · ' + a.edad + ' años</span>' +
        '<div class="ac-stats">' +
        '<div><strong>' + a.productos + '</strong><span>productos</span></div>' +
        '<div><strong>' + CA.fmtCorto(a.ventas) + '</strong><span>ventas</span></div>' +
        '<div><strong>' + a.anios + '</strong><span>años oficio</span></div>' +
        '</div>' +
        '<button type="button" class="btn btn-outline btn-sm" data-perfil="' + a.id + '">' + CA.icon('eye') + ' Ver perfil</button>' +
        '</article>';
    }).join('');

    document.getElementById('contador').textContent = 'Mostrando ' + visibles.length + ' de ' + lista.length + ' artesanas';
    document.getElementById('vacio').innerHTML = lista.length === 0
      ? '<div class="empty"><div class="empty-icon">' + CA.icon('users') + '</div><h3>Sin resultados</h3><p>Prueba con otro nombre o especialidad.</p></div>'
      : '';
    document.getElementById('mas').style.display = lista.length > estado.visibles ? 'inline-flex' : 'none';
    document.getElementById('mas').textContent = 'Cargar más artesanas (' + (lista.length - estado.visibles) + ' restantes)';

    CA.$$('[data-perfil]', grid).forEach(function (b) {
      b.addEventListener('click', function () { verPerfil(b.getAttribute('data-perfil')); });
    });
  }

  function verPerfil(id) {
    var a = CA.artesana(id);
    if (!a) return;
    var cat = CA.catInfo(a.especialidad);
    var suyos = st.productos.filter(function (p) { return p.artesanaId === a.id; });
    CA.modal({
      title: 'Perfil de la artesana',
      size: 'lg',
      html:
        '<div class="artisan-spotlight" style="border:none;box-shadow:none;padding:0">' +
        '<div class="as-photo"><img class="avatar" src="' + CA.avatarURI(a.nombre) + '" alt="" style="width:132px;height:132px;border:4px solid var(--gold-300);border-radius:50%">' +
        CA.estadoBadge(a.estado) + '</div>' +
        '<div class="as-body">' +
        '<h3>' + CA.esc(a.nombre) + '</h3>' +
        '<div class="as-meta">' +
        '<span>' + CA.icon('pin') + CA.esc(a.municipio) + '</span>' +
        '<span>' + CA.icon('star') + CA.esc(cat.nombre) + '</span>' +
        '<span>' + CA.icon('clock') + a.anios + ' años de oficio</span>' +
        '<span>' + CA.icon('user') + a.edad + ' años</span>' +
        '</div>' +
        '<p>' + CA.esc(a.bio) + '</p>' +
        (a.comite ? '<span class="badge badge-filigrana" style="margin-bottom:10px">' + CA.icon('vote') + ' ' + CA.esc(a.comite) + '</span>' : '') +
        '<div class="as-stats">' +
        '<div class="as-stat"><strong>' + a.productos + '</strong><span>productos publicados</span></div>' +
        '<div class="as-stat"><strong>' + CA.fmtCOP(a.ventas) + '</strong><span>ventas directas</span></div>' +
        '<div class="as-stat"><strong>' + a.pedidos + '</strong><span>pedidos recibidos</span></div>' +
        '</div></div></div>' +
        (suyos.length
          ? '<h4 style="margin:18px 0 10px;font-family:var(--font-display);color:var(--navy-800)">Productos de ' + CA.esc(CA.nombreCorto(a)) + '</h4>' +
            '<div class="list-simple">' + suyos.slice(0, 6).map(function (p) {
              return '<a class="list-row" href="producto.html?id=' + p.id + '" style="text-decoration:none">' +
                '<img src="' + CA.imgSrc(p.imagen) + '" alt="">' +
                '<span class="lr-info"><strong>' + CA.esc(p.nombre) + '</strong><small>' + CA.fmtCOP(p.precio) + ' · ' + (p.disponible ? 'disponible' : 'agotado') + '</small></span>' +
                CA.icon('chevronRight') + '</a>';
            }).join('') + '</div>'
          : '<p class="muted small mt-16">Esta socia aún no tiene productos publicados.</p>'),
      actions: [
        { label: 'Cerrar', cls: 'btn-outline' },
        { label: 'Ver catálogo', cls: 'btn-primary', onClick: function () { window.location.href = 'catalogo.html'; } }
      ]
    });
  }

  /* ---------- Filtros ---------- */
  var temporizador = null;
  document.getElementById('buscar').addEventListener('input', function (e) {
    clearTimeout(temporizador);
    var v = e.target.value;
    temporizador = setTimeout(function () { estado.q = v; estado.visibles = 12; render(); }, 180);
  });
  document.getElementById('filtro-estado').addEventListener('change', function (e) { estado.est = e.target.value; estado.visibles = 12; render(); });
  document.getElementById('ordenar').addEventListener('change', function (e) { estado.orden = e.target.value; render(); });
  document.getElementById('chips').addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    estado.esp = chip.getAttribute('data-esp');
    estado.visibles = 12;
    CA.$$('#chips .chip').forEach(function (c) { c.classList.toggle('active', c === chip); });
    render();
  });
  document.getElementById('mas').addEventListener('click', function () { estado.visibles += 12; render(); });
  document.getElementById('limpiar').addEventListener('click', function () {
    estado = { q: '', esp: 'todas', est: 'todos', orden: 'orden', visibles: 12 };
    document.getElementById('buscar').value = '';
    document.getElementById('filtro-estado').value = 'todos';
    document.getElementById('ordenar').value = 'orden';
    CA.$$('#chips .chip').forEach(function (c) { c.classList.toggle('active', c.getAttribute('data-esp') === 'todas'); });
    render();
  });

  render();
})();
