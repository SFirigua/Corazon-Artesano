/* ============================================================
   CORAZÓN ARTESANO — Gestión de productos (CRUD simulado)
   Crear, editar, eliminar y cambiar disponibilidad. Todo se
   guarda en localStorage a través de CA_Store.
   ============================================================ */

(function () {
  'use strict';

  var CA = window.CA;
  if (!window.CA_Admin.shell('productos.html')) return;

  var IMAGENES = [
    'prod-bolso-iraca', 'prod-sombrero-iraca', 'prod-canasta-iraca', 'prod-individuales-iraca', 'prod-florero-iraca',
    'prod-pulsera-filigrana', 'prod-collar-filigrana', 'prod-aretes-filigrana',
    'prod-mochila-tejida', 'prod-mantel-tejido', 'prod-cojin-tejido',
    'prod-collar-bisuteria', 'prod-pulsera-bisuteria', 'prod-aretes-bisuteria',
    'prod-caja-dulces', 'prod-bocadillo', 'prod-conserva'
  ];

  var estado = { q: '', cat: 'todas', disp: 'todos', visibles: 12 };
  var contenedor = document.getElementById('tabla-productos');

  /* ---------- Filtro de categorías en toolbar ---------- */
  var selCat = document.getElementById('filtro-cat');
  CA_DATA.CATEGORIAS.forEach(function (c) {
    var opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.nombre;
    selCat.appendChild(opt);
  });

  function recomputarContadores(st) {
    st.artesanas.forEach(function (a) { a.productos = 0; });
    st.productos.forEach(function (p) {
      st.artesanas.forEach(function (a) { if (a.id === p.artesanaId) a.productos += 1; });
    });
  }

  function filtrar() {
    var st = window.CA_Store.get();
    var q = estado.q.toLowerCase();
    return st.productos.filter(function (p) {
      if (estado.cat !== 'todas' && p.categoria !== estado.cat) return false;
      if (estado.disp === 'disponibles' && !p.disponible) return false;
      if (estado.disp === 'agotados' && p.disponible) return false;
      if (!q) return true;
      var a = CA.artesana(p.artesanaId);
      var texto = (p.nombre + ' ' + p.materiales + ' ' + (a ? a.nombre : '')).toLowerCase();
      return texto.indexOf(q) >= 0;
    });
  }

  function render() {
    var st = window.CA_Store.get();
    var lista = filtrar();
    var visibles = lista.slice(0, estado.visibles);

    document.getElementById('resumen').innerHTML =
      '<span class="summary-chip">' + CA.fmtNum(st.productos.length) + ' productos en total</span>' +
      '<span class="summary-chip"><span class="dot dot-ok"></span><strong>' + st.productos.filter(function (p) { return p.disponible; }).length + '</strong> disponibles</span>' +
      '<span class="summary-chip"><span class="dot dot-off"></span><strong>' + st.productos.filter(function (p) { return !p.disponible; }).length + '</strong> agotados</span>' +
      '<span class="summary-chip">Valor del inventario: <strong>' + CA.fmtCOP(st.productos.reduce(function (s, p) { return s + p.precio * p.stock; }, 0)) + '</strong></span>';

    if (!lista.length) {
      contenedor.innerHTML =
        '<div class="empty"><div class="empty-icon">' + CA.icon('box') + '</div>' +
        '<h3>No hay productos con estos filtros</h3>' +
        '<p>Cambia los filtros o registra una nueva pieza en el catálogo colectivo.</p>' +
        '<button type="button" class="btn btn-primary" id="vacio-nuevo">' + CA.icon('plus') + ' Registar producto</button></div>';
      documentoVacioEvento();
      document.getElementById('mas').style.display = 'none';
      return;
    }

    contenedor.innerHTML =
      '<div class="table-wrap"><table class="data-table responsive-cards">' +
      '<thead><tr><th>Producto</th><th>Categoría</th><th>Artesana</th><th>Precio</th><th>Stock</th><th>Disponible</th><th>Acciones</th></tr></thead>' +
      '<tbody>' + visibles.map(function (p) {
        var a = CA.artesana(p.artesanaId);
        return '<tr>' +
          '<td data-label="Producto"><div style="display:flex;align-items:center;gap:10px">' +
          '<img class="table-thumb" src="' + CA.imgSrc(p.imagen) + '" alt="">' +
          '<span><span class="cell-strong">' + CA.esc(p.nombre) + '</span><span class="table-sub">' + p.id.toUpperCase() + ' · publicado ' + CA.fmtFecha(p.fechaPublicacion) + '</span></span>' +
          '</div></td>' +
          '<td data-label="Categoría">' + CA.categoriaBadge(p.categoria) + '</td>' +
          '<td data-label="Artesana"><div style="display:flex;align-items:center;gap:8px">' +
          '<img class="avatar avatar-sm" src="' + CA.avatarURI(a ? a.nombre : '') + '" alt="">' +
          '<span>' + CA.esc(a ? a.nombre : '—') + '</span></div></td>' +
          '<td class="cell-money" data-label="Precio">' + CA.fmtCOP(p.precio) + '</td>' +
          '<td data-label="Stock">' + p.stock + '</td>' +
          '<td data-label="Disponible"><label class="switch" title="Cambiar disponibilidad">' +
          '<input type="checkbox" data-disp="' + p.id + '"' + (p.disponible ? ' checked' : '') + '>' +
          '<span class="track"></span></label></td>' +
          '<td class="cell-actions" data-label="Acciones">' +
          '<a class="btn btn-outline btn-xs" href="producto.html?id=' + p.id + '" title="Ver en la tienda pública">' + CA.icon('eye') + '</a>' +
          '<button type="button" class="btn btn-outline btn-xs" data-editar="' + p.id + '" title="Editar">' + CA.icon('edit') + '</button>' +
          '<button type="button" class="btn btn-outline btn-xs" data-eliminar="' + p.id + '" title="Eliminar">' + CA.icon('trash') + '</button>' +
          '</td></tr>';
      }).join('') + '</tbody></table></div>';

    document.getElementById('mas').style.display = lista.length > estado.visibles ? 'inline-flex' : 'none';
    document.getElementById('mas').textContent = 'Cargar más productos (' + (lista.length - estado.visibles) + ' restantes)';

    /* Eventos de la tabla */
    CA.$$('[data-editar]', contenedor).forEach(function (b) {
      b.addEventListener('click', function () { abrirFormulario(b.getAttribute('data-editar')); });
    });
    CA.$$('[data-eliminar]', contenedor).forEach(function (b) {
      b.addEventListener('click', function () { eliminar(b.getAttribute('data-eliminar')); });
    });
    CA.$$('[data-disp]', contenedor).forEach(function (sw) {
      sw.addEventListener('change', function () {
        var idProd = sw.getAttribute('data-disp');
        var ahora = sw.checked;
        window.CA_Store.actualizar(function (st2) {
          st2.productos.forEach(function (p) {
            if (p.id === idProd) p.disponible = ahora;
          });
        });
        var prod = CA.producto(idProd);
        CA.toast('“' + (prod ? prod.nombre : 'Producto') + '” ahora está ' + (ahora ? 'disponible' : 'pausado') + ' en la vitrina.', ahora ? 'success' : 'info', 'Disponibilidad actualizada');
        render();
      });
    });
  }

  function documentoVacioEvento() {
    var b = document.getElementById('vacio-nuevo');
    if (b) b.addEventListener('click', function () { abrirFormulario(null); });
  }

  /* ---------- Formulario crear / editar ---------- */
  function abrirFormulario(id) {
    var st = window.CA_Store.get();
    var p = id ? CA.producto(id) : null;
    var esEdicion = !!p;

    var opcionesCat = CA_DATA.CATEGORIAS.map(function (c) {
      return '<option value="' + c.id + '"' + (p && p.categoria === c.id ? ' selected' : '') + '>' + c.nombre + '</option>';
    }).join('');

    var opcionesArtesana = st.artesanas.filter(function (a) { return a.estado !== 'Inactiva'; }).map(function (a) {
      return '<option value="' + a.id + '"' + (p && p.artesanaId === a.id ? ' selected' : '') + '>' + CA.esc(a.nombre) + ' · ' + CA.catInfo(a.especialidad).nombre + '</option>';
    }).join('');

    var imgActual = p ? p.imagen : IMAGENES[0];

    CA.modal({
      title: esEdicion ? 'Editar producto' : 'Registrar nuevo producto',
      size: 'lg',
      html:
        '<form class="product-form" id="form-producto" novalidate>' +
        '<div class="field"><label for="fp-nombre">Nombre del producto *</label>' +
        '<input type="text" id="fp-nombre" value="' + (p ? CA.esc(p.nombre) : '') + '" placeholder="Ej.: Bolso artesanal en palma de iraca">' +
        '<span class="error-msg">El nombre debe tener al menos 5 caracteres.</span></div>' +
        '<div class="form-row">' +
        '<div class="field"><label for="fp-categoria">Categoría *</label><select id="fp-categoria">' + opcionesCat + '</select></div>' +
        '<div class="field"><label for="fp-artesana">Artesana autora *</label><select id="fp-artesana">' + opcionesArtesana + '</select></div>' +
        '</div>' +
        '<div class="form-row">' +
        '<div class="field"><label for="fp-precio">Precio (COP) *</label><input type="number" id="fp-precio" min="1000" step="500" value="' + (p ? p.precio : '') + '" placeholder="85000">' +
        '<span class="error-msg">Ingresa un precio mayor a $1.000.</span></div>' +
        '<div class="field"><label for="fp-stock">Stock (unidades) *</label><input type="number" id="fp-stock" min="0" step="1" value="' + (p ? p.stock : 1) + '">' +
        '<span class="error-msg">El stock no puede ser negativo.</span></div>' +
        '</div>' +
        '<div class="field"><label for="fp-desc">Historia o descripción de la pieza *</label>' +
        '<textarea id="fp-desc" placeholder="Cuenta cómo se elabora y qué la hace especial…">' + (p ? CA.esc(p.historia) : '') + '</textarea>' +
        '<span class="error-msg">Escribe al menos 15 caracteres.</span></div>' +
        '<div class="form-row">' +
        '<div class="field"><label for="fp-materiales">Materiales</label><input type="text" id="fp-materiales" value="' + (p ? CA.esc(p.materiales) : '') + '" placeholder="Ej.: Palma de iraca, hilo encerado"></div>' +
        '<div class="field"><label for="fp-tiempo">Tiempo de elaboración</label><input type="text" id="fp-tiempo" value="' + (p ? CA.esc(p.tiempo) : '') + '" placeholder="Ej.: 4 días de tejido"></div>' +
        '</div>' +
        '<div class="field"><label>Imagen de la pieza *</label><div class="img-picker">' +
        IMAGENES.map(function (img, i) {
          return '<label class="img-option" title="' + img + '"><input type="radio" name="fp-img" value="' + img + '"' + (img === imgActual ? ' checked' : '') + '>' +
            '<img src="' + CA.imgSrc(img) + '" alt="Opción de imagen ' + (i + 1) + '"></label>';
        }).join('') + '</div></div>' +
        '<label class="checkbox"><input type="checkbox" id="fp-disponible"' + (!p || p.disponible ? ' checked' : '') + '> Mostrar como disponible en la vitrina</label>' +
        '</form>',
      actions: [
        { label: 'Cancelar', cls: 'btn-outline' },
        {
          label: esEdicion ? 'Guardar cambios' : 'Registrar producto', cls: 'btn-primary', onClick: function (close, root) {
            if (guardar(root, p)) {
              close();
              render();
            }
          }
        }
      ]
    });
  }

  function guardar(root, p) {
    var valido = true;
    function marcar(sel, ok) {
      var campo = root.querySelector(sel).closest('.field');
      campo.classList.toggle('has-error', !ok);
      if (!ok) valido = false;
      return ok;
    }
    var nombre = root.querySelector('#fp-nombre').value.trim();
    var desc = root.querySelector('#fp-desc').value.trim();
    var precio = Number(root.querySelector('#fp-precio').value);
    var stock = Number(root.querySelector('#fp-stock').value);
    var categoria = root.querySelector('#fp-categoria').value;
    var artesanaId = root.querySelector('#fp-artesana').value;
    var materiales = root.querySelector('#fp-materiales').value.trim();
    var tiempo = root.querySelector('#fp-tiempo').value.trim();
    var imagen = (root.querySelector('input[name="fp-img"]:checked') || {}).value || IMAGENES[0];
    var disponible = root.querySelector('#fp-disponible').checked;

    marcar('#fp-nombre', nombre.length >= 5);
    marcar('#fp-desc', desc.length >= 15);
    marcar('#fp-precio', precio >= 1000);
    marcar('#fp-stock', stock >= 0 && Number.isInteger(stock));
    if (!valido) {
      CA.toast('Revisa los campos marcados en rojo.', 'error', 'Formulario incompleto');
      return false;
    }

    window.CA_Store.actualizar(function (st) {
      if (p) {
        st.productos.forEach(function (x) {
          if (x.id === p.id) {
            x.nombre = nombre; x.categoria = categoria; x.precio = precio; x.artesanaId = artesanaId;
            x.historia = desc; x.descripcion = desc;
            x.materiales = materiales || x.materiales; x.tiempo = tiempo || x.tiempo;
            x.stock = stock; x.disponible = disponible; x.imagen = imagen;
          }
        });
      } else {
        var maxSeq = st.productos.reduce(function (m, x) { return Math.max(m, x.seq || 0); }, 0);
        st.productos.push({
          id: 'p' + (maxSeq + 1), seq: maxSeq + 1, nombre: nombre, categoria: categoria, precio: precio,
          artesanaId: artesanaId, descripcion: desc, historia: desc,
          materiales: materiales || 'Materiales artesanales de la región',
          tiempo: tiempo || 'Elaboración artesanal',
          stock: stock, disponible: disponible, imagen: imagen,
          destacado: false, fechaPublicacion: CA.hoyISO(), unidadesVendidas: 0, ventasTotal: 0
        });
      }
      recomputarContadores(st);
    });

    CA.toast(p ? 'Los cambios de “' + nombre + '” se guardaron.' : '“' + nombre + '” quedó publicado en el catálogo colectivo.', 'success', p ? 'Producto actualizado' : 'Producto registrado');
    return true;
  }

  function eliminar(id) {
    var p = CA.producto(id);
    if (!p) return;
    var vendidos = p.unidadesVendidas;
    CA.confirmar({
      title: 'Eliminar producto',
      mensaje: vendidos > 0
        ? '“' + p.nombre + '” tiene ' + vendidos + ' unidad(es) vendida(s). El histórico de pedidos se conservará, pero la pieza saldrá del catálogo. ¿Deseas eliminarla?'
        : '¿Seguro que deseas eliminar “' + p.nombre + '” del catálogo colectivo? Esta acción no se puede deshacer.',
      okLabel: 'Sí, eliminar',
      danger: true,
      onOk: function () {
        window.CA_Store.actualizar(function (st) {
          st.productos = st.productos.filter(function (x) { return x.id !== id; });
          recomputarContadores(st);
        });
        CA.toast('“' + p.nombre + '” fue eliminado del catálogo.', 'info', 'Producto eliminado');
        render();
      }
    });
  }

  /* ---------- Filtros y paginación ---------- */
  var temporizador = null;
  document.getElementById('buscar').addEventListener('input', function (e) {
    clearTimeout(temporizador);
    var v = e.target.value;
    temporizador = setTimeout(function () {
      estado.q = v; estado.visibles = 12; render();
    }, 180);
  });
  selCat.addEventListener('change', function (e) { estado.cat = e.target.value; estado.visibles = 12; render(); });
  document.getElementById('filtro-disp').addEventListener('change', function (e) { estado.disp = e.target.value; estado.visibles = 12; render(); });
  document.getElementById('mas').addEventListener('click', function () { estado.visibles += 12; render(); });
  document.getElementById('btn-nuevo').addEventListener('click', function () { abrirFormulario(null); });

  render();

  /* Abrir formulario directo si llega con ?nuevo=1 */
  if (new URLSearchParams(window.location.search).get('nuevo') === '1') {
    abrirFormulario(null);
  }
})();
