/* ============================================================
   CORAZÓN ARTESANO — Ingreso simulado
   Valida contra los usuarios de demostración y redirige al
   panel correspondiente según el rol.
   ============================================================ */

(function () {
  'use strict';

  var CA = window.CA;

  /* Si ya hay sesión activa, ir directo al destino del rol */
  var ses = CA.sesion();
  if (ses) {
    window.location.replace(window.CA_Auth.destinoDeRol(ses.rol));
    return;
  }

  var form = document.getElementById('form-login');
  var errorBox = document.getElementById('login-error');
  var errorTxt = document.getElementById('login-error-text');

  function mostrarError(msg) {
    errorTxt.textContent = msg;
    errorBox.classList.add('show');
  }
  function limpiarError() {
    errorBox.classList.remove('show');
  }

  function rolSeleccionado() {
    var r = document.querySelector('input[name="rol"]:checked');
    return r ? r.value : 'admin';
  }

  /* Botones "Usar" de credenciales demo */
  CA.$$('[data-rol]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var rol = btn.getAttribute('data-rol');
      var credenciales = {
        admin: { email: 'admin@corazonartesano.co', pass: 'admin123' },
        artesana: { email: 'artesana@corazonartesano.co', pass: 'artesana123' }
      }[rol];
      document.getElementById('email').value = credenciales.email;
      document.getElementById('password').value = credenciales.pass;
      document.querySelector('input[name="rol"][value="' + rol + '"]').checked = true;
      limpiarError();
      CA.toast('Credenciales de ' + (rol === 'admin' ? 'Administradora' : 'Artesana') + ' cargadas. Pulsa Ingresar.', 'info');
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    limpiarError();

    var email = document.getElementById('email');
    var pass = document.getElementById('password');
    var valido = true;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.closest('.field').classList.add('has-error');
      valido = false;
    } else {
      email.closest('.field').classList.remove('has-error');
    }
    if (pass.value.length < 4) {
      pass.closest('.field').classList.add('has-error');
      valido = false;
    } else {
      pass.closest('.field').classList.remove('has-error');
    }
    if (!valido) {
      mostrarError('Revisa los campos marcados en rojo.');
      return;
    }

    var res = window.CA_Auth.login(email.value, pass.value, rolSeleccionado());
    if (res.error) {
      mostrarError(res.error);
      return;
    }
    CA.toast('Bienvenida, ' + res.user.nombre + '. Redirigiendo a tu panel…', 'success', 'Ingreso exitoso');
    setTimeout(function () {
      window.location.href = window.CA_Auth.destinoDeRol(res.user.rol);
    }, 650);
  });

  CA.$$('input').forEach(function (inp) {
    inp.addEventListener('input', function () {
      inp.closest('.field').classList.remove('has-error');
    });
  });
})();
