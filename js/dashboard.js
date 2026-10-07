/* ============================================================
   CORAZÓN ARTESANO — Dashboard administrativo
   KPIs, gráficos de ventas y paneles resumen, calculados en
   vivo desde el estado del prototipo.
   ============================================================ */

(function () {
  'use strict';

  var CA = window.CA;
  if (!window.CA_Admin.shell('dashboard.html')) return;

  var st = window.CA_Store.get();
  var MESES = CA_DATA.MESES;
  var MESES_CORTOS = CA_DATA.MESES_CORTOS;

  /* ---------- Cálculos base ---------- */
  var porMes = {};
  st.pedidos.forEach(function (p) {
    var clave = p.fecha.slice(0, 7);
    if (!porMes[clave]) porMes[clave] = { valor: 0, pedidos: 0, artesanas: {} };
    porMes[clave].valor += p.valor;
    porMes[clave].pedidos += 1;
    porMes[clave].artesanas[p.artesanaId] = true;
  });

  var claves = Object.keys(porMes).sort();
  var mesActual = claves[claves.length - 1];
  var mesAnterior = claves[claves.length - 2];
  var actual = porMes[mesActual];
  var anterior = mesAnterior ? porMes[mesAnterior] : null;

  var totalVentas = st.pedidos.reduce(function (s, p) { return s + p.valor; }, 0);
  var artesanasMes = Object.keys(actual.artesanas).length;

  function nombreMes(clave) {
    var partes = clave.split('-');
    return MESES[Number(partes[1]) - 1];
  }
  function etiquetaMes(clave) {
    var partes = clave.split('-');
    return MESES_CORTOS[Number(partes[1]) - 1];
  }

  /* ---------- KPIs ---------- */
  document.getElementById('kpi-artesanas').textContent = CA.fmtNum(st.artesanas.length);
  document.getElementById('kpi-artesanas-trend').textContent = st.artesanas.filter(function (a) { return a.estado === 'Nueva'; }).length + ' se vincularon este año';

  document.getElementById('kpi-productos').textContent = CA.fmtNum(st.productos.length);
  document.getElementById('kpi-productos-trend').textContent = st.productos.filter(function (p) { return !p.disponible; }).length + ' agotados · 5 categorías';

  document.getElementById('kpi-pedidos').textContent = CA.fmtNum(st.pedidos.length);
  document.getElementById('kpi-pedidos-trend').textContent = actual.pedidos + ' en ' + nombreMes(mesActual).toLowerCase();

  document.getElementById('kpi-ventas').textContent = CA.fmtCOP(totalVentas);
  (function () {
    var el = document.getElementById('kpi-ventas-trend');
    if (anterior && anterior.valor > 0) {
      var pct = Math.round((actual.valor - anterior.valor) / anterior.valor * 100);
      el.textContent = (pct >= 0 ? '▲ +' : '▼ ') + pct + ' % vs ' + nombreMes(mesAnterior).toLowerCase();
      el.className = 'kpi-trend ' + (pct >= 0 ? 'up' : 'flat');
    } else {
      el.textContent = 'Primer periodo de operación';
    }
  })();

  document.getElementById('kpi-vendidos-mes').textContent = CA.fmtNum(actual.pedidos);
  (function () {
    var el = document.getElementById('kpi-vendidos-trend');
    if (anterior) {
      var dif = actual.pedidos - anterior.pedidos;
      el.textContent = (dif >= 0 ? '▲ +' : '▼ ') + dif + ' pedidos vs ' + nombreMes(mesAnterior).toLowerCase();
    } else {
      el.textContent = nombreMes(mesActual) + ' 2026';
    }
  })();

  document.getElementById('kpi-artesanas-mes').textContent = CA.fmtNum(artesanasMes);
  document.getElementById('kpi-artesanas-mes-trend').textContent = 'de ' + st.artesanas.length + ' socias activas';

  /* ---------- Gráfico: ventas por mes (rango continuo) ---------- */
  var serie = [];
  if (claves.length) {
    var ini = claves[0].split('-');
    var fin = claves[claves.length - 1].split('-');
    var cursor = new Date(Number(ini[0]), Number(ini[1]) - 1, 1);
    var hasta = new Date(Number(fin[0]), Number(fin[1]) - 1, 1);
    while (cursor <= hasta) {
      var clave = cursor.getFullYear() + '-' + CA.pad(cursor.getMonth() + 1, 2);
      serie.push({ label: etiquetaMes(clave), value: porMes[clave] ? porMes[clave].valor : 0 });
      cursor.setMonth(cursor.getMonth() + 1);
    }
  }
  CA.barChart(document.getElementById('chart-meses'), serie);
  document.getElementById('chart-mes-total').textContent = CA.fmtCOP(actual.valor);
  document.getElementById('chart-mes-label').textContent = nombreMes(mesActual) + ' 2026 · ventas del mes';

  /* ---------- Gráfico: ventas por categoría ---------- */
  var totalCategoria = {};
  st.pedidos.forEach(function (p) {
    var prod = null;
    st.productos.forEach(function (x) { if (x.id === p.productoId) prod = x; });
    if (!prod) return;
    totalCategoria[prod.categoria] = (totalCategoria[prod.categoria] || 0) + p.valor;
  });
  var datosCat = CA_DATA.CATEGORIAS.map(function (c) {
    return { label: c.nombre, value: totalCategoria[c.id] || 0, color: c.color, extra: CA.fmtCOP(totalCategoria[c.id] || 0) };
  }).sort(function (a, b) { return b.value - a.value; });
  CA.hbarChart(document.getElementById('chart-categorias'), datosCat);

  /* ---------- Últimos pedidos ---------- */
  var ultimos = st.pedidos.slice().sort(function (a, b) {
    if (a.fecha === b.fecha) return a.id < b.id ? 1 : -1;
    return a.fecha < b.fecha ? 1 : -1;
  }).slice(0, 5);

  document.getElementById('tabla-ultimos').innerHTML = ultimos.map(function (p) {
    var prod = CA.producto(p.productoId);
    return '<tr>' +
      '<td class="cell-strong" data-label="Pedido">' + p.id + '</td>' +
      '<td data-label="Cliente">' + CA.esc(p.cliente) + '</td>' +
      '<td data-label="Producto">' + CA.esc(prod ? prod.nombre : '—') + (p.qty > 1 ? ' <span class="badge badge-neutral">×' + p.qty + '</span>' : '') + '</td>' +
      '<td class="cell-money" data-label="Valor">' + CA.fmtCOP(p.valor) + '</td>' +
      '<td data-label="Estado">' + CA.estadoBadge(p.estado) + '</td>' +
      '</tr>';
  }).join('');

  /* ---------- Ranking de artesanas ---------- */
  var top = st.artesanas.slice().sort(function (a, b) { return b.ventas - a.ventas; }).slice(0, 5);
  document.getElementById('ranking').innerHTML = top.map(function (a, i) {
    return '<div class="ranking-row">' +
      '<span class="rank-pos">' + (i + 1) + '</span>' +
      '<img class="avatar avatar-sm" src="' + CA.avatarURI(a.nombre) + '" alt="">' +
      '<span class="rank-info"><strong>' + CA.esc(a.nombre) + '</strong><small>' + CA.esc(CA.catInfo(a.especialidad).nombre) + ' · ' + a.productos + ' productos</small></span>' +
      '<span class="rank-value">' + CA.fmtCOP(a.ventas) + '</span>' +
      '</div>';
  }).join('');
})();
