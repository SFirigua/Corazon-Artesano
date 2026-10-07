/* ============================================================
   CORAZÓN ARTESANO — Catálogo / tienda digital
   Búsqueda, filtros por categoría, orden y paginación "cargar más".
   ============================================================ */

(function () {
  'use strict';

  var CA = window.CA;
  var PAGINA = 12;

  var estado = { q: '', cat: 'todas', orden: 'relevancia', visibles: PAGINA };

  var st = window.CA_Store.get();
  document.getElementById('ph-productos').textContent = st.productos.length;
  document.getElementById('ph-artesanas').textContent = st.artesanas.length;

  function nombreArtesana(p) {
    var a = CA.artesana(p.artesanaId);
    return a ? a.nombre : '';
  }

  function filtrar() {
    st = window.CA_Store.get();
    var q = estado.q.toLowerCase();
    var lista = st.productos.filter(function (p) {
      if (estado.cat !== 'todas' && p.categoria !== estado.cat) return false;
      if (!q) return true;
      var texto = (p.nombre + ' ' + p.materiales + ' ' + p.descripcion + ' ' + nombreArtesana(p) + ' ' + CA.catInfo(p.categoria).nombre).toLowerCase();
      return texto.indexOf(q) >= 0;
    });
    switch (estado.orden) {
      case 'precio-asc':
        lista.sort(function (a, b) { return a.precio - b.precio; });
        break;
      case 'precio-desc':
        lista.sort(function (a, b) { return b.precio - a.precio; });
        break;
      case 'recientes':
        lista.sort(function (a, b) { return a.fechaPublicacion < b.fechaPublicacion ? 1 : -1; });
        break;
      case 'vendidos':
        lista.sort(function (a, b) { return b.unidadesVendidas - a.unidadesVendidas; });
        break;
      default:
        lista.sort(function (a, b) {
          if (a.destacado !== b.destacado) return a.destacado ? -1 : 1;
          return a.seq - b.seq;
        });
    }
    return lista;
  }

  function render() {
    var lista = filtrar();
    var visibles = lista.slice(0, estado.visibles);
    var grid = document.getElementById('grid');
    var vacio = document.getElementById('vacio');
    var masWrap = document.getElementById('mas-wrap');
    var contador = document.getElementById('contador');

    grid.innerHTML = visibles.map(CA.cardProducto).join('');
    contador.textContent = lista.length === 0
      ? 'Sin resultados para tu búsqueda'
      : 'Mostrando ' + visibles.length + ' de ' + lista.length + ' producto(s)';

    vacio.innerHTML = lista.length === 0
      ? '<div class="empty"><div class="empty-icon">' + CA.icon('search') + '</div>' +
        '<h3>No encontramos productos</h3>' +
        '<p>Prueba con otra palabra o cambia la categoría. También puedes limpiar los filtros.</p>' +
        '<button type="button" class="btn btn-primary" id="vaciar-filtros">Limpiar filtros</button></div>'
      : '';
    if (lista.length === 0) {
      document.getElementById('vaciar-filtros').addEventListener('click', limpiar);
    }
    masWrap.style.display = lista.length > estado.visibles ? 'block' : 'none';
  }

  function limpiar() {
    estado.q = '';
    estado.cat = 'todas';
    estado.orden = 'relevancia';
    estado.visibles = PAGINA;
    document.getElementById('buscar').value = '';
    document.getElementById('ordenar').value = 'relevancia';
    CA.$$('#chips .chip').forEach(function (c) { c.classList.toggle('active', c.getAttribute('data-cat') === 'todas'); });
    render();
  }

  var temporizador = null;
  document.getElementById('buscar').addEventListener('input', function (e) {
    clearTimeout(temporizador);
    var v = e.target.value;
    temporizador = setTimeout(function () {
      estado.q = v;
      estado.visibles = PAGINA;
      render();
    }, 180);
  });

  document.getElementById('ordenar').addEventListener('change', function (e) {
    estado.orden = e.target.value;
    estado.visibles = PAGINA;
    render();
  });

  document.getElementById('chips').addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    estado.cat = chip.getAttribute('data-cat');
    estado.visibles = PAGINA;
    CA.$$('#chips .chip').forEach(function (c) { c.classList.toggle('active', c === chip); });
    render();
  });

  document.getElementById('mas').addEventListener('click', function () {
    estado.visibles += PAGINA;
    render();
  });

  document.getElementById('limpiar').addEventListener('click', function () {
    limpiar();
    CA.toast('Filtros restablecidos.', 'info');
  });

  /* Categoría preseleccionada por URL (?cat=filigrana) */
  var params = new URLSearchParams(window.location.search);
  var cat = params.get('cat');
  if (cat && CA.catInfo(cat).id === cat) {
    estado.cat = cat;
    CA.$$('#chips .chip').forEach(function (c) {
      c.classList.toggle('active', c.getAttribute('data-cat') === cat);
    });
  }

  render();
})();
