/* ============================================================
   CORAZÓN ARTESANO — Núcleo de la interfaz
   Utilidades, iconos, avatares, navbar, carrito, modales,
   notificaciones y gráficos. Sin dependencias externas.
   ============================================================ */

window.CA = (function () {
  'use strict';

  /* ---------------- Utilidades ---------------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function pad(n, len) {
    var s = String(n);
    while (s.length < len) s = '0' + s;
    return s;
  }

  function fmtCOP(n) { return '$' + Math.round(n).toLocaleString('es-CO'); }

  function fmtCorto(n) {
    if (n >= 1000000) {
      var m = n / 1000000;
      return '$' + (m % 1 === 0 ? m : m.toFixed(2).replace('.', ',')) + 'M';
    }
    if (n >= 1000) return '$' + Math.round(n / 1000) + 'k';
    return '$' + n;
  }

  function fmtNum(n) { return Math.round(n).toLocaleString('es-CO'); }

  var MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function fmtFecha(iso) {
    if (!iso) return '—';
    var p = String(iso).split('-');
    if (p.length < 3) return iso;
    return Number(p[2]) + ' ' + MESES_CORTOS[Number(p[1]) - 1] + ' ' + p[0];
  }

  function hoyISO() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1, 2) + '-' + pad(d.getDate(), 2);
  }

  function catInfo(id) {
    var cats = window.CA_DATA.CATEGORIAS;
    for (var i = 0; i < cats.length; i++) if (cats[i].id === id) return cats[i];
    return { id: id, nombre: id, color: '#8A7B63', bg: '#F1E8D7', icon: 'box' };
  }

  function imgSrc(key) { return 'assets/images/' + key + '.svg'; }

  function estadoBadge(estado) {
    var map = {
      'Pendiente': 'badge-pendiente', 'En preparación': 'badge-preparacion',
      'Enviado': 'badge-enviado', 'Entregado': 'badge-entregado',
      'Activa': 'badge-activa', 'Nueva': 'badge-nueva', 'En proceso': 'badge-pendiente'
    };
    return '<span class="badge ' + (map[estado] || 'badge-neutral') + '">' + esc(estado) + '</span>';
  }

  function categoriaBadge(catId) {
    var c = catInfo(catId);
    return '<span class="badge badge-' + c.id + '">' + esc(c.nombre) + '</span>';
  }

  function sesion() { return window.CA_Store.sesionGet(); }
  function iniciarSesion(u) { window.CA_Store.sesionSet(u); }
  function cerrarSesion() {
    window.CA_Store.sesionClear();
    window.location.href = 'index.html';
  }

  function producto(id) {
    var st = window.CA_Store.get();
    for (var i = 0; i < st.productos.length; i++) if (st.productos[i].id === id) return st.productos[i];
    return null;
  }
  function artesana(id) {
    var st = window.CA_Store.get();
    for (var i = 0; i < st.artesanas.length; i++) if (st.artesanas[i].id === id) return st.artesanas[i];
    return null;
  }
  function pedido(id) {
    var st = window.CA_Store.get();
    for (var i = 0; i < st.pedidos.length; i++) if (st.pedidos[i].id === id) return st.pedidos[i];
    return null;
  }

  /* ---------------- Iconos ---------------- */
  var ICONS = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    cart: '<path d="M6 6h15l-1.6 9.5H7.2z"/><path d="M6 6L5 3H2"/><circle cx="9" cy="20" r="1.6"/><circle cx="17" cy="20" r="1.6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>',
    login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    grid: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
    box: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v9"/>',
    package: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4"/><path d="M12 12v10"/><path d="M8 5.5l8 4"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.4 3.7-5 6.5-5s5.5 1.6 6.5 5"/><circle cx="17.5" cy="9" r="3"/><path d="M16 15.2c2.8.2 4.9 1.7 5.7 4.8"/>',
    store: '<path d="M4 10v10h16V10"/><path d="M3 10l1.5-6h15L21 10"/><path d="M9 20v-6h6v6"/>',
    heart: '<path d="M12 20s-7-4.6-9.2-9C1.3 8 3 5 6.3 5c2 0 3.4 1 5.7 3.5C14.3 6 15.7 5 17.7 5c3.3 0 5 3 3.5 6-2.2 4.4-9.2 9-9.2 9z"/>',
    chart: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M2 20h20"/>',
    settings: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4L5.3 5.3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M4 20h4L18 10l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    trash: '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="3"/>',
    check: '<path d="M4 12.5l5 5L20 6.5"/>',
    chevronDown: '<path d="M6 9l6 6 6-6"/>',
    chevronRight: '<path d="M9 6l6 6-6 6"/>',
    arrowRight: '<path d="M4 12h16"/><path d="M14 6l6 6-6 6"/>',
    arrowDown: '<path d="M12 4v16"/><path d="M6 14l6 6 6-6"/>',
    arrowLeft: '<path d="M20 12H4"/><path d="M10 6l-6 6 6 6"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10"/><path d="M15 9.5c-.5-1-1.7-1.5-3-1.5-1.6 0-3 .8-3 2s1.4 1.8 3 2 3 .9 3 2-1.4 2-3 2c-1.3 0-2.5-.5-3-1.5"/>',
    leaf: '<path d="M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 10-6 10-16z"/><path d="M4 20c3-6 7-9 12-11"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17l9 5 9-5"/>',
    gem: '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20"/><path d="M12 21L8 9l4-6 4 6z"/>',
    cookie: '<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1.2"/><circle cx="14" cy="8.5" r="1.2"/><circle cx="15" cy="14" r="1.2"/><circle cx="9.5" cy="15" r="1.2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9.5C7.5 20 4 17 4 12V6z"/><path d="M9 12l2 2 4-4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v4"/><path d="M12 17h.01"/>',
    quote: '<path d="M8 7c-2.8 0-5 2.2-5 5v5h6v-6H6.5C6.6 9.6 7.3 8.6 8 8zM19 7c-2.8 0-5 2.2-5 5v5h6v-6h-2.5c.1-1.4.8-2.4 1.5-3z"/>',
    vote: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12l3 3 5-6"/>',
    pin: '<path d="M12 21s-7-5.8-7-11a7 7 0 0 1 14 0c0 5.2-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    star: '<path d="M12 3l2.7 5.8 6.3.8-4.6 4.3 1.2 6.1L12 17l-5.6 3 1.2-6.1L3 9.6l6.3-.8z"/>',
    trendUp: '<path d="M3 17l6-6 4 4 7-8"/><path d="M14 7h6v6"/>',
    scale: '<path d="M12 3v18M5 6l14 0"/><path d="M8 6l-3.5 8a3.5 3.5 0 0 0 7 0zM16 6l-3.5 8a3.5 3.5 0 0 0 7 0z"/><path d="M9 21h6"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h1.5M13.5 7H15M9 11h1.5M13.5 11H15M9 15h1.5M13.5 15H15"/><path d="M10 21v-3h4v3"/>',
    bell: '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
    download: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 21h16"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.5-4M4 5v6h6"/><path d="M4 13a8 8 0 0 0 14.5 4M20 19v-6h-6"/>'
  };

  function icon(name, cls) {
    var body = ICONS[name] || '';
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  }

  /* ---------------- Avatares SVG ---------------- */
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h;
  }

  function avatarURI(nombre) {
    var h = hash(nombre || 'artesana');
    var pieles = ['#8D5524', '#A66B3A', '#C68642', '#E0AC69'];
    var pelos = ['#1C1A1A', '#3B2C24', '#5A3E2B', '#2E241F', '#6B4E3D'];
    var blusas = ['#2F6B4F', '#1C3157', '#B5533C', '#C89B3C', '#7A5C8C', '#25543E'];
    var fondos = ['#F7EDD6', '#E4EFE7', '#F6EBE0', '#F0E8F4', '#FAEFE7'];
    var piel = pieles[h % 4];
    var pelo = pelos[(h >> 3) % 5];
    var blusa = blusas[(h >> 6) % 6];
    var fondo = fondos[(h >> 9) % 5];
    var estilo = (h >> 12) % 3;

    var cabello = '<path d="M66 82a34 34 0 0 1 68 0q-6-26-34-26t-34 26z" fill="' + pelo + '"/>';
    if (estilo === 0) {
      cabello += '<circle cx="100" cy="42" r="13" fill="' + pelo + '"/><circle cx="100" cy="42" r="13" fill="none" stroke="#C89B3C" stroke-width="2" opacity=".65"/>';
    } else if (estilo === 1) {
      cabello += '<path d="M66 80q-8 38 8 58l12-6q-12-26-8-52z" fill="' + pelo + '"/>';
      cabello += '<path d="M134 80q8 38-8 58l-12-6q12-26 8-52z" fill="' + pelo + '"/>';
    } else {
      cabello += '<path d="M64 76q10-20 36-20t36 20q-2-30-36-30t-36 30z" fill="' + pelo + '"/>';
    }

    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' +
      '<circle cx="100" cy="100" r="100" fill="' + fondo + '"/>' +
      '<circle cx="100" cy="100" r="89" fill="none" stroke="#C89B3C" stroke-opacity=".4" stroke-width="1.6" stroke-dasharray="2 6"/>' +
      '<path d="M100 122c-40 0-66 26-70 70h140c-4-44-30-70-70-70z" fill="' + blusa + '"/>' +
      '<rect x="91" y="106" width="18" height="22" rx="8" fill="' + piel + '"/>' +
      '<circle cx="100" cy="82" r="35" fill="' + piel + '"/>' +
      cabello +
      '<circle cx="87" cy="83" r="3" fill="#2A2117"/><circle cx="113" cy="83" r="3" fill="#2A2117"/>' +
      '<path d="M92 96q8 7 16 0" fill="none" stroke="#2A2117" stroke-width="2.2" stroke-linecap="round"/>' +
      '<circle cx="62" cy="94" r="3.4" fill="#C89B3C"/><circle cx="138" cy="94" r="3.4" fill="#C89B3C"/>' +
      '<path d="M84 150q16 10 32 0" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2.4" stroke-linecap="round"/>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* ---------------- Toasts ---------------- */
  function toastRoot() {
    var root = $('#toast-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'toast-root';
      root.className = 'toast-root';
      document.body.appendChild(root);
    }
    return root;
  }

  function toast(msg, tipo, titulo) {
    var t = tipo || 'info';
    var iconName = t === 'success' ? 'check' : t === 'error' ? 'alert' : 'info';
    var el = document.createElement('div');
    el.className = 'toast toast-' + t;
    el.innerHTML = icon(iconName) +
      '<div><strong>' + esc(titulo || (t === 'success' ? 'Listo' : t === 'error' ? 'Atención' : 'Información')) + '</strong>' +
      '<p>' + esc(msg) + '</p></div>';
    toastRoot().appendChild(el);
    setTimeout(function () {
      el.classList.add('hide');
      setTimeout(function () { el.remove(); }, 240);
    }, 3600);
  }

  /* ---------------- Modales ---------------- */
  function modal(opts) {
    var backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    var acciones = (opts.actions || []).map(function (a, i) {
      return '<button type="button" class="btn ' + (a.cls || 'btn-outline') + '" data-accion="' + i + '">' + esc(a.label) + '</button>';
    }).join('');
    backdrop.innerHTML =
      '<div class="modal ' + (opts.size === 'lg' ? 'modal-lg' : '') + '" role="dialog" aria-modal="true">' +
      '<div class="modal-head"><h3>' + (opts.title || '') + '</h3>' +
      '<button type="button" class="modal-close" aria-label="Cerrar">' + icon('close') + '</button></div>' +
      '<div class="modal-body">' + (opts.html || '') + '</div>' +
      (acciones ? '<div class="modal-foot">' + acciones + '</div>' : '') +
      '</div>';

    function close() {
      backdrop.remove();
      document.removeEventListener('keydown', onKey);
      if (opts.onClose) opts.onClose();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    $('.modal-close', backdrop).addEventListener('click', close);
    backdrop.addEventListener('mousedown', function (e) {
      if (e.target === backdrop && opts.static !== true) close();
    });
    $$('[data-accion]', backdrop).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var a = opts.actions[Number(btn.getAttribute('data-accion'))];
        if (a.onClick) {
          var res = a.onClick(close, backdrop);
          if (res === false) return;
        }
        if (a.close !== false) close();
      });
    });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(backdrop);
    if (opts.onOpen) opts.onOpen(backdrop);
    var first = $('input, select, textarea, button:not(.modal-close)', backdrop);
    if (first) first.focus();
    return { el: backdrop, close: close };
  }

  function confirmar(opts) {
    return modal({
      title: opts.title || 'Confirmar acción',
      html: '<p>' + (opts.mensaje || '') + '</p>',
      actions: [
        { label: opts.cancelLabel || 'Cancelar', cls: 'btn-outline' },
        { label: opts.okLabel || 'Confirmar', cls: opts.danger ? 'btn-danger' : 'btn-primary', onClick: opts.onOk || null }
      ]
    });
  }

  /* ---------------- Carrito ---------------- */
  function carritoItems() {
    var raw = window.CA_Store.carritoGet();
    var st = window.CA_Store.get();
    return raw.map(function (it) {
      var prod = null;
      for (var i = 0; i < st.productos.length; i++) if (st.productos[i].id === it.id) prod = st.productos[i];
      return prod ? { id: it.id, qty: it.qty, producto: prod } : null;
    }).filter(Boolean);
  }

  function carritoGuardar(items) {
    window.CA_Store.carritoSet(items.map(function (it) { return { id: it.id, qty: it.qty }; }));
    actualizarContadorCarrito();
  }

  function carritoAdd(prodId, qty) {
    qty = qty || 1;
    var prod = producto(prodId);
    if (!prod || !prod.disponible || prod.stock <= 0) { toast('Este producto no está disponible en este momento.', 'error'); return; }
    var items = carritoItems();
    var existente = null;
    items.forEach(function (it) { if (it.id === prodId) existente = it; });
    var actual = existente ? existente.qty : 0;
    if (actual + qty > prod.stock) {
      toast('Solo quedan ' + prod.stock + ' unidades disponibles de esta pieza.', 'error', 'Stock limitado');
      return;
    }
    if (existente) existente.qty += qty;
    else items.push({ id: prodId, qty: qty, producto: prod });
    carritoGuardar(items);
    toast(prod.nombre + ' se agregó al carrito. La compra va directo a ' + nombreCorto(artesana(prod.artesanaId)) + '.', 'success', 'Agregado al carrito');
    renderCarrito();
  }

  function carritoSetQty(prodId, qty) {
    var prod = producto(prodId);
    var items = carritoItems();
    items.forEach(function (it) {
      if (it.id === prodId) it.qty = Math.max(1, Math.min(qty, prod ? prod.stock : qty));
    });
    carritoGuardar(items);
    renderCarrito();
  }

  function carritoRemove(prodId) {
    carritoGuardar(carritoItems().filter(function (it) { return it.id !== prodId; }));
    renderCarrito();
  }

  function carritoCount() {
    return carritoItems().reduce(function (s, it) { return s + it.qty; }, 0);
  }

  function carritoTotal() {
    return carritoItems().reduce(function (s, it) { return s + it.qty * it.producto.precio; }, 0);
  }

  function nombreCorto(a) {
    if (!a) return 'la artesana';
    return a.nombre.split(' ').slice(0, 2).join(' ');
  }

  function actualizarContadorCarrito() {
    var n = carritoCount();
    $$('.cart-count').forEach(function (el) {
      el.textContent = n;
      el.style.display = n > 0 ? '' : 'none';
    });
  }

  function montarCarrito() {
    if ($('#drawer-root')) return;
    var root = document.createElement('div');
    root.id = 'drawer-root';
    document.body.appendChild(root);
  }

  function renderCarrito() {
    var root = $('#drawer-root');
    if (!root) return;
    var open = $('#cart-drawer');
    if (!open) return;
    var items = carritoItems();
    var body = $('.drawer-body', open);
    var foot = $('.drawer-foot', open);

    if (!items.length) {
      body.innerHTML =
        '<div class="empty" style="border:none;padding:40px 10px">' +
        '<div class="empty-icon">' + icon('cart') + '</div>' +
        '<h3>Tu carrito está vacío</h3><p>Explora el catálogo colectivo y apoya directamente a las artesanas de Mompox.</p>' +
        '<a href="catalogo.html" class="btn btn-primary">' + icon('store') + ' Ir al catálogo</a></div>';
      foot.innerHTML = '';
      return;
    }
    body.innerHTML = items.map(function (it) {
      var a = artesana(it.producto.artesanaId);
      return '<div class="cart-item">' +
        '<img src="' + imgSrc(it.producto.imagen) + '" alt="' + esc(it.producto.nombre) + '">' +
        '<div class="ci-info"><div class="ci-name">' + esc(it.producto.nombre) + '</div>' +
        '<div class="ci-meta">' + esc(nombreCorto(a)) + ' · ' + esc(catInfo(it.producto.categoria).nombre) + '</div>' +
        '<div class="ci-price">' + fmtCOP(it.producto.precio * it.qty) + '</div></div>' +
        '<div style="display:grid;gap:8px;justify-items:end">' +
        '<div class="qty"><button type="button" data-qty-menos="' + it.id + '" aria-label="Quitar una">−</button><span>' + it.qty + '</span><button type="button" data-qty-mas="' + it.id + '" aria-label="Agregar una">+</button></div>' +
        '<button type="button" class="btn btn-ghost btn-xs" data-quitar="' + it.id + '">' + icon('trash') + ' Quitar</button>' +
        '</div></div>';
    }).join('');

    var total = carritoTotal();
    foot.innerHTML =
      '<div class="cart-note">' + icon('leaf') +
      '<span><strong>Compra directa:</strong> el 100 % del valor llega a la artesana, sin intermediarios.</span></div>' +
      '<div class="cart-summary">' +
      '<div class="row"><span>' + carritoCount() + ' producto(s)</span><span>' + fmtCOP(total) + '</span></div>' +
      '<div class="row"><span>Envío</span><span>Se acuerda con la artesana (simulado)</span></div>' +
      '<div class="row total"><span>Total</span><span>' + fmtCOP(total) + '</span></div></div>' +
      '<button type="button" class="btn btn-gold btn-block" id="btn-checkout">' + icon('check') + ' Finalizar compra (simulada)</button>';

    $$('[data-qty-menos]', body).forEach(function (b) {
      b.addEventListener('click', function () {
        var it = carritoItems().filter(function (x) { return x.id === b.getAttribute('data-qty-menos'); })[0];
        if (it) carritoSetQty(it.id, it.qty - 1);
      });
    });
    $$('[data-qty-mas]', body).forEach(function (b) {
      b.addEventListener('click', function () {
        var it = carritoItems().filter(function (x) { return x.id === b.getAttribute('data-qty-mas'); })[0];
        if (it) carritoSetQty(it.id, it.qty + 1);
      });
    });
    $$('[data-quitar]', body).forEach(function (b) {
      b.addEventListener('click', function () {
        carritoRemove(b.getAttribute('data-quitar'));
        toast('Producto retirado del carrito.', 'info');
      });
    });
    var btn = $('#btn-checkout', foot);
    if (btn) btn.addEventListener('click', abrirCheckout);
  }

  function abrirCarrito() {
    montarCarrito();
    if ($('#cart-drawer')) return;
    var items = carritoItems();
    var backdrop = document.createElement('div');
    backdrop.className = 'drawer-backdrop';
    var drawer = document.createElement('aside');
    drawer.id = 'cart-drawer';
    drawer.className = 'drawer';
    drawer.setAttribute('aria-label', 'Carrito de compras');
    drawer.innerHTML =
      '<div class="drawer-head"><h3>' + icon('cart') + 'Tu carrito</h3>' +
      '<button type="button" class="modal-close" data-cerrar-carrito aria-label="Cerrar">' + icon('close') + '</button></div>' +
      '<div class="drawer-body"></div><div class="drawer-foot"></div>';
    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    function cerrar() {
      backdrop.remove();
      drawer.remove();
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') cerrar(); }
    backdrop.addEventListener('click', cerrar);
    $('[data-cerrar-carrito]', drawer).addEventListener('click', cerrar);
    document.addEventListener('keydown', onKey);
    if (!items.length) toast('Tu carrito está vacío: agrega piezas desde el catálogo.', 'info');
    renderCarrito();
  }

  function abrirCheckout() {
    var items = carritoItems();
    if (!items.length) { toast('Agrega al menos un producto antes de finalizar.', 'error'); return; }
    if ($('#cart-drawer')) $('#cart-drawer').remove();
    if ($('.drawer-backdrop')) $('.drawer-backdrop').remove();

    var filas = items.map(function (it) {
      return '<div class="cart-item" style="margin-bottom:9px">' +
        '<img src="' + imgSrc(it.producto.imagen) + '" alt="">' +
        '<div class="ci-info"><div class="ci-name">' + esc(it.producto.nombre) + '</div>' +
        '<div class="ci-meta">' + it.qty + ' × ' + fmtCOP(it.producto.precio) + ' · ' + esc(nombreCorto(artesana(it.producto.artesanaId))) + '</div></div>' +
        '<div class="ci-price">' + fmtCOP(it.qty * it.producto.precio) + '</div></div>';
    }).join('');

    modal({
      title: 'Finalizar compra — simulación',
      size: 'lg',
      html:
        '<div class="cart-note" style="margin-bottom:14px">' + icon('info') +
        '<span>Este prototipo <strong>no procesa pagos reales</strong>. Al confirmar, el pedido queda registrado en el panel de la cooperativa como si un cliente hubiera comprado de verdad.</span></div>' +
        filas +
        '<div class="row total" style="display:flex;justify-content:space-between;font-weight:800;padding:10px 0;border-top:1px dashed var(--line-strong)">' +
        '<span>Total</span><span>' + fmtCOP(carritoTotal()) + '</span></div>' +
        '<div class="form-row">' +
        '<div class="field"><label for="co-nombre">Tu nombre *</label><input type="text" id="co-nombre" placeholder="Ej.: Valentina Ríos"></div>' +
        '<div class="field"><label for="co-ciudad">Ciudad</label><input type="text" id="co-ciudad" placeholder="Ej.: Cartagena"></div>' +
        '</div>' +
        '<div class="field"><label for="co-contacto">Correo o WhatsApp</label><input type="text" id="co-contacto" placeholder="Para coordinar la entrega (simulado)"></div>',
      actions: [
        { label: 'Seguir comprando', cls: 'btn-outline' },
        {
          label: 'Confirmar pedido', cls: 'btn-gold', onClick: function (close, root) {
            var nombre = $('#co-nombre', root).value.trim();
            var ciudad = $('#co-ciudad', root).value.trim() || 'Mompox';
            if (nombre.length < 3) {
              $('#co-nombre', root).focus();
              toast('Escribe tu nombre para registrar el pedido.', 'error');
              return false;
            }
            var ids = registrarCompra(items, nombre, ciudad);
            close();
            exitoCompra(ids, nombre);
          }
        }
      ]
    });
  }

  function proximoNumeroPedido(st) {
    var max = 0;
    st.pedidos.forEach(function (p) {
      var m = /(\d+)$/.exec(p.id);
      if (m) max = Math.max(max, Number(m[1]));
    });
    return max + 1;
  }

  function registrarCompra(items, cliente, ciudad) {
    var ids = [];
    window.CA_Store.actualizar(function (st) {
      var n = proximoNumeroPedido(st);
      items.forEach(function (it) {
        var prod = null, art = null;
        st.productos.forEach(function (p) { if (p.id === it.id) prod = p; });
        if (!prod) return;
        st.artesanas.forEach(function (a) { if (a.id === prod.artesanaId) art = a; });
        var id = 'P-2026-' + pad(n++, 3);
        ids.push(id);
        st.pedidos.push({
          id: id, cliente: cliente, productoId: prod.id, artesanaId: prod.artesanaId,
          fecha: hoyISO(), qty: it.qty, valor: prod.precio * it.qty,
          estado: 'Pendiente', canal: 'Vitrina digital', ciudad: ciudad
        });
        prod.stock = Math.max(0, prod.stock - it.qty);
        prod.disponible = prod.stock > 0;
        prod.unidadesVendidas += it.qty;
        prod.ventasTotal += prod.precio * it.qty;
        if (art) { art.ventas += prod.precio * it.qty; art.pedidos += 1; }
      });
    });
    carritoGuardar([]);
    return ids;
  }

  function exitoCompra(ids, nombre) {
    var s = sesion();
    var dest = s && s.rol === 'admin' ? 'dashboard.html' : 'catalogo.html';
    modal({
      title: '¡Compra registrada!',
      html:
        '<div style="text-align:center;padding:6px 0 4px">' +
        '<div class="empty-icon" style="background:var(--green-100);color:var(--green-600)">' + icon('check') + '</div>' +
        '<h3 style="margin-bottom:6px">Gracias, ' + esc(nombre) + '</h3>' +
        '<p>Tu pedido quedó registrado en la vitrina colectiva con los números:</p>' +
        '<p style="font-weight:800;color:var(--navy-800);font-size:1.05rem">' + ids.map(esc).join(' · ') + '</p>' +
        '<p class="small">En una cooperativa real, el pedido llegaría a la artesana, se coordinaría el pago y el envío. <strong>Aquí todo es simulado.</strong></p>' +
        '</div>',
      actions: [
        { label: 'Seguir explorando', cls: 'btn-outline' },
        { label: s && s.rol === 'admin' ? 'Ver en el panel' : 'Volver al catálogo', cls: 'btn-primary', onClick: function () { window.location.href = dest; } }
      ]
    });
    toast('Se registraron ' + ids.length + ' pedido(s) directos a las artesanas.', 'success', 'Compra simulada con éxito');
  }

  /* ---------------- Tarjeta de producto (reutilizable) ---------------- */
  function cardProducto(p) {
    var a = artesana(p.artesanaId);
    var agotado = !p.disponible || p.stock <= 0;
    return '<article class="product-card">' +
      '<a class="pc-media" href="producto.html?id=' + p.id + '">' +
      '<img src="' + imgSrc(p.imagen) + '" alt="' + esc(p.nombre) + '" loading="lazy">' +
      '<span class="pc-badges">' + categoriaBadge(p.categoria) + (agotado ? '<span class="badge badge-agotado">Agotado</span>' : '') + '</span>' +
      '</a>' +
      '<div class="pc-body">' +
      '<span class="tag-direct">' + icon('leaf') + ' Compra directa a la artesana</span>' +
      '<h3 class="pc-name"><a href="producto.html?id=' + p.id + '">' + esc(p.nombre) + '</a></h3>' +
      '<span class="pc-artisan"><img class="avatar" src="' + avatarURI(a ? a.nombre : '') + '" alt=""> Elaborado por ' + esc(nombreCorto(a)) + '</span>' +
      '<span class="pc-price">' + fmtCOP(p.precio) + '<small>COP</small></span>' +
      '<div class="pc-foot">' +
      '<a class="btn btn-outline" href="producto.html?id=' + p.id + '">' + icon('eye') + ' Ver</a>' +
      '<button type="button" class="btn btn-primary" data-add="' + p.id + '"' + (agotado ? ' disabled' : '') + '>' + icon('cart') + (agotado ? ' Agotado' : ' Agregar') + '</button>' +
      '</div></div></article>';
  }

  /* ---------------- Gráficos ---------------- */
  function barChart(container, data, opts) {
    if (!container) return;
    opts = opts || {};
    var max = Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1]));
    container.innerHTML = data.map(function (d) {
      var pct = Math.max(2, Math.round(d.value / max * 100));
      return '<div class="bc-col" title="' + esc(d.label + ': ' + fmtCOP(d.value)) + '">' +
        '<div class="bc-value">' + esc(opts.compact === false ? fmtCOP(d.value) : fmtCorto(d.value)) + '</div>' +
        '<div class="bc-bar"><i data-h="' + pct + '"></i></div>' +
        '<div class="bc-label">' + esc(d.label) + '</div></div>';
    }).join('');
    animarBarras(container);
  }

  function hbarChart(container, data, opts) {
    if (!container) return;
    opts = opts || {};
    var max = Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1]));
    container.innerHTML = data.map(function (d) {
      var pct = Math.max(3, Math.round(d.value / max * 100));
      var color = d.color || opts.color || 'var(--gold-500)';
      return '<div class="hbar-row">' +
        '<div class="hb-head"><strong>' + esc(d.label) + '</strong><span>' + esc(d.extra || fmtCOP(d.value)) + '</span></div>' +
        '<div class="hbar-track"><i data-w="' + pct + '" style="background:' + esc(color) + '"></i></div></div>';
    }).join('');
    animarBarras(container);
  }

  function animarBarras(root) {
    setTimeout(function () {
      $$('[data-h]', root).forEach(function (i) { i.style.height = i.getAttribute('data-h') + '%'; });
      $$('[data-w]', root).forEach(function (i) { i.style.width = i.getAttribute('data-w') + '%'; });
    }, 120);
  }

  /* ---------------- Animaciones ---------------- */
  function initCountUp() {
    var els = $$('.count-up');
    if (!els.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        var el = en.target;
        var target = Number(el.getAttribute('data-value') || 0);
        var money = el.hasAttribute('data-money');
        var inicio = performance.now();
        var dur = 1400;
        function paso(t) {
          var p = Math.min(1, (t - inicio) / dur);
          var ease = 1 - Math.pow(1 - p, 3);
          var v = Math.round(target * ease);
          el.textContent = money ? fmtCOP(v) : fmtNum(v);
          if (p < 1) requestAnimationFrame(paso);
        }
        requestAnimationFrame(paso);
      });
    }, { threshold: .3 });
    els.forEach(function (el) { obs.observe(el); });
  }

  function initReveal() {
    var els = $$('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); }
      });
    }, { threshold: .12 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ---------------- Navbar y pie ---------------- */
  var NAV_LINKS = [
    { href: 'index.html', label: 'Inicio' },
    { href: 'catalogo.html', label: 'Catálogo' },
    { href: 'artesanas.html', label: 'Artesanas' },
    { href: 'cooperativa.html', label: 'Cooperativa' },
    { href: 'impacto.html', label: 'Impacto' }
  ];

  function montarNavbar(active) {
    var host = $('#site-nav');
    if (!host) return;
    var s = sesion();
    var links = NAV_LINKS.map(function (l) {
      return '<a href="' + l.href + '" class="' + (active === l.href ? 'active' : '') + '">' + l.label + '</a>';
    }).join('');
    var acceso;
    if (s) {
      var destino = s.rol === 'admin' ? 'dashboard.html' : 'perfil-artesana.html';
      var nombre = s.rol === 'admin' ? 'Panel' : nombreCorto({ nombre: s.nombre });
      acceso = '<a class="nav-user" href="' + destino + '"><img class="avatar avatar-sm" src="' + avatarURI(s.nombre) + '" alt="">' + esc(nombre) + '</a>';
    } else {
      acceso = '<a class="btn btn-primary btn-sm" href="login.html">' + icon('login') + ' Ingresar</a>';
    }
    host.classList.add('site-nav');
    host.innerHTML =
      '<div class="container nav-inner">' +
      '<a class="nav-brand" href="index.html"><img src="assets/images/logo.svg" alt="Corazón Artesano">' +
      '<span class="brand-text"><span class="brand-name">Corazón Artesano</span><span class="brand-sub">Mompox · Cooperativa</span></span></a>' +
      '<nav class="nav-links" aria-label="Navegación principal">' + links + '</nav>' +
      '<div class="nav-actions">' +
      '<button type="button" class="nav-cart" data-cart-open aria-label="Abrir carrito de compras">' + icon('cart') +
      '<span class="cart-count" style="display:none">0</span></button>' +
      acceso +
      '<button type="button" class="nav-toggle" aria-label="Abrir menú">' + icon('menu') + '</button>' +
      '</div></div>' +
      '<div class="container"><nav class="nav-mobile" aria-label="Menú móvil">' + links +
      (s ? '' : '<a href="login.html">' + icon('login') + ' Ingresar</a>') + '</nav></div>';

    var toggle = $('.nav-toggle', host);
    var mobile = $('.nav-mobile', host);
    toggle.addEventListener('click', function () {
      mobile.classList.toggle('open');
    });
    window.addEventListener('scroll', function () {
      host.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
    host.classList.toggle('scrolled', window.scrollY > 8);
    actualizarContadorCarrito();
  }

  function montarFooter() {
    var host = $('#site-footer');
    if (!host) return;
    var s = sesion();
    host.classList.add('site-footer');
    host.innerHTML =
      '<div class="container"><div class="footer-grid">' +
      '<div><div class="footer-brand"><img src="assets/images/logo.svg" alt="">' +
      '<span class="brand-name">Corazón Artesano</span></div>' +
      '<p>Vitrina colectiva de 75 mujeres artesanas de Santa Cruz de Mompox, Bolívar. Comercio justo, trabajo colectivo y saberes que se conservan.</p></div>' +
      '<div><h4>Explora</h4><ul>' +
      '<li><a href="catalogo.html">Catálogo colectivo</a></li>' +
      '<li><a href="catalogo.html?cat=palma">Palma de iraca</a></li>' +
      '<li><a href="catalogo.html?cat=filigrana">Filigrana</a></li>' +
      '<li><a href="artesanas.html">Las 75 artesanas</a></li></ul></div>' +
      '<div><h4>Cooperativa</h4><ul>' +
      '<li><a href="cooperativa.html">Nuestra organización</a></li>' +
      '<li><a href="cooperativa.html#votacion">Participa y vota</a></li>' +
      '<li><a href="impacto.html">Impacto social</a></li>' +
      '<li><a href="impacto.html#antes-despues">Antes y después</a></li></ul></div>' +
      '<div><h4>Acceso</h4><ul>' +
      '<li><a href="login.html">Ingresar</a></li>' +
      '<li><a href="' + (s && s.rol === 'artesana' ? 'perfil-artesana.html' : 'login.html') + '">Soy artesana</a></li>' +
      '<li><a href="login.html">Panel de administración</a></li></ul></div>' +
      '</div><div class="footer-bottom">' +
      '<span>© 2026 Cooperativa Multiactiva Corazón Artesano · Santa Cruz de Mompox, Bolívar, Colombia</span>' +
      '<span class="footer-note">' + icon('info') + ' Prototipo académico: datos y pagos simulados</span>' +
      '</div></div>';
  }

  /* ---------------- Inicialización ---------------- */
  function init() {
    montarCarrito();
    toastRoot();
    var page = document.body ? document.body.getAttribute('data-nav') : null;
    if (page) montarNavbar(page);
    if ($('#site-footer')) montarFooter();
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cart-open]');
      if (t) { e.preventDefault(); abrirCarrito(); }
      var b = e.target.closest('[data-add]');
      if (b && !b.disabled) { e.preventDefault(); carritoAdd(b.getAttribute('data-add'), 1); }
    });
    actualizarContadorCarrito();
    initReveal();
    initCountUp();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  return {
    $: $, $$: $$, esc: esc, pad: pad,
    fmtCOP: fmtCOP, fmtCorto: fmtCorto, fmtNum: fmtNum, fmtFecha: fmtFecha, hoyISO: hoyISO,
    catInfo: catInfo, imgSrc: imgSrc, icon: icon, avatarURI: avatarURI,
    estadoBadge: estadoBadge, categoriaBadge: categoriaBadge,
    sesion: sesion, iniciarSesion: iniciarSesion, cerrarSesion: cerrarSesion,
    producto: producto, artesana: artesana, pedido: pedido, nombreCorto: nombreCorto,
    toast: toast, modal: modal, confirmar: confirmar,
    carritoAdd: carritoAdd, carritoItems: carritoItems, carritoCount: carritoCount, carritoTotal: carritoTotal,
    carritoSetQty: carritoSetQty, carritoRemove: carritoRemove, abrirCarrito: abrirCarrito,
    actualizarContadorCarrito: actualizarContadorCarrito,
    cardProducto: cardProducto,
    barChart: barChart, hbarChart: hbarChart, animarBarras: animarBarras
  };
})();
