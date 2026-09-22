/* ==========================================================
   Dulce Tentación — main.js
   Comportamiento general del sitio (no relacionado al carrito):
   - Link activo del navbar
   - Sesión de usuario (front-end, guardada en localStorage; sin backend)
   - Buscador de la carta (pide-aqui.html)
   - Categoría activa al hacer scroll (pide-aqui.html)
   - Cierre automático del menú móvil al navegar
   ========================================================== */

const CLAVE_USUARIOS = "dulceTentacionUsuarios";  // "base de datos" de cuentas, en este navegador
const CLAVE_SESION = "dulceTentacionSesion";      // usuario con sesión iniciada

/* ---------- Utilidades de usuarios (simulación sin servidor) ---------- */

function obtenerUsuarios() {
  const datos = localStorage.getItem(CLAVE_USUARIOS);
  return datos ? JSON.parse(datos) : [];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function obtenerUsuarioSesion() {
  const datos = localStorage.getItem(CLAVE_SESION);
  return datos ? JSON.parse(datos) : null;
}

function iniciarSesion(email, password) {
  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!usuario) return false;
  localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: usuario.nombre, email: usuario.email }));
  return true;
}

function registrarUsuario(nombre, email, password) {
  const usuarios = obtenerUsuarios();
  const existe = usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existe) return false;

  usuarios.push({ nombre, email, password });
  guardarUsuarios(usuarios);
  localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre, email }));
  return true;
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  actualizarInterfazSesion();
}

function actualizarInterfazSesion() {
  const usuario = obtenerUsuarioSesion();
  const iconoCuenta = document.getElementById("iconoCuenta");
  const panelSesion = document.getElementById("panelSesionActiva");
  const panelFormularios = document.getElementById("panelFormularios");
  const nombreSesion = document.getElementById("nombreUsuarioSesion");

  if (usuario) {
    if (iconoCuenta) {
      iconoCuenta.innerHTML = `<i class="bi bi-person-check-fill"></i>`;
      iconoCuenta.title = "Hola, " + usuario.nombre;
    }
    if (panelSesion) panelSesion.style.display = "block";
    if (panelFormularios) panelFormularios.style.display = "none";
    if (nombreSesion) nombreSesion.textContent = usuario.nombre;
  } else {
    if (iconoCuenta) {
      iconoCuenta.innerHTML = `<i class="bi bi-person"></i>`;
      iconoCuenta.title = "Mi cuenta";
    }
    if (panelSesion) panelSesion.style.display = "none";
    if (panelFormularios) panelFormularios.style.display = "block";
  }
}

/* ---------- Buscador de la carta (pide-aqui.html) ---------- */

function inicializarBuscadorCarta() {
  const input = document.getElementById("buscadorCarta");
  if (!input) return; // No estamos en pide-aqui.html

  const secciones = document.querySelectorAll("main section[id]");
  const filtros = document.getElementById("filtrosCategoria");
  const sinResultados = document.getElementById("sinResultadosCarta");

  input.addEventListener("input", () => {
    const termino = input.value.trim().toLowerCase();
    let hayResultados = false;

    if (filtros) filtros.style.display = termino ? "none" : "flex";

    secciones.forEach((seccion) => {
      let seccionTieneResultados = false;

      seccion.querySelectorAll(".tarjeta-producto").forEach((tarjeta) => {
        const nombre = tarjeta.querySelector(".nombre")?.textContent.toLowerCase() || "";
        const coincide = !termino || nombre.includes(termino);
        const columna = tarjeta.closest(".col-6, .col-md-3") || tarjeta;
        columna.style.display = coincide ? "" : "none";
        if (coincide) {
          seccionTieneResultados = true;
          hayResultados = true;
        }
      });

      seccion.style.display = !termino || seccionTieneResultados ? "" : "none";
    });

    if (sinResultados) sinResultados.style.display = termino && !hayResultados ? "block" : "none";
  });
}

/* ---------- Categoría activa al hacer scroll ---------- */

function inicializarCategoriaActiva() {
  const secciones = document.querySelectorAll("main section[id]");
  const enlaces = document.querySelectorAll(".filtro-categoria");
  if (secciones.length === 0 || enlaces.length === 0) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        enlaces.forEach((enlace) => {
          enlace.classList.toggle("active", enlace.getAttribute("href") === "#" + entrada.target.id);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );

  secciones.forEach((seccion) => observador.observe(seccion));
}

/* ---------- Inicialización general ---------- */

document.addEventListener("DOMContentLoaded", () => {
  // Marca como activo el link del navbar que corresponde a la página actual
  const rutaActual = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar-dulce .nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === rutaActual) {
      link.classList.add("active");
    }
  });

  // Cierra el menú móvil al elegir una opción
  const menu = document.getElementById("menuPrincipal");
  if (menu) {
    menu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (menu.classList.contains("show") && window.bootstrap) {
          bootstrap.Collapse.getOrCreateInstance(menu).hide();
        }
      });
    });
  }

  // Sesión de usuario
  actualizarInterfazSesion();

  const formLogin = document.getElementById("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", (evento) => {
      evento.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      const error = document.getElementById("loginError");

      if (iniciarSesion(email, password)) {
        error.style.display = "none";
        formLogin.reset();
        actualizarInterfazSesion();
      } else {
        error.style.display = "block";
      }
    });
  }

  const formRegistro = document.getElementById("formRegistro");
  if (formRegistro) {
    formRegistro.addEventListener("submit", (evento) => {
      evento.preventDefault();
      const nombre = document.getElementById("registroNombre").value.trim();
      const email = document.getElementById("registroEmail").value.trim();
      const password = document.getElementById("registroPassword").value;
      const error = document.getElementById("registroError");

      if (registrarUsuario(nombre, email, password)) {
        error.style.display = "none";
        formRegistro.reset();
        actualizarInterfazSesion();
      } else {
        error.style.display = "block";
      }
    });
  }

  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", cerrarSesion);
  }

  // Carta
  inicializarBuscadorCarta();
  inicializarCategoriaActiva();
});
