/* ============================================================
   CORAZÓN ARTESANO — Detalle del producto
   Carga la pieza por ?id=, muestra su historia, la sección
   "Conoce a la artesana" y productos relacionados.
   ============================================================ */

(function () {
  'use strict';

  var CA = window.CA;
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  var p = id ? CA.producto(id) : null;

  var detalle = document.getElementById('detalle');

  if (!p) {
    document.getElementById('migas').innerHTML =
      '<a href="index.html">Inicio</a><span class="sep">/</span><a href="catalogo.html">Catálogo</a>' +
      '<span class="sep">/</span><span class="current">Producto no encontrado</span>';
    detalle.innerHTML =
      '<div class="empty" style="margin:40px auto;max-width:620px">' +
      '<div class="empty-icon">' + CA.icon('search') + '</div>' +
      '<h3>No encontramos esta pieza</h3>' +
      '<p>El producto no existe en la vitrina o fue retirado. Vuelve al catálogo para seguir explorando el trabajo de las artesanas.</p>' +
      '<a class="btn btn-primary" href="catalogo.html">Volver al catálogo</a></div>';
    return;
  }

  var art = CA.artesana(p.artesanaId);
  var cat = CA.catInfo(p.categoria);
  var agotado = !p.disponible || p.stock <= 0;

  document.title = p.nombre + ' — Corazón Artesano';
  document.getElementById('migas').innerHTML =
    '<a href="index.html">Inicio</a><span class="sep">/</span>' +
    '<a href="catalogo.html">Catálogo</a><span class="sep">/</span>' +
    '<a href="catalogo.html?cat=' + p.categoria + '">' + CA.esc(cat.nombre) + '</a><span class="sep">/</span>' +
    '<span class="current">' + CA.esc(p.nombre) + '</span>';

  var qtyMax = Math.max(1, Math.min(p.stock || 1, 10));

  detalle.innerHTML =
    '<div class="product-detail">' +
    '<div class="pd-media">' +
    '<img src="' + CA.imgSrc(p.imagen) + '" alt="' + CA.esc(p.nombre) + '">' +
    '<div class="pd-flag">' + CA.categoriaBadge(p.categoria) +
    (agotado ? '<span class="badge badge-agotado">Agotado</span>' : '<span class="badge badge-ok">Disponible</span>') +
    '</div></div>' +
    '<div class="pd-info">' +
    '<span class="tag-direct">' + CA.icon('leaf') + ' Compra directa a la artesana</span>' +
    '<h1>' + CA.esc(p.nombre) + '</h1>' +
    '<p class="muted small">Referencia ' + p.id.toUpperCase() + ' · Publicado el ' + CA.fmtFecha(p.fechaPublicacion) + '</p>' +
    '<div class="pd-price">' + CA.fmtCOP(p.precio) + ' <small>COP · precio justo definido en asamblea</small></div>' +
    '<div class="pd-artisan-row">' +
    '<img class="avatar avatar-md" src="' + CA.avatarURI(art ? art.nombre : '') + '" alt="' + CA.esc(art ? art.nombre : '') + '">' +
    '<div class="pa-info"><small>Elaborado por</small><strong>' + CA.esc(art ? art.nombre : 'Artesana de la cooperativa') + '</strong>' +
    '<span class="muted small">' + CA.esc(cat.nombre) + (art ? ' · ' + art.anios + ' años de oficio' : '') + '</span></div>' +
    '<a class="btn btn-outline btn-sm" href="#seccion-artesana">Conocerla</a>' +
    '</div>' +
    '<p class="pd-desc">' + CA.esc(p.descripcion) + '</p>' +
    '<div class="pd-specs">' +
    '<div class="pd-spec">' + CA.icon('layers') + '<div><small>Materiales</small><strong>' + CA.esc(p.materiales) + '</strong></div></div>' +
    '<div class="pd-spec">' + CA.icon('clock') + '<div><small>Tiempo de elaboración</small><strong>' + CA.esc(p.tiempo) + '</strong></div></div>' +
    '<div class="pd-spec">' + CA.icon('box') + '<div><small>Categoría</small><strong>' + CA.esc(cat.nombre) + '</strong></div></div>' +
    '<div class="pd-spec">' + CA.icon('check') + '<div><small>Disponibilidad</small><strong>' + (agotado ? 'Agotado por ahora' : p.stock + ' unidad(es) disponible(s)') + '</strong></div></div>' +
    '</div>' +
    '<div class="pd-buy">' +
    '<div class="qty" aria-label="Cantidad">' +
    '<button type="button" id="q-menos" aria-label="Menos">−</button><span id="q-valor">1</span><button type="button" id="q-mas" aria-label="Más">+</button>' +
    '</div>' +
    '<button type="button" class="btn btn-gold btn-lg" id="agregar"' + (agotado ? ' disabled' : '') + '>' + CA.icon('cart') + (agotado ? ' Producto agotado' : ' Agregar al carrito') + '</button>' +
    '<button type="button" class="btn btn-outline btn-lg" id="contacto">' + CA.icon('mail') + ' Contactar a la artesana</button>' +
    '</div>' +
    '<div class="pd-perks">' +
    '<span class="pd-perk">' + CA.icon('leaf') + ' El 100 % del valor llega a ' + CA.esc(CA.nombreCorto(art)) + ' y su familia.</span>' +
    '<span class="pd-perk">' + CA.icon('shield') + ' Compra protegida (simulada): el pago se coordina al confirmar el pedido.</span>' +
    '<span class="pd-perk">' + CA.icon('star') + ' Pieza única hecha a mano: puede tener variaciones propias del oficio.</span>' +
    '</div>' +
    '</div></div>';

  if (!agotado) {
    var qValor = document.getElementById('q-valor');
    var q = 1;
    document.getElementById('q-menos').addEventListener('click', function () {
      q = Math.max(1, q - 1); qValor.textContent = q;
    });
    document.getElementById('q-mas').addEventListener('click', function () {
      q = Math.min(qtyMax, q + 1); qValor.textContent = q;
    });
    document.getElementById('agregar').addEventListener('click', function () {
      CA.carritoAdd(p.id, q);
    });
  }
  document.getElementById('contacto').addEventListener('click', function () {
    CA.toast('Mensaje simulado: en la cooperativa real, ' + CA.nombreCorto(art) + ' recibiría tu consulta por correo o WhatsApp.', 'info', 'Contacto con la artesana');
  });

  /* ---------- Conoce a la artesana ---------- */
  if (art) {
    document.getElementById('seccion-artesana').style.display = '';
    document.getElementById('spotlight').innerHTML =
      '<div class="artisan-spotlight">' +
      '<div class="as-photo"><img class="avatar" src="' + CA.avatarURI(art.nombre) + '" alt="Retrato ilustrado de ' + CA.esc(art.nombre) + '">' +
      CA.estadoBadge(art.estado) + '</div>' +
      '<div class="as-body">' +
      '<h3>' + CA.esc(art.nombre) + '</h3>' +
      '<div class="as-meta">' +
      '<span>' + CA.icon('pin') + CA.esc(art.municipio) + '</span>' +
      '<span>' + CA.icon('star') + CA.esc(cat.nombre) + '</span>' +
      '<span>' + CA.icon('clock') + art.anios + ' años de oficio</span>' +
      '</div>' +
      '<p>' + CA.esc(art.bio) + '</p>' +
      '<blockquote>“' + CA.esc(art.bio.split('. ')[0]) + '.”</blockquote>' +
      '<div class="as-stats">' +
      '<div class="as-stat"><strong>' + art.productos + '</strong><span>productos publicados</span></div>' +
      '<div class="as-stat"><strong>' + CA.fmtCOP(art.ventas) + '</strong><span>ventas acumuladas</span></div>' +
      '<div class="as-stat"><strong>' + (art.comite ? CA.esc(art.comite) : 'Socia activa') + '</strong><span>participación</span></div>' +
      '</div>' +
      '<div class="mt-16"><a class="btn btn-outline" href="artesanas.html">' + CA.icon('users') + ' Ver las 75 artesanas</a></div>' +
      '</div></div>';
  }

  /* ---------- Relacionados ---------- */
  var relacionados = CA_Store.get().productos.filter(function (x) {
    return x.categoria === p.categoria && x.id !== p.id;
  }).sort(function (a, b) { return b.unidadesVendidas - a.unidadesVendidas; }).slice(0, 3);

  if (relacionados.length) {
    document.getElementById('seccion-relacionados').style.display = '';
    document.getElementById('rel-titulo').textContent = 'Más ' + cat.nombre.toLowerCase() + ' de la cooperativa';
    document.getElementById('relacionados').innerHTML = relacionados.map(CA.cardProducto).join('');
  }
})();
