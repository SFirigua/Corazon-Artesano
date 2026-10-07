/* ============================================================
   CORAZÓN ARTESANO — Landing pública
   Actualiza las cifras en vivo según el estado del prototipo.
   ============================================================ */

(function () {
  'use strict';

  var st = window.CA_Store.get();

  /* Conteo de productos por categoría */
  window.CA.$$('[data-cat-count]').forEach(function (el) {
    var cat = el.getAttribute('data-cat-count');
    var n = st.productos.filter(function (p) { return p.categoria === cat; }).length;
    el.textContent = n + ' productos publicados';
  });

  /* Métricas del impacto (se actualizan si la demo cambia los datos) */
  var totalVentas = st.pedidos.reduce(function (s, p) { return s + p.valor; }, 0);
  function setMetrica(id, valor) {
    var el = document.getElementById(id);
    if (el) el.setAttribute('data-value', valor);
  }
  setMetrica('metric-artesanas', st.artesanas.length);
  setMetrica('metric-productos', st.productos.length);
  setMetrica('metric-pedidos', st.pedidos.length);
  setMetrica('metric-ventas', totalVentas);
  setMetrica('metric-familias', Math.round(st.artesanas.length * 3.2));
})();
