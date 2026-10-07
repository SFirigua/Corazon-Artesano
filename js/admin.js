/* ============================================================
   CORAZÓN ARTESANO — Shell del panel administrativo
   Inyecta sidebar, topbar, notificaciones y configuración en
   las vistas de gestión. Exige sesión de administradora.
   ============================================================ */

window.CA_Admin = (function () {
  'use strict';

  var CA = window.CA;

  var NAV = [
    { href: 'dashboard.html', label: 'Dashboard', icon: 'grid' },
    { href: 'productos.html', label: 'Productos', icon: 'box' },
    { href: 'pedidos.html', label: 'Pedidos', icon: 'package' },
    { href: 'artesanas.html', label: 'Artesanas', icon: 'users' },
    { href: 'catalogo.html', label: 'Catálogo público', icon: 'store' },
    { href: 'cooperativa.html', label: 'Cooperativa', icon: 'building' },
    { href: 'impacto.html', label: 'Impacto', icon: 'chart' }
  ];

  function configDe(st) {
    return st.config || { nombre: 'Cooperativa Multiactiva Corazón Artesano', ciudad: 'Santa Cruz de Mompox, Bolívar', notificaciones: true };
  }

  function notificaciones() {
    var st = window.CA_Store.get();
    var pendientes = st.pedidos.filter(function (p) { return p.estado === 'Pendiente'; }).length;
    var agotados = st.productos.filter(function (p) { return !p.disponible; }).length;
    var items = [
      { icon: 'package', tono: 'warn', titulo: pendientes + ' pedido(s) pendientes de confirmación', detalle: 'Revísalos en la sección Pedidos y cámbialos a “En preparación”.' },
      { icon: 'alert', tono: 'danger', titulo: agotados + ' producto(s) agotados', detalle: 'Puedes reponer stock o pausar su disponibilidad desde Productos.' },
      { icon: 'calendar', tono: 'ok', titulo: 'Próxima asamblea general: 12 jul 2026', detalle: 'Orden del día: informe de ventas, comité de comercialización y presupuesto.' }
    ];
    CA.modal({
      title: 'Notificaciones (simuladas)',
      html: '<div class="list-simple">' + items.map(function (n) {
        return '<div class="list-row">' +
          '<span class="qa-ico" style="width:44px;height:44px;border-radius:12px;display:grid;place-items:center;flex:0 0 auto;background:' +
          (n.tono === 'warn' ? 'var(--gold-100);color:var(--gold-600)' : n.tono === 'danger' ? 'var(--terra-100);color:var(--danger)' : 'var(--green-100);color:var(--green-600)') + '">' + CA.icon(n.icon) + '</span>' +
          '<div class="lr-info"><strong>' + CA.esc(n.titulo) + '</strong><small>' + CA.esc(n.detalle) + '</small></div>' +
          '</div>';
      }).join('') + '</div>',
      actions: [
        { label: 'Ir a pedidos', cls: 'btn-primary', onClick: function () { window.location.href = 'pedidos.html'; } },
        { label: 'Cerrar', cls: 'btn-outline' }
      ]
    });
  }

  function configuracion() {
    var st = window.CA_Store.get();
    var cfg = configDe(st);
    CA.modal({
      title: 'Configuración del prototipo',
      html:
        '<p class="small muted" style="margin-bottom:16px">Los ajustes se guardan únicamente en este navegador (localStorage). No existe backend real.</p>' +
        '<div class="field"><label for="cfg-nombre">Nombre de la cooperativa</label><input type="text" id="cfg-nombre" value="' + CA.esc(cfg.nombre) + '"></div>' +
        '<div class="field"><label for="cfg-ciudad">Ciudad</label><input type="text" id="cfg-ciudad" value="' + CA.esc(cfg.ciudad) + '"></div>' +
        '<label class="switch" style="margin-bottom:22px"><input type="checkbox" id="cfg-notif"' + (cfg.notificaciones ? ' checked' : '') + '><span class="track"></span><span class="switch-label">Notificaciones simuladas</span></label>' +
        '<div class="card card-soft" style="padding:16px">' +
        '<strong style="color:var(--danger);display:block;margin-bottom:4px">Zona de reinicio</strong>' +
        '<p class="small" style="margin-bottom:12px">Vuelve a los datos iniciales del prototipo (75 artesanas, 128 productos, 46 pedidos, $8.450.000 en ventas). Se borrarán los cambios y la sesión.</p>' +
        '<button type="button" class="btn btn-danger btn-sm" id="cfg-reset">' + CA.icon('refresh') + ' Restablecer datos del prototipo</button>' +
        '</div>',
      actions: [
        { label: 'Cancelar', cls: 'btn-outline' },
        {
          label: 'Guardar cambios', cls: 'btn-primary', onClick: function (close, root) {
            var nombre = root.querySelector('#cfg-nombre').value.trim() || cfg.nombre;
            var ciudad = root.querySelector('#cfg-ciudad').value.trim() || cfg.ciudad;
            var notif = root.querySelector('#cfg-notif').checked;
            window.CA_Store.actualizar(function (s) {
              s.config = { nombre: nombre, ciudad: ciudad, notificaciones: notif };
            });
            CA.toast('Configuración guardada en este navegador.', 'success');
          }
        }
      ],
      onOpen: function (root) {
        root.querySelector('#cfg-reset').addEventListener('click', function () {
          CA.confirmar({
            title: '¿Restablecer el prototipo?',
            mensaje: 'Se perderán los productos, pedidos, votos y la sesión actual. Los datos iniciales se regenerarán de inmediato.',
            okLabel: 'Sí, restablecer',
            danger: true,
            onOk: function () {
              window.CA_Store.reset();
              window.location.href = 'index.html';
            }
          });
        });
      }
    });
  }

  function shell(active) {
    var s = window.CA_Auth.requerir('admin');
    if (!s) return null;

    var st = window.CA_Store.get();
    var cfg = configDe(st);
    var pendientes = st.pedidos.filter(function (p) { return p.estado === 'Pendiente'; }).length;
    var titulo = document.body.getAttribute('data-titulo') || 'Panel de gestión';
    var sub = document.body.getAttribute('data-sub') || cfg.nombre;

    var sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.innerHTML =
        '<a class="sidebar-brand" href="index.html" style="text-decoration:none">' +
        '<img src="assets/images/logo.svg" alt="">' +
        '<span><span class="brand-name">Corazón Artesano</span><br><span class="brand-sub">Panel de gestión</span></span></a>' +
        '<nav class="sidebar-nav" aria-label="Menú del panel">' +
        NAV.map(function (n) {
          return '<a href="' + n.href + '" class="' + (active === n.href ? 'active' : '') + '">' + CA.icon(n.icon) + n.label + '</a>';
        }).join('') +
        '<span class="nav-sep"></span>' +
        '<button type="button" id="nav-config">' + CA.icon('settings') + 'Configuración</button>' +
        '<button type="button" id="nav-salir">' + CA.icon('logout') + 'Cerrar sesión</button>' +
        '</nav>' +
        '<div class="sidebar-user">' +
        '<img class="avatar avatar-sm" src="' + CA.avatarURI(s.nombre) + '" alt="">' +
        '<span class="su-info"><strong>Administradora</strong><small>' + CA.esc(s.email) + '</small></span>' +
        '<button type="button" class="su-logout" id="nav-salir-2" aria-label="Cerrar sesión">' + CA.icon('logout') + '</button>' +
        '</div>';

      sidebar.querySelector('#nav-config').addEventListener('click', configuracion);
      [sidebar.querySelector('#nav-salir'), sidebar.querySelector('#nav-salir-2')].forEach(function (b) {
        b.addEventListener('click', function () {
          CA.confirmar({
            title: 'Cerrar sesión',
            mensaje: '¿Seguro que deseas salir del panel de administración?',
            okLabel: 'Cerrar sesión',
            onOk: function () {
              window.CA_Store.sesionClear();
              window.location.href = 'index.html';
            }
          });
        });
      });
    }

    var topbar = document.getElementById('topbar');
    if (topbar) {
      topbar.innerHTML =
        '<button type="button" class="tb-toggle" id="tb-toggle" aria-label="Abrir menú">' + CA.icon('menu') + '</button>' +
        '<div class="tb-title"><h1>' + CA.esc(titulo) + '</h1><p>' + CA.esc(sub) + '</p></div>' +
        '<div class="tb-actions">' +
        '<span class="tb-chip">' + CA.icon('calendar') + CA.fmtFecha(CA.hoyISO()) + '</span>' +
        '<button type="button" class="nav-cart" id="tb-bell" aria-label="Notificaciones" style="position:relative">' + CA.icon('bell') +
        (pendientes ? '<span class="cart-count" style="display:grid">' + Math.min(pendientes, 9) + '</span>' : '') +
        '</button></div>';

      var toggle = topbar.querySelector('#tb-toggle');
      var backdrop = document.createElement('div');
      backdrop.className = 'sidebar-backdrop';
      backdrop.style.display = 'none';
      document.body.appendChild(backdrop);

      function abrirMenu() {
        sidebar.classList.add('open');
        backdrop.style.display = 'block';
      }
      function cerrarMenu() {
        sidebar.classList.remove('open');
        backdrop.style.display = 'none';
      }
      toggle.addEventListener('click', abrirMenu);
      backdrop.addEventListener('click', cerrarMenu);
      sidebar.querySelectorAll('.sidebar-nav a').forEach(function (a) { a.addEventListener('click', cerrarMenu); });

      topbar.querySelector('#tb-bell').addEventListener('click', notificaciones);
    }

    return s;
  }

  return { shell: shell, configuracion: configuracion, notificaciones: notificaciones };
})();
