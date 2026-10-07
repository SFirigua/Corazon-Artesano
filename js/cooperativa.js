/* ============================================================
   CORAZÓN ARTESANO — Cooperativa
   Organigrama, propuestas, asambleas y votación simulada con
   el principio "una persona, un voto".
   ============================================================ */

(function () {
  'use strict';

  var CA = window.CA;
  var st = window.CA_Store.get();

  /* ---------- Comités y sus integrantes ---------- */
  var comites = [
    { clave: 'junta', nombre: 'Junta de Administración', icon: 'building' },
    { clave: 'comercializacion', nombre: 'Comité de Comercialización', icon: 'store' },
    { clave: 'apoyo', nombre: 'Comité de Apoyo y Bienestar', icon: 'heart' }
  ];
  document.getElementById('comites-nombres').innerHTML = comites.map(function (c) {
    var ids = CA_DATA.COMITES[c.clave];
    var nombres = ids.map(function (id) {
      var a = st.artesanas.filter(function (x) { return x.id === id; })[0];
      return a ? a.nombre : id;
    });
    return '<div class="card" style="padding:18px">' +
      '<h4 style="font-family:var(--font-body);font-size:.92rem;margin-bottom:10px;display:flex;gap:8px;align-items:center">' +
      CA.icon(c.icon) + c.nombre + '</h4>' +
      '<ul style="list-style:none;display:grid;gap:7px;font-size:.85rem;color:var(--ink-soft)">' +
      nombres.map(function (n) { return '<li style="display:flex;gap:8px;align-items:center"><span class="dot dot-ok"></span>' + CA.esc(n) + '</li>'; }).join('') +
      '</ul></div>';
  }).join('');

  var badges = { 'Aprobada': 'badge-ok', 'En votación': 'badge-pendiente', 'En estudio': 'badge-info' };

  /* ---------- Propuestas ---------- */
  document.getElementById('propuestas').innerHTML = st.propuestas.map(function (p) {
    return '<div class="list-row">' +
      '<span class="qa-ico" style="width:44px;height:44px;border-radius:12px;display:grid;place-items:center;flex:0 0 auto;background:var(--gold-100);color:var(--gold-600)">' + CA.icon('vote') + '</span>' +
      '<span class="lr-info"><strong>' + CA.esc(p.titulo) + '</strong><small>' + CA.esc(p.detalle) + ' · ' + CA.esc(p.fecha) + '</small></span>' +
      '<span class="badge ' + (badges[p.estado] || 'badge-neutral') + '">' + CA.esc(p.estado) + '</span>' +
      '</div>';
  }).join('');

  /* ---------- Asambleas ---------- */
  document.getElementById('asambleas').innerHTML = st.asambleas.map(function (a) {
    return '<div class="list-row">' +
      '<span class="qa-ico" style="width:44px;height:44px;border-radius:12px;display:grid;place-items:center;flex:0 0 auto;background:var(--navy-100);color:var(--navy-700)">' + CA.icon('calendar') + '</span>' +
      '<span class="lr-info"><strong>' + CA.esc(a.titulo) + '</strong>' +
      '<small>' + CA.esc(a.fecha) + ' · ' + CA.esc(a.hora) + ' · ' + CA.esc(a.lugar) + '</small>' +
      '<small>' + a.puntos.length + ' puntos en el orden del día</small></span>' +
      '</div>';
  }).join('');

  /* ---------- Votación simulada ---------- */
  var card = document.getElementById('vote-card');

  function renderVoto() {
    st = window.CA_Store.get();
    var voto = window.CA_Store.votoGet();
    var votacion = st.votacion;
    var total = votacion.opciones.reduce(function (s, o) { return s + o.votos; }, 0);

    if (!voto) {
      card.innerHTML =
        '<h3 style="margin-bottom:6px">' + CA.esc(votacion.pregunta) + '</h3>' +
        '<p class="small muted" style="margin-bottom:18px">Vota como lo haría una socia en la asamblea. Solo se permite un voto por persona en este prototipo.</p>' +
        votacion.opciones.map(function (o) {
          return '<label class="vote-option"><input type="radio" name="voto" value="' + o.id + '">' +
            '<span><strong>' + CA.esc(o.nombre) + '</strong><small>' + CA.fmtNum(o.votos) + ' votos registrados hasta ahora</small></span></label>';
        }).join('') +
        '<div class="flex-between mt-16">' +
        '<span class="small muted">Total de votos: ' + CA.fmtNum(total) + '</span>' +
        '<button type="button" class="btn btn-primary" id="btn-votar">' + CA.icon('vote') + ' Emitir mi voto</button>' +
        '</div>';

      document.getElementById('btn-votar').addEventListener('click', function () {
        var sel = document.querySelector('input[name="voto"]:checked');
        if (!sel) {
          CA.toast('Selecciona una categoría antes de emitir tu voto.', 'error');
          return;
        }
        var opcion = sel.value;
        window.CA_Store.actualizar(function (s) {
          s.votacion.opciones.forEach(function (o) { if (o.id === opcion) o.votos += 1; });
        });
        window.CA_Store.votoSet({ opcion: opcion, fecha: CA.hoyISO() });
        st = window.CA_Store.get();
        var elegida = st.votacion.opciones.filter(function (o) { return o.id === opcion; })[0];
        CA.toast('Tu voto por “' + elegida.nombre + '” quedó registrado. Así se decide en la cooperativa: una persona, un voto.', 'success', 'Voto emitido');
        renderVoto();
      });
      return;
    }

    var opcionElegida = st.votacion.opciones.filter(function (o) { return o.id === voto.opcion; })[0];
    var orden = st.votacion.opciones.slice().sort(function (a, b) { return b.votos - a.votos; });
    var max = orden[0].votos;
    var totalActual = st.votacion.opciones.reduce(function (s, o) { return s + o.votos; }, 0);

    card.innerHTML =
      '<div class="flex-between" style="margin-bottom:18px;flex-wrap:wrap;gap:10px">' +
      '<div><h3 style="margin-bottom:4px">' + CA.esc(st.votacion.pregunta) + '</h3>' +
      '<p class="small muted">Resultados en vivo · ' + CA.fmtNum(totalActual) + ' votos contabilizados</p></div>' +
      '<span class="badge badge-ok">' + CA.icon('check') + ' Voto registrado</span>' +
      '</div>' +
      orden.map(function (o) {
        var pct = Math.round(o.votos / totalActual * 100);
        return '<div class="vote-result-row' + (o.votos === max ? ' winner' : '') + '">' +
          '<div class="vr-head"><strong>' + CA.esc(o.nombre) + '</strong><span>' + o.votos + ' votos · ' + pct + ' %</span></div>' +
          '<div class="vote-bar"><i data-w="' + pct + '"></i></div></div>';
      }).join('') +
      '<div class="vote-your">' + CA.icon('user') +
      'Tu voto fue por <strong>' + CA.esc(opcionElegida ? opcionElegida.nombre : '—') + '</strong> el ' + CA.fmtFecha(voto.fecha) + '. ' +
      (orden[0].id === voto.opcion ? '¡Es la opción con más apoyo hasta ahora!' : 'La opción más votada va liderando la decisión colectiva.') +
      '</div>';

    CA.animarBarras(card);
  }

  renderVoto();

  /* Si se llega con #votacion, resaltar */
  if (window.location.hash === '#votacion') {
    setTimeout(function () {
      var seccion = document.getElementById('votacion');
      if (seccion) seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }
})();
