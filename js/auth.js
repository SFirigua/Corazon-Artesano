/* ============================================================
   CORAZÓN ARTESANO — Autenticación simulada
   Sin backend: valida contra CA_DATA.USUARIOS y guarda la
   sesión en localStorage (con respaldo en memoria).
   ============================================================ */

window.CA_Auth = (function () {
  'use strict';

  function login(email, pass, rol) {
    var usuarios = window.CA_DATA.USUARIOS;
    var u = null;
    for (var i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email.toLowerCase() === String(email).trim().toLowerCase()) { u = usuarios[i]; break; }
    }
    if (!u) return { error: 'Ese correo no está registrado en el prototipo. Usa las credenciales de demostración.' };
    if (u.pass !== pass) return { error: 'La contraseña no es correcta. Inténtalo de nuevo.' };
    if (u.rol !== rol) return { error: 'El usuario no corresponde al tipo de acceso seleccionado (' + (rol === 'admin' ? 'Administradora' : 'Artesana') + ').' };
    window.CA.iniciarSesion({
      rol: u.rol, nombre: u.nombre, email: u.email,
      artesanaId: u.artesanaId, ingreso: new Date().toISOString()
    });
    return { user: u };
  }

  /* Exige sesión (y opcionalmente un rol concreto).
     Si el rol no coincide, redirige al inicio del otro rol. */
  function requerir(rolDeseado) {
    var s = window.CA.sesion();
    if (!s) {
      window.location.replace('login.html');
      return null;
    }
    if (rolDeseado === 'admin' && s.rol !== 'admin') {
      window.location.replace('perfil-artesana.html');
      return null;
    }
    if (rolDeseado === 'artesana' && s.rol !== 'artesana') {
      window.location.replace('dashboard.html');
      return null;
    }
    return s;
  }

  function destinoDeRol(rol) {
    return rol === 'admin' ? 'dashboard.html' : 'perfil-artesana.html';
  }

  return { login: login, requerir: requerir, destinoDeRol: destinoDeRol };
})();
