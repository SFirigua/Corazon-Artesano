/* ============================================================
   CORAZÓN ARTESANO — Estado del prototipo (localStorage)
   Guarda el estado completo con respaldo en memoria si el
   navegador bloquea localStorage (p. ej. al abrir con file://).
   ============================================================ */

window.CA_Store = (function () {
  'use strict';

  var KEYS = {
    estado: 'ca_v1_estado',
    carrito: 'ca_v1_carrito',
    sesion: 'ca_v1_sesion',
    voto: 'ca_v1_voto'
  };

  var memoria = null;
  var modo = 'localStorage';

  function probar() {
    try {
      localStorage.setItem('__ca_test__', '1');
      localStorage.removeItem('__ca_test__');
      return true;
    } catch (e) {
      return false;
    }
  }
  if (!probar()) modo = 'memoria';

  function init() {
    if (modo === 'memoria') {
      if (!memoria) memoria = window.CA_DATA.buildSeed();
      return memoria;
    }
    try {
      var raw = localStorage.getItem(KEYS.estado);
      if (raw) {
        var st = JSON.parse(raw);
        if (st && st.version === 1 && st.artesanas && st.productos && st.pedidos) return st;
      }
    } catch (e) { /* datos corruptos: se regeneran */ }
    var fresh = window.CA_DATA.buildSeed();
    save(fresh);
    return fresh;
  }

  function save(state) {
    if (modo === 'memoria') { memoria = state; return; }
    try {
      localStorage.setItem(KEYS.estado, JSON.stringify(state));
    } catch (e) {
      modo = 'memoria';
      memoria = state;
    }
  }

  function get() { return init(); }

  function actualizar(fn) {
    var st = get();
    var res = fn(st);
    save(st);
    return res === undefined ? st : res;
  }

  function reset() {
    if (modo !== 'memoria') {
      try {
        Object.keys(KEYS).forEach(function (k) { localStorage.removeItem(KEYS[k]); });
      } catch (e) { /* ignorar */ }
    }
    memoria = null;
    return init();
  }

  function carritoGet() {
    if (modo === 'memoria') return memoria ? (memoria.__carrito || []) : [];
    try {
      var raw = localStorage.getItem(KEYS.carrito);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function carritoSet(items) {
    if (modo === 'memoria') {
      if (memoria) memoria.__carrito = items;
      return;
    }
    try { localStorage.setItem(KEYS.carrito, JSON.stringify(items)); } catch (e) { /* ignorar */ }
  }

  function sesionGet() {
    if (modo === 'memoria') return memoria ? (memoria.__sesion || null) : null;
    try {
      var raw = localStorage.getItem(KEYS.sesion);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function sesionSet(u) {
    if (modo === 'memoria') {
      if (memoria) memoria.__sesion = u;
      return;
    }
    try { localStorage.setItem(KEYS.sesion, JSON.stringify(u)); } catch (e) { /* ignorar */ }
  }

  function sesionClear() {
    if (modo === 'memoria') {
      if (memoria) memoria.__sesion = null;
      return;
    }
    try { localStorage.removeItem(KEYS.sesion); } catch (e) { /* ignorar */ }
  }

  function votoGet() {
    if (modo === 'memoria') return memoria ? (memoria.__voto || null) : null;
    try {
      var raw = localStorage.getItem(KEYS.voto);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function votoSet(v) {
    if (modo === 'memoria') {
      if (memoria) memoria.__voto = v;
      return;
    }
    try { localStorage.setItem(KEYS.voto, JSON.stringify(v)); } catch (e) { /* ignorar */ }
  }

  return {
    KEYS: KEYS,
    get: get,
    save: save,
    actualizar: actualizar,
    reset: reset,
    carritoGet: carritoGet,
    carritoSet: carritoSet,
    sesionGet: sesionGet,
    sesionSet: sesionSet,
    sesionClear: sesionClear,
    votoGet: votoGet,
    votoSet: votoSet,
    get modo() { return modo; }
  };
})();
