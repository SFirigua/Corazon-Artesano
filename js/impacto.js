/* ============================================================
   CORAZÓN ARTESANO — Impacto social
   Indicadores económicos, sociales y culturales calculados en
   vivo, gráficos y barras comparativas antes/después.
   ============================================================ */

(function () {
  'use strict';

  var CA = window.CA;
  var st = window.CA_Store.get();

  function fila(label, value, valorado) {
    return '<div class="impact-row"><span class="ir-label">' + label + '</span>' +
      '<span class="ir-value">' + (valorado ? CA.fmtCOP(value) : value) + '</span></div>';
  }

  var totalVentas = st.pedidos.reduce(function (s, p) { return s + p.valor; }, 0);
  var ticket = Math.round(totalVentas / Math.max(1, st.pedidos.length));
  var conVentas = st.artesanas.filter(function (a) { return a.ventas > 0; }).length;
  var conProductos = st.artesanas.filter(function (a) { return a.productos > 0; }).length;
  var productosVendidos = st.productos.filter(function (p) { return p.unidadesVendidas > 0; }).length;
  var unidadesVendidas = st.productos.reduce(function (s, p) { return s + p.unidadesVendidas; }, 0);

  /* ---------- Impacto económico ---------- */
  document.getElementById('econ-rows').innerHTML =
    fila('Ventas directas acumuladas', totalVentas, true) +
    fila('Pedidos gestionados desde la vitrina', st.pedidos.length) +
    fila('Ticket promedio por pedido', ticket, true) +
    fila('Incremento de ventas directas <span class="badge badge-ok">proyección</span>', '+38 %') +
    fila('Unidades vendidas', unidadesVendidas);

  /* ---------- Impacto social ---------- */
  document.getElementById('social-rows').innerHTML =
    fila('Mujeres vinculadas a la cooperativa', st.artesanas.length) +
    fila('Familias beneficiadas (3,2 personas por hogar)', Math.round(st.artesanas.length * 3.2)) +
    fila('Participación en decisiones', '100 % · una persona, un voto') +
    fila('Socias en comités de gestión', 17) +
    fila('Nuevas capacidades <span class="badge badge-info">simulado</span>', '6 talleres · 24 horas · 75 participantes');

  /* ---------- Impacto cultural ---------- */
  document.getElementById('cultural-rows').innerHTML =
    fila('Productos tradicionales comercializados', st.productos.length + ' en 5 oficios') +
    fila('Artesanas con perfil publicado', conProductos + ' de ' + st.artesanas.length + ' (100 %)') +
    fila('Historias y saberes documentados', st.artesanas.length + ' de ' + st.artesanas.length + ' (100 %)') +
    fila('Categorías culturales activas', 'Iraca · filigrana · tejidos · bisutería · gastronomía');

  /* ---------- Gráfico de ingresos por mes ---------- */
  var porMes = {};
  st.pedidos.forEach(function (p) {
    var clave = p.fecha.slice(0, 7);
    porMes[clave] = (porMes[clave] || 0) + p.valor;
  });
  var claves = Object.keys(porMes).sort();
  var serie = [];
  if (claves.length) {
    var ini = claves[0].split('-');
    var fin = claves[claves.length - 1].split('-');
    var cursor = new Date(Number(ini[0]), Number(ini[1]) - 1, 1);
    var hasta = new Date(Number(fin[0]), Number(fin[1]) - 1, 1);
    while (cursor <= hasta) {
      var clave = cursor.getFullYear() + '-' + CA.pad(cursor.getMonth() + 1, 2);
      serie.push({ label: CA_DATA.MESES_CORTOS[cursor.getMonth()], value: porMes[clave] || 0 });
      cursor.setMonth(cursor.getMonth() + 1);
    }
  }
  CA.barChart(document.getElementById('chart-ingresos'), serie);
  document.getElementById('imp-total').textContent = CA.fmtCOP(totalVentas);

  /* ---------- Gráfico por categoría ---------- */
  var totalCat = {};
  st.pedidos.forEach(function (p) {
    var prod = null;
    st.productos.forEach(function (x) { if (x.id === p.productoId) prod = x; });
    if (prod) totalCat[prod.categoria] = (totalCat[prod.categoria] || 0) + p.valor;
  });
  CA.hbarChart(document.getElementById('chart-cat'), CA_DATA.CATEGORIAS.map(function (c) {
    return { label: c.nombre, value: totalCat[c.id] || 0, color: c.color, extra: CA.fmtCOP(totalCat[c.id] || 0) };
  }).sort(function (a, b) { return b.value - a.value; }));

  /* ---------- Progreso de participación ---------- */
  function progreso(label, actual, total, extra) {
    var pct = Math.round(actual / total * 100);
    return '<div class="progress-item">' +
      '<div class="pi-head"><span>' + label + '</span><strong>' + extra + '</strong></div>' +
      '<div class="progress"><i data-w="' + pct + '" class="' + (pct === 100 ? '' : 'gold') + '"></i></div></div>';
  }
  document.getElementById('progreso').innerHTML =
    progreso('Socias con productos publicados', conProductos, st.artesanas.length, conProductos + ' de ' + st.artesanas.length + ' · ' + Math.round(conProductos / st.artesanas.length * 100) + ' %') +
    progreso('Socias con ventas registradas', conVentas, st.artesanas.length, conVentas + ' de ' + st.artesanas.length + ' · ' + Math.round(conVentas / st.artesanas.length * 100) + ' %') +
    progreso('Socias en comités de gestión', 17, st.artesanas.length, '17 de ' + st.artesanas.length + ' · 23 %') +
    progreso('Productos del catálogo con ventas', productosVendidos, st.productos.length, productosVendidos + ' de ' + st.productos.length + ' · ' + Math.round(productosVendidos / st.productos.length * 100) + ' %') +
    progreso('Historias de artesanas documentadas', st.artesanas.length, st.artesanas.length, '100 % · todas visibles en la vitrina');
  CA.animarBarras(document.getElementById('progreso'));

  /* ---------- Barras comparativas antes/después ---------- */
  document.querySelectorAll('.compare-track [data-w]').forEach(function (el) {
    setTimeout(function () { el.style.width = el.getAttribute('data-w') + '%'; }, 350);
  });
})();
