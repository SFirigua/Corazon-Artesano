/* ============================================================
   CORAZÓN ARTESANO — Datos semilla del prototipo
   Genera de forma determinista:
   · 75 artesanas      · 128 productos      · 46 pedidos
   · Ventas totales exactas: $8.450.000 COP
   · Junio: 32 pedidos de 12 artesanas     · María Rodríguez: 8 productos, $850.000
   ============================================================ */

window.CA_DATA = (function () {
  'use strict';

  var CATEGORIAS = [
    { id: 'palma', nombre: 'Palma de iraca', corto: 'Iraca', color: '#2F6B4F', bg: '#E4EFE7', icon: 'leaf' },
    { id: 'filigrana', nombre: 'Filigrana', corto: 'Filigrana', color: '#A87B22', bg: '#F7EDD6', icon: 'sparkle' },
    { id: 'tejidos', nombre: 'Tejidos', corto: 'Tejidos', color: '#A15C3E', bg: '#F6EBE0', icon: 'layers' },
    { id: 'bisuteria', nombre: 'Bisutería', corto: 'Bisutería', color: '#7A5C8C', bg: '#F0E8F4', icon: 'gem' },
    { id: 'gastronomia', nombre: 'Gastronomía', corto: 'Gastronomía', color: '#B5533C', bg: '#FAEFE7', icon: 'cookie' }
  ];

  var USUARIOS = [
    { email: 'admin@corazonartesano.co', pass: 'admin123', rol: 'admin', nombre: 'Administradora', artesanaId: null },
    { email: 'artesana@corazonartesano.co', pass: 'artesana123', rol: 'artesana', nombre: 'María Rodríguez', artesanaId: 'a1' }
  ];

  var NOMBRES = [
    'Rosa', 'Carmen', 'Yolanda', 'Luz Elena', 'Isabel', 'Ana Lucía', 'Marta', 'Teresa', 'Sofía', 'Digna',
    'Nubia', 'Elvira', 'Ester', 'Gladys', 'Jaqueline', 'Kelly', 'Ledis', 'Marlen', 'Milena', 'Nohora',
    'Omaira', 'Patricia', 'Rubiela', 'Sandra', 'Tatiana', 'Vianeth', 'Wendy', 'Xiomara', 'Yesenia', 'Zuleima',
    'Adriana', 'Beatriz', 'Claudia', 'Deivis', 'Emilse', 'Flor', 'Gloria', 'Hilda', 'Irene', 'Josefina',
    'Katia', 'Laura', 'Mayerli', 'Nélida', 'Olga', 'Paula', 'Reina', 'Silvia', 'Tulia', 'Úrsula',
    'Viviana', 'Wendis', 'Yadira', 'Zenaida', 'Alba', 'Berenice', 'Ceidy', 'Deysi', 'Eliana', 'Fanny',
    'Gisela', 'Heidy', 'Isaura', 'Johana', 'Karen', 'Liliana', 'Miriam', 'Nayibe', 'Otilia', 'Piedad',
    'Rosalba', 'Sara', 'Telma', 'Verena', 'Yina'
  ];

  var APELLIDOS = [
    'Rodríguez', 'Pérez', 'Torres', 'Martínez', 'Gómez', 'Cárdenas', 'Mendoza', 'Ríos', 'Herrera', 'Salgado',
    'Ospina', 'Barrios', 'Contreras', 'Díaz', 'Espitia', 'Flórez', 'Guerra', 'Hernández', 'Ibarra', 'Jiménez',
    'López', 'Marín', 'Navarro', 'Oviedo', 'Padilla', 'Quintero', 'Rangel', 'Suárez', 'Tovar', 'Viloria'
  ];

  var CURADAS = [
    { nombre: 'María Rodríguez', edad: 42, anios: 18, estado: 'Activa' },
    { nombre: 'Rosa Pérez', edad: 55, anios: 30, estado: 'Activa' },
    { nombre: 'Carmen Torres', edad: 47, anios: 22, estado: 'Activa' },
    { nombre: 'Yolanda Martínez', edad: 38, anios: 12, estado: 'Activa' },
    { nombre: 'Luz Elena Gómez', edad: 60, anios: 35, estado: 'Activa' },
    { nombre: 'Isabel Cárdenas', edad: 33, anios: 8, estado: 'Activa' }
  ];

  var BIOS = {
    palma: function (n, a) {
      return n + ' teje palma de iraca desde hace ' + a + ' años. Aprendió el oficio de su abuela en los patios de Mompox y hoy elabora bolsos, sombreros y canastas que llevan el nombre del municipio a otras ciudades.';
    },
    filigrana: function (n, a) {
      return n + ' trabaja la filigrana desde hace ' + a + ' años, hilo de plata que se entrelaza a mano. Cada joya que firma guarda un fragmento de la historia joyera de Santa Cruz de Mompox.';
    },
    tejidos: function (n, a) {
      return n + ' teje en telar y crochet desde hace ' + a + ' años. Sus manteles, mochilas y cojines combinan técnicas heredadas con colores inspirados en el río Magdalena.';
    },
    bisuteria: function (n, a) {
      return n + ' diseña bisutería artesanal desde hace ' + a + ' años, uniendo mostacillas, semillas y colores que cuentan la vida del Caribe colombiano.';
    },
    gastronomia: function (n, a) {
      return n + ' prepara dulces y conservas tradicionales desde hace ' + a + ' años, con recetas que pasan de generación en generación en las cocinas momposinas.';
    }
  };

  var TPL = {
    palma: [
      { nombre: 'Bolso artesanal en palma de iraca', img: 'prod-bolso-iraca', base: 85000, materiales: 'Palma de iraca tejida a mano, asas en cuero natural, forro interior en tela de algodón', tiempo: '6 días de tejido', historia: 'Tejido punto a punto en palma de iraca secada al sol del Magdalena. Su forma se inspira en las alforjas que las mujeres momposinas llevaban al mercado.' },
      { nombre: 'Sombrero artesanal en palma de iraca', img: 'prod-sombrero-iraca', base: 65000, materiales: 'Palma de iraca, cinta interior de tocuyo, acabado natural', tiempo: '4 días de tejido', historia: 'Un clásico del Caribe colombiano, tejido en espiral para que el aire circule y el sol de Mompox no sea un problema.' },
      { nombre: 'Canasta momposina en palma de iraca', img: 'prod-canasta-iraca', base: 120000, materiales: 'Palma de iraca, base reforzada, asas tejidas', tiempo: '8 días de tejido', historia: 'Canasta de gran formato que las artesanas usaban para el mercado y hoy viaja como pieza decorativa a casas y hoteles.' },
      { nombre: 'Individuales tejidos en iraca (juego x4)', img: 'prod-individuales-iraca', base: 45000, materiales: 'Palma de iraca, juego de 4 unidades, acabado natural', tiempo: '5 días de tejido', historia: 'Juego de mesa que combina el tejido tradicional con un diseño contemporáneo para compartir la mesa en familia.' },
      { nombre: 'Florero decorativo en palma de iraca', img: 'prod-florero-iraca', base: 90000, materiales: 'Palma de iraca trenzada a mano, base reforzada', tiempo: '6 días de tejido', historia: 'Pieza decorativa elaborada con la técnica del trenzado momposino, un oficio que se mantiene vivo entre las socias de la cooperativa.' }
    ],
    filigrana: [
      { nombre: 'Pulsera de filigrana en plata', img: 'prod-pulsera-filigrana', base: 180000, materiales: 'Plata 950 en hilo de filigrana, tejido a mano', tiempo: '6 días de orfebrería', historia: 'Hilo de plata que se enrolla y se teje como encaje. La filigrana es el oficio más emblemático de Mompox y vive en las manos de las mujeres de Corazón Artesano.' },
      { nombre: 'Collar de filigrana momposina', img: 'prod-collar-filigrana', base: 320000, materiales: 'Plata 950, hilo de filigrana momposina, cierre artesanal', tiempo: '10 días de orfebrería', historia: 'Inspirado en los encajes de las ventanas coloniales de la Albarrada. Cada vuelta del hilo de plata es un paso más cerca de la independencia económica de su autora.' },
      { nombre: 'Aretes de filigrana en plata', img: 'prod-aretes-filigrana', base: 150000, materiales: 'Plata 950, filigrana tejida, gancho en plata', tiempo: '5 días de orfebrería', historia: 'Aretes livianos y elegantes, tejidos con la técnica que las joyeras momposinas perfeccionaron durante generaciones.' },
      { nombre: 'Dije de filigrana "Corazón momposino"', img: 'prod-collar-filigrana', base: 210000, materiales: 'Plata 950, filigrana momposina, cadena de 45 cm', tiempo: '7 días de orfebrería', historia: 'Un corazón tejido en hilo de plata: el símbolo de la cooperativa, hecho joya por las manos de sus socias.' }
    ],
    tejidos: [
      { nombre: 'Mochila tejida a mano', img: 'prod-mochila-tejida', base: 160000, materiales: 'Fibras naturales, telar vertical, cordones en algodón', tiempo: '10 días de tejido', historia: 'Tejida en telar vertical con franjas de colores que evocan las aguas del río Magdalena y los atardeceres momposinos.' },
      { nombre: 'Camino de mesa tejido', img: 'prod-mantel-tejido', base: 95000, materiales: 'Hilo de algodón, telar de pedal, terminado a mano', tiempo: '7 días de tejido', historia: 'Pieza para la mesa que mezcla técnicas de telar heredadas con paleta de colores cálidos de la región.' },
      { nombre: 'Cojín tejido decorativo', img: 'prod-cojin-tejido', base: 70000, materiales: 'Hilo de algodón, relleno en fibra, tejido en crochet', tiempo: '4 días de tejido', historia: 'Tejido en crochet con franjas que combinan el ocre, el verde y el terracota: la paleta viva de la artesanía momposina.' },
      { nombre: 'Manta tejida en telar', img: 'prod-mantel-tejido', base: 220000, materiales: 'Hilo de algodón y lana, telar de pedal, orillos a mano', tiempo: '14 días de tejido', historia: 'Manta abrigada tejida en telar de pedal, una técnica que las socias enseñan a las nuevas generaciones en los talleres de la cooperativa.' }
    ],
    bisuteria: [
      { nombre: 'Collar artesanal en mostacillas', img: 'prod-collar-bisuteria', base: 60000, materiales: 'Mostacillas checas, hilo encerado, dije artesanal', tiempo: '2 días de elaboración', historia: 'Cada mostacilla se ensarta a mano con paciencia y color. Un accesorio fresco que también cuenta la historia del Caribe.' },
      { nombre: 'Pulsera artesanal en mostacillas', img: 'prod-pulsera-bisuteria', base: 25000, materiales: 'Mostacillas checas, semillas naturales, hilo encerado', tiempo: '1 día de elaboración', historia: 'Pulsera liviana y colorida, ensartada semilla por semilla, inspirada en los colores del mercado momposino.' },
      { nombre: 'Aretes artesanales en mostacillas', img: 'prod-aretes-bisuteria', base: 35000, materiales: 'Mostacillas checas, base en acero dorado', tiempo: '1 día de elaboración', historia: 'Aretes de cadena con mostacillas que brillan como el sol de las cuatro de la tarde en la plaza de Mompox.' },
      { nombre: 'Set collar + aretes artesanal', img: 'prod-collar-bisuteria', base: 85000, materiales: 'Mostacillas checas, hilo encerado, set collar y aretes', tiempo: '3 días de elaboración', historia: 'Conjunto completo que combina los colores que las artesanas eligen a diario: eso que ellas llaman "el color de la casa".' }
    ],
    gastronomia: [
      { nombre: 'Caja de dulces típicos momposinos', img: 'prod-caja-dulces', base: 42000, materiales: 'Dulce de coco, bocadillo, conservas, caja artesanal', tiempo: '1 día de elaboración', historia: 'Selección de dulces de coco y conservas preparados con recetas de familia. La caja viaja lista para regalar.' },
      { nombre: 'Bocadillo momposino artesanal', img: 'prod-bocadillo', base: 18000, materiales: 'Guayaba de la región, panela, envoltura en hoja de bijao', tiempo: '1 día de elaboración', historia: 'El bocadillo más famoso del Magdalena, elaborado a fuego lento con guayaba y panela, con el punto que solo las cocineras momposinas conocen.' },
      { nombre: 'Conserva artesanal de frutas', img: 'prod-conserva', base: 28000, materiales: 'Frutas de la región, panela, frasco de vidrio esterilizado', tiempo: '1 día de elaboración', historia: 'Conserva de frutas de la región cocida a fuego lento, en frasco esterilizado y lista para acompañar los desayunos.' }
    ]
  };

  var VAR_NOMBRE = ['', ' en tonos naturales', ' edición río Magdalena', ' talla única', ' acabado tradicional'];
  var FACTORES = [1, 1.15, 0.92, 1.22, 1.05];

  var CLIENTES = [
    'Valentina Ríos', 'Carlos Mendoza', 'Sophie Martin (Francia)', 'James Carter (EE. UU.)',
    'Hotel Casa Amarilla', 'Boutique La Albarrada', 'Posada Doña Manuela', 'Ana Lucía Prada',
    'Felipe Ospina', 'Katherine Ruiz', 'Restaurante El Fuerte', 'Luisa Fernanda Mesa',
    'Andrés Villalba', 'Museo de la Filigrana', 'Camila Restrepo', 'Pedro Nel Barrios',
    'Sofía Guerrero', 'Emilia Torres (España)', 'Lucas Ferreira (Brasil)', 'Tienda Arte Mompox',
    'Diana Carolina Ossa', 'Jorge Eliécer Rangel', 'Marta Ceballos', 'Ricardo León (Panamá)'
  ];
  var CIUDADES = ['Mompox', 'Bogotá', 'Medellín', 'Cartagena', 'Barranquilla', 'Bucaramanga', 'Santa Marta', 'París', 'Madrid', 'Miami'];
  var CANALES = ['Vitrina digital', 'Vitrina física', 'Feria turística', 'Pedido por WhatsApp'];
  var ESTADOS_PEDIDO = ['Pendiente', 'En preparación', 'Enviado', 'Entregado'];
  var MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  var MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  var VOTACION = {
    pregunta: '¿Qué categoría debe recibir mayor espacio en la próxima campaña turística?',
    opciones: [
      { id: 'palma', nombre: 'Palma de iraca', votos: 28 },
      { id: 'filigrana', nombre: 'Filigrana', votos: 19 },
      { id: 'tejidos', nombre: 'Tejidos', votos: 15 },
      { id: 'bisuteria', nombre: 'Bisutería', votos: 9 },
      { id: 'gastronomia', nombre: 'Gastronomía', votos: 4 }
    ]
  };

  var PROPUESTAS = [
    { titulo: 'Ampliar la vitrina física en la calle de la Albarrada', estado: 'Aprobada', detalle: '58 a favor · 9 en contra · 8 abstenciones', fecha: '15 feb 2026' },
    { titulo: 'Ruta turística de talleres "Manos de Mompox"', estado: 'En votación', detalle: 'Debate en curso en la asamblea', fecha: '20 jun 2026' },
    { titulo: 'Fondo común de empaques biodegradables', estado: 'En estudio', detalle: 'Revisión del comité de comercialización', fecha: '28 may 2026' }
  ];

  var ASAMBLEAS = [
    { titulo: 'Asamblea general ordinaria', fecha: '12 jul 2026', hora: '9:00 a. m.', lugar: 'Casa de la Cultura, Mompox', puntos: ['Informe de ventas del primer semestre', 'Elección del comité de comercialización', 'Presupuesto de la vitrina física'] },
    { titulo: 'Taller de precios justos y costos', fecha: '26 jul 2026', hora: '2:00 p. m.', lugar: 'Sede de la cooperativa', puntos: ['Cálculo de costos por oficio', 'Definición colectiva de precios'] },
    { titulo: 'Asamblea extraordinaria', fecha: '9 ago 2026', hora: '9:00 a. m.', lugar: 'Casa de la Cultura, Mompox', puntos: ['Resultados de la campaña turística', 'Nuevas socias'] }
  ];

  var COMITES = {
    junta: ['a1', 'a16', 'a31', 'a46', 'a61'],
    comercializacion: ['a2', 'a7', 'a17', 'a22', 'a32', 'a47', 'a62'],
    apoyo: ['a3', 'a18', 'a33', 'a48', 'a63']
  };

  var TARGET_VENTAS = 8450000;

  function redondear(v) { return Math.round(v / 500) * 500; }
  function pad(n, len) { var s = String(n); while (s.length < len) s = '0' + s; return s; }
  function fechaISO(y, m, d) { return y + '-' + pad(m + 1, 2) + '-' + pad(d, 2); }

  function buildArtesanas() {
    var out = [];
    for (var i = 0; i < 75; i++) {
      var nombre;
      if (i < CURADAS.length) {
        nombre = CURADAS[i].nombre;
      } else {
        var extra = Math.floor(i / 30);
        nombre = NOMBRES[i % NOMBRES.length] + ' ' + APELLIDOS[(i * 7 + 3) % 30] + ' ' + APELLIDOS[(i * 13 + 7 + extra * 4) % 30];
      }
      var cat = CATEGORIAS[i % 5];
      var estado = i > 0 && i % 17 === 0 ? 'En proceso' : (i > 0 && i % 11 === 0 ? 'Nueva' : 'Activa');
      var comite = null;
      var id = 'a' + (i + 1);
      if (COMITES.junta.indexOf(id) >= 0) comite = 'Junta de administración';
      else if (COMITES.comercializacion.indexOf(id) >= 0) comite = 'Comité de comercialización';
      else if (COMITES.apoyo.indexOf(id) >= 0) comite = 'Comité de apoyo y bienestar';
      var edad = CURADAS[i] ? CURADAS[i].edad : 28 + (i * 7) % 33;
      var anios = CURADAS[i] ? CURADAS[i].anios : 3 + (i * 5) % 28;
      if (CURADAS[i]) estado = CURADAS[i].estado;
      out.push({
        id: id,
        nombre: nombre,
        edad: edad,
        anios: anios,
        especialidad: cat.id,
        estado: estado,
        comite: comite,
        municipio: 'Santa Cruz de Mompox, Bolívar',
        bio: BIOS[cat.id](nombre.split(' ')[0], anios),
        productos: 0,
        ventas: 0,
        pedidos: 0
      });
    }
    return out;
  }

  function buildProductos(artesanas) {
    var productos = [];
    var seq = 0;
    var porCat = { palma: 32, filigrana: 30, tejidos: 24, bisuteria: 24, gastronomia: 18 };
    CATEGORIAS.forEach(function (cat, catIdx) {
      var tpls = TPL[cat.id];
      var artesanasCat = artesanas.filter(function (a) { return a.especialidad === cat.id; });
      var total = porCat[cat.id];
      for (var j = 0; j < total; j++) {
        var tpl = tpls[j % tpls.length];
        var precio = redondear(tpl.base * FACTORES[(j + catIdx) % 5]);
        var sufijo = VAR_NOMBRE[(j + catIdx * 2) % VAR_NOMBRE.length];
        var artesana;
        if (cat.id === 'palma' && j < 8) artesana = artesanasCat[0];
        else if (cat.id === 'palma') artesana = artesanasCat[1 + (j - 8) % 14];
        else artesana = artesanasCat[j % artesanasCat.length];
        var stock = (j * 7 + 3) % 14;
        if (cat.id === 'palma' && j === 0) stock = 6;
        if (cat.id === 'gastronomia') stock = 3 + (j * 5) % 10;
        seq++;
        productos.push({
          id: 'p' + seq,
          seq: seq,
          nombre: tpl.nombre + sufijo,
          categoria: cat.id,
          precio: precio,
          artesanaId: artesana.id,
          descripcion: tpl.historia,
          historia: tpl.historia,
          materiales: tpl.materiales,
          tiempo: tpl.tiempo,
          stock: stock,
          disponible: stock > 0,
          imagen: tpl.img,
          destacado: j === 0,
          fechaPublicacion: fechaISO(2025, 8 + (seq % 4), 1 + (seq * 3) % 27),
          unidadesVendidas: 0,
          ventasTotal: 0
        });
      }
    });
    return productos;
  }

  function buildPedidos(artesanas, productos) {
    var pedidos = [];
    var byArt = {};
    productos.forEach(function (p) {
      (byArt[p.artesanaId] = byArt[p.artesanaId] || []).push(p);
    });

    function addPedido(o) {
      pedidos.push({
        id: null,
        cliente: o.cliente,
        productoId: o.producto.id,
        artesanaId: o.producto.artesanaId,
        fecha: o.fecha,
        qty: o.qty,
        valor: o.producto.precio * o.qty,
        estado: o.estado,
        canal: o.canal,
        ciudad: o.ciudad
      });
    }

    var usados = {};
    var a12prods = byArt['a12'];
    var especial = a12prods[1];
    usados[especial.id] = true;

    /* --- Junio: 6 pedidos de María Rodríguez que suman $850.000 --- */
    var maria = byArt['a1'];
    var planMaría = [
      { idx: 2, qty: 1 }, { idx: 7, qty: 1 }, { idx: 4, qty: 2 },
      { idx: 0, qty: 3 }, { idx: 1, qty: 1 }, { idx: 3, qty: 2 }
    ];
    var diasMaría = [2, 7, 12, 17, 22, 27];
    planMaría.forEach(function (pl, k) {
      addPedido({
        producto: maria[pl.idx], qty: pl.qty, fecha: fechaISO(2026, 5, diasMaría[k]),
        cliente: CLIENTES[k], ciudad: CIUDADES[k % CIUDADES.length],
        estado: ['Entregado', 'Entregado', 'Enviado', 'En preparación', 'Pendiente', 'Entregado'][k],
        canal: CANALES[k % CANALES.length]
      });
    });
    var sumaMaría = pedidos.reduce(function (s, p) { return s + p.valor; }, 0);

    /* --- Junio: 25 pedidos de 11 artesanas más (a2..a12) --- */
    var junioArts = ['a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11', 'a12'];
    var k = 0;
    while (k < 25) {
      var aid = junioArts[k % junioArts.length];
      var cands = byArt[aid].filter(function (p) { return !usados[p.id]; });
      var prod = cands[Math.floor(k / junioArts.length) % cands.length];
      if (!prod) { k++; continue; }
      var qty = [1, 2, 1, 3, 2][k % 5];
      addPedido({
        producto: prod, qty: qty, fecha: fechaISO(2026, 5, 1 + (k * 5 + 3) % 29),
        cliente: CLIENTES[(k * 3 + 5) % CLIENTES.length],
        ciudad: CIUDADES[(k * 2 + 1) % CIUDADES.length],
        estado: ESTADOS_PEDIDO[(k + 2) % 4],
        canal: CANALES[k % CANALES.length]
      });
      k++;
    }

    /* --- Otros meses: 13 pedidos regulares + 1 pedido "joker" --- */
    var pool = [];
    for (var i = 13; i <= 75; i++) pool.push('a' + i);
    var planOtros = [2, 3, 4, 2, 2];
    var m = 0;
    for (var mes = 0; mes < 5; mes++) {
      for (var t = 0; t < planOtros[mes]; t++) {
        var pArt = pool[(m * 7 + 3) % pool.length];
        var pProd = byArt[pArt][m % byArt[pArt].length];
        addPedido({
          producto: pProd, qty: 1, fecha: fechaISO(2026, mes, 4 + (m * 6) % 22),
          cliente: CLIENTES[(m * 5 + 7) % CLIENTES.length],
          ciudad: CIUDADES[(m * 3) % CIUDADES.length],
          estado: 'Entregado', canal: CANALES[(m + 2) % CANALES.length]
        });
        m++;
      }
    }

    /* --- Joker + pieza especial: ajuste exacto a $8.450.000 ---
       Se busca el pedido complementario más pequeño posible entre los
       productos de las artesanas de junio, para no distorsionar el ranking. */
    var fijos = pedidos.reduce(function (s, p) { return s + p.valor; }, 0);
    var jokerProd = null;
    var q = 1;
    var r = 0;
    var mejorScore = Infinity;
    junioArts.forEach(function (caid) {
      byArt[caid].forEach(function (cand) {
        if (usados[cand.id]) return;
        for (var qi = 1; qi <= 60; qi++) {
          var ri = TARGET_VENTAS - fijos - cand.precio * qi;
          if (ri >= 150000 && ri <= 460000) {
            var score = qi * 100000 + Math.abs(ri - 300000);
            if (score < mejorScore) {
              mejorScore = score;
              jokerProd = cand;
              q = qi;
              r = ri;
            }
          }
        }
      });
    });
    if (!jokerProd) {
      jokerProd = byArt['a5'][0];
      q = Math.max(1, Math.round((TARGET_VENTAS - fijos - 300000) / jokerProd.precio));
      r = TARGET_VENTAS - fijos - jokerProd.precio * q;
      var guard = 0;
      while ((r < 150000 || r > 460000) && guard < 80) {
        if (r < 150000) q--; else q++;
        if (q < 1) { q = 1; break; }
        r = TARGET_VENTAS - fijos - jokerProd.precio * q;
        guard++;
      }
    }
    addPedido({
      producto: jokerProd, qty: q, fecha: fechaISO(2026, 4, 18),
      cliente: 'Boutique La Albarrada', ciudad: 'Cartagena',
      estado: 'Entregado', canal: 'Vitrina física'
    });

    especial.nombre = 'Collar de filigrana momposina — edición especial';
    especial.descripcion = 'Pieza única tejida en hilo de plata por una de las maestras de la cooperativa. Solo existe una y está firmada por su autora.';
    especial.historia = especial.descripcion;
    especial.materiales = 'Plata 950, filigrana tejida a mano, cadena de 45 cm';
    especial.tiempo = '12 días de orfebrería';
    especial.precio = r;
    especial.stock = 1;
    especial.disponible = true;
    especial.destacado = true;

    addPedido({
      producto: especial, qty: 1, fecha: fechaISO(2026, 5, 29),
      cliente: 'Sophie Martin (Francia)', ciudad: 'París',
      estado: 'Enviado', canal: 'Vitrina digital'
    });

    /* --- Ordenar por fecha, asignar ids y derivar totales --- */
    pedidos.sort(function (a, b) { return a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0; });
    pedidos.forEach(function (p, idx) { p.id = 'P-2026-' + pad(idx + 1, 3); });

    pedidos.forEach(function (p) {
      var prod = productos.filter(function (x) { return x.id === p.productoId; })[0];
      var art = artesanas.filter(function (x) { return x.id === p.artesanaId; })[0];
      if (prod) { prod.unidadesVendidas += p.qty; prod.ventasTotal += p.valor; }
      if (art) { art.ventas += p.valor; art.pedidos += 1; }
    });
    productos.forEach(function (p) {
      var art = artesanas.filter(function (x) { return x.id === p.artesanaId; })[0];
      if (art) art.productos += 1;
    });

    return pedidos;
  }

  function buildSeed() {
    var artesanas = buildArtesanas();
    var productos = buildProductos(artesanas);
    var pedidos = buildPedidos(artesanas, productos);

    var totalVentas = pedidos.reduce(function (s, p) { return s + p.valor; }, 0);
    var junio = pedidos.filter(function (p) { return p.fecha.indexOf('2026-06') === 0; });
    var artesanasJunio = {};
    junio.forEach(function (p) { artesanasJunio[p.artesanaId] = true; });
    var ventasJunio = junio.reduce(function (s, p) { return s + p.valor; }, 0);

    var porMes = [];
    MESES.forEach(function (nombre, idx) {
      var mes = '2026-' + pad(idx + 1, 2);
      var delMes = pedidos.filter(function (p) { return p.fecha.indexOf(mes) === 0; });
      if (delMes.length || idx < 6) {
        porMes.push({
          label: MESES_CORTOS[idx],
          nombre: nombre,
          pedidos: delMes.length,
          total: delMes.reduce(function (s, p) { return s + p.valor; }, 0)
        });
      }
    });

    var porCategoria = CATEGORIAS.map(function (cat) {
      var total = 0;
      pedidos.forEach(function (p) {
        var prod = productos.filter(function (x) { return x.id === p.productoId; })[0];
        if (prod && prod.categoria === cat.id) total += p.valor;
      });
      return { id: cat.id, nombre: cat.nombre, color: cat.color, total: total };
    }).sort(function (a, b) { return b.total - a.total; });

    var topArtesanas = artesanas.slice().sort(function (a, b) { return b.ventas - a.ventas; }).slice(0, 5);

    return {
      version: 1,
      categorias: CATEGORIAS,
      artesanas: artesanas,
      productos: productos,
      pedidos: pedidos,
      votacion: JSON.parse(JSON.stringify(VOTACION)),
      haVotado: false,
      propuestas: JSON.parse(JSON.stringify(PROPUESTAS)),
      asambleas: JSON.parse(JSON.stringify(ASAMBLEAS)),
      meta: {
        totalArtesanas: artesanas.length,
        totalProductos: productos.length,
        totalPedidos: pedidos.length,
        totalVentas: totalVentas,
        ventasJunio: ventasJunio,
        pedidosJunio: junio.length,
        artesanasJunio: Object.keys(artesanasJunio).length,
        ticketPromedio: Math.round(totalVentas / pedidos.length),
        familiasBeneficiadas: 240,
        topArtesanas: topArtesanas.map(function (a) { return { id: a.id, nombre: a.nombre, ventas: a.ventas }; })
      },
      porMes: porMes,
      porCategoria: porCategoria
    };
  }

  function validar() {
    var s = buildSeed();
    var errores = [];
    if (s.artesanas.length !== 75) errores.push('Artesanas: ' + s.artesanas.length);
    if (s.productos.length !== 128) errores.push('Productos: ' + s.productos.length);
    if (s.pedidos.length !== 46) errores.push('Pedidos: ' + s.pedidos.length);
    if (s.meta.totalVentas !== TARGET_VENTAS) errores.push('Ventas: ' + s.meta.totalVentas);
    if (s.meta.pedidosJunio !== 32) errores.push('Pedidos junio: ' + s.meta.pedidosJunio);
    if (s.meta.artesanasJunio !== 12) errores.push('Artesanas junio: ' + s.meta.artesanasJunio);
    var maria = s.artesanas[0];
    if (maria.productos !== 8) errores.push('Productos María: ' + maria.productos);
    if (maria.ventas !== 850000) errores.push('Ventas María: ' + maria.ventas);
    var nombres = {};
    s.artesanas.forEach(function (a) {
      if (nombres[a.nombre]) errores.push('Nombre duplicado: ' + a.nombre);
      nombres[a.nombre] = true;
    });
    if (errores.length) console.warn('[Corazón Artesano] Inconsistencias en datos semilla:', errores);
    return errores;
  }

  return {
    CATEGORIAS: CATEGORIAS,
    USUARIOS: USUARIOS,
    MESES: MESES,
    MESES_CORTOS: MESES_CORTOS,
    ESTADOS_PEDIDO: ESTADOS_PEDIDO,
    COMITES: COMITES,
    buildSeed: buildSeed,
    validar: validar
  };
})();
