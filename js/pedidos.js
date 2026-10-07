/* ============================================================
   CORAZÓN ARTESANO — Pedidos y ventas
   Tabla con filtros, detalle del pedido y cambio de estado.
   ============================================================ */

(function () {
  'use strict';

  var CA = window.CA;
  if (!window.CA_Admin.shell('pedidos.html')) return;

  var ESTADOS = CA_DATA.ESTADOS_PEDIDO;
  var estado = { q: '', est: 'todos', mes: 'todos', visibles: 12 };
  var contenedor = document.getElementById('tabla-pedidos');

  var st0 = window.CA_Store.get();
  var meses = {};
  st0.pedidos.forEach(function (p) { meses[p.fecha.slice(0, 7)] = true; });
  var selMes = document.getElementById('filtro-mes');
  Object.keys(meses).sort().forEach(function (clave) {
    var opt = document.createElement('option');
    opt.value = clave;
    opt.textContent = CA.fmtFecha(clave + '-01').replace(' 01 ', ' de ') + ' 2026';
    selMes.appendChild(opt);
  });

  function productoDe(p) {
    var pr = null;
    st0.productos.forEach(function (x) { if (x.id === p.productoId) pr = x; });
    return pr;
  }

  function filtrar() {
    var q = estado.q.toLowerCase();
    return st0.pedidos.filter(function (p) {
      if (estado.est !== 'todos' && p.estado !== estado.est) return false;
      if (estado.mes !== 'todos' && p.fecha.slice(0, 7) !== estado.mes) return false;
      if (!q) return true;
      var prod = productoDe(p);
      var a = CA.artesana(p.artesanaId);
      var texto = (p.id + ' ' + p.cliente + ' ' + (prod ? prod.nombre : '') + ' ' + (a ? a.nombre : '')).toLowerCase();
      return texto.indexOf(q) >= 0;
    }).sort(function (a, b) {
      if (a.fecha === b.fecha) return a.id < b.id ? 1 : -1;
      return a.fecha < b.fecha ? 1 : -1;
    });
  }

  function render() {
    st0 = window.CA_Store.get();
    var totalVentas = st0.pedidos.reduce(function (s, p) { return s + p.valor; }, 0);
    var pendientes = st0.pedidos.filter(function (p) { return p.estado === 'Pendiente'; }).length;
    document.getElementById('resumen-ventas').innerHTML =
      '<span class="summary-chip">Ventas: <strong>' + CA.fmtCOP(totalVentas) + '</strong></span>' +
      '<span class="summary-chip">Ticket promedio: <strong>' + CA.fmtCOP(totalVentas / Math.max(1, st0.pedidos.length)) + '</strong></span>' +
      '<span class="summary-chip">Pendientes: <strong>' + pendientes + '</strong></span>';

    document.getElementById('resumen-estados').innerHTML = ESTADOS.map(function (e) {
      var n = st0.pedidos.filter(function (p) { return p.estado === e; }).length;
      return '<button type="button" class="summary-chip" data-est-chip="' + e + '" style="cursor:pointer">' + CA.estadoBadge(e) + '<strong>' + n + '</strong></button>';
    }).join('');
    CA.$$('[data-est-chip]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        estado.est = chip.getAttribute('data-est-chip');
        document.getElementById('filtro-estado').value = estado.est;
        estado.visibles = 12;
        render();
      });
    });

    var lista = filtrar();
    var visibles = lista.slice(0, estado.visibles);

    if (!lista.length) {
      contenedor.innerHTML =
        '<div class="empty"><div class="empty-icon">' + CA.icon('package') + '</div>' +
        '<h3>No hay pedidos con estos filtros</h3>' +
        '<p>Prueba con otro estado o limpia los filtros de búsqueda.</p></div>';
      document.getElementById('mas').style.display = 'none';
      return;
    }

    contenedor.innerHTML =
      '<div class="table-wrap"><table class="data-table responsive-cards">' +
      '<thead><tr><th>Pedido</th><th>Cliente</th><th>Producto</th><th>Artesana</th><th>Fecha</th><th>Valor</th><th>Estado</th><th></th></tr></thead>' +
      '<tbody>' + visibles.map(function (p) {
        var prod = productoDe(p);
        var a = CA.artesana(p.artesanaId);
        return '<tr>' +
          '<td class="cell-strong" data-label="Pedido">' + p.id + '</td>' +
          '<td data-label="Cliente">' + CA.esc(p.cliente) + '<span class="table-sub">' + CA.esc(p.ciudad) + ' · ' + CA.esc(p.canal) + '</span></td>' +
          '<td data-label="Producto">' + CA.esc(prod ? prod.nombre : 'Producto retirado') + (p.qty > 1 ? ' <span class="badge badge-neutral">×' + p.qty + '</span>' : '') + '</td>' +
          '<td data-label="Artesana">' + CA.esc(a ? a.nombre : '—') + '</td>' +
          '<td data-label="Fecha">' + CA.fmtFecha(p.fecha) + '</td>' +
          '<td class="cell-money" data-label="Valor">' + CA.fmtCOP(p.valor) + '</td>' +
          '<td data-label="Estado"><select data-estado="' + p.id + '" aria-label="Cambiar estado del pedido ' + p.id + '" style="padding:7px 30px 7px 10px;font-size:.82rem;font-weight:700;border-radius:999px">' +
          ESTADOS.map(function (e) { return '<option' + (e === p.estado ? ' selected' : '') + '>' + e + '</option>'; }).join('') +
          '</select></td>' +
          '<td class="cell-actions" data-label="Detalle"><button type="button" class="btn btn-outline btn-xs" data-ver="' + p.id + '" title="Ver detalle">' + CA.icon('eye') + '</button></td>' +
          '</tr>';
      }).join('') + '</tbody></table></div>';

    document.getElementById('mas').style.display = lista.length > estado.visibles ? 'inline-flex' : 'none';
    document.getElementById('mas').textContent = 'Cargar más pedidos (' + (lista.length - estado.visibles) + ' restantes)';

    CA.$$('[data-estado]', contenedor).forEach(function (sel) {
      sel.addEventListener('change', function () {
        var id = sel.getAttribute('data-estado');
        window.CA_Store.actualizar(function (st) {
          st.pedidos.forEach(function (x) { if (x.id === id) x.estado = sel.value; });
        });
        CA.toast('Pedido ' + id + ' marcado como “' + sel.value + '”.', 'success', 'Estado actualizado');
        render();
      });
    });
    CA.$$('[data-ver]', contenedor).forEach(function (b) {
      b.addEventListener('click', function () { verDetalle(b.getAttribute('data-ver')); });
    });
  }

  function verDetalle(id) {
    var p = CA.pedido(id);
    if (!p) return;
    var prod = productoDe(p);
    var a = CA.artesana(p.artesanaId);
    CA.modal({
      title: 'Pedido ' + p.id,
      html:
        '<div style="display:flex;gap:14px;align-items:center;margin-bottom:16px">' +
        (prod ? '<img src="' + CA.imgSrc(prod.imagen) + '" alt="" style="width:74px;height:74px;border-radius:14px;object-fit:cover;background:var(--sand)">' : '') +
        '<div><strong style="color:var(--navy-800);font-size:1.05rem">' + CA.esc(prod ? prod.nombre : 'Producto retirado') + '</strong>' +
        '<div class="muted small">' + (p.qty > 1 ? p.qty + ' unidades · ' : '') + CA.fmtCOP(p.valor) + (prod && p.qty > 1 ? ' (' + CA.fmtCOP(prod.precio) + ' c/u)' : '') + '</div></div>' +
        '</div>' +
        '<div class="impact-row"><span class="ir-label">Cliente</span><span class="ir-value">' + CA.esc(p.cliente) + '<span class="table-sub" style="text-align:right">' + CA.esc(p.ciudad) + '</span></span></div>' +
        '<div class="impact-row"><span class="ir-label">Artesana</span><span class="ir-value">' + CA.esc(a ? a.nombre : '—') + '</span></div>' +
        '<div class="impact-row"><span class="ir-label">Fecha</span><span class="ir-value">' + CA.fmtFecha(p.fecha) + '</span></div>' +
        '<div class="impact-row"><span class="ir-label">Canal de venta</span><span class="ir-value">' + CA.esc(p.canal) + '</span></div>' +
        '<div class="impact-row"><span class="ir-label">Estado actual</span><span class="ir-value">' + CA.estadoBadge(p.estado) + '</span></div>' +
        '<div class="field mt-16" style="margin-bottom:0"><label for="det-estado">Actualizar estado</label>' +
        '<select id="det-estado">' + ESTADOS.map(function (e) { return '<option' + (e === p.estado ? ' selected' : '') + '>' + e + '</option>'; }).join('') + '</select></div>',
      actions: [
        { label: 'Cerrar', cls: 'btn-outline' },
        {
          label: 'Guardar estado', cls: 'btn-primary', onClick: function (close, root) {
            var nuevo = root.querySelector('#det-estado').value;
            window.CA_Store.actualizar(function (st) {
              st.pedidos.forEach(function (x) { if (x.id === p.id) x.estado = nuevo; });
            });
            CA.toast('Pedido ' + p.id + ' actualizado a “' + nuevo + '”.', 'success');
            render();
          }
        }
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
  selMes.addEventListener('change', function (e) { estado.mes = e.target.value; estado.visibles = 12; render(); });
  document.getElementById('mas').addEventListener('click', function () { estado.visibles += 12; render(); });
  document.getElementById('limpiar').addEventListener('click', function () {
    estado = { q: '', est: 'todos', mes: 'todos', visibles: 12 };
    document.getElementById('buscar').value = '';
    document.getElementById('filtro-estado').value = 'todos';
    selMes.value = 'todos';
    render();
  });

  render();
})();
