/* ==========================================================
   Dulce Tentación — carrito.js
   Maneja el carrito de compras usando localStorage.
   Se incluye en todas las páginas para que el contador del
   navbar y el botón "Agregar" funcionen en cualquier parte.
   ========================================================== */

const CLAVE_CARRITO = "dulceTentacionCarrito";

function obtenerCarrito() {
  const datos = localStorage.getItem(CLAVE_CARRITO);
  return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function agregarAlCarrito(nombre, precio) {
  const carrito = obtenerCarrito();
  const existente = carrito.find((item) => item.nombre === nombre);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
  }

  guardarCarrito(carrito);
}

function quitarDelCarrito(nombre) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter((item) => item.nombre !== nombre);
  guardarCarrito(carrito);
  renderizarCarrito();
}

function cambiarCantidad(nombre, delta) {
  const carrito = obtenerCarrito();
  const item = carrito.find((i) => i.nombre === nombre);
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    quitarDelCarrito(nombre);
    return;
  }

  guardarCarrito(carrito);
  renderizarCarrito();
}

function vaciarCarrito() {
  localStorage.removeItem(CLAVE_CARRITO);
  actualizarContadorCarrito();
  renderizarCarrito();
}

function formatearPrecio(numero) {
  return "$" + numero.toLocaleString("es-CL");
}

function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  const contador = document.getElementById("contadorCarrito");
  if (!contador) return;

  if (totalItems > 0) {
    contador.textContent = totalItems;
    contador.style.display = "inline-block";
  } else {
    contador.style.display = "none";
  }
}

/* ---------- Pintar la tabla de carrito.html ---------- */

function renderizarCarrito() {
  const filas = document.getElementById("filasCarrito");
  if (!filas) return; // No estamos en carrito.html

  const carrito = obtenerCarrito();
  const vacio = document.getElementById("carritoVacio");
  const conProductos = document.getElementById("carritoConProductos");

  if (carrito.length === 0) {
    vacio.style.display = "block";
    conProductos.style.display = "none";
    return;
  }

  vacio.style.display = "none";
  conProductos.style.display = "block";

  filas.innerHTML = "";
  let total = 0;

  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${item.nombre}</td>
      <td>${formatearPrecio(item.precio)}</td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary btn-restar" data-nombre="${item.nombre}">-</button>
          <span>${item.cantidad}</span>
          <button class="btn btn-sm btn-outline-secondary btn-sumar" data-nombre="${item.nombre}">+</button>
        </div>
      </td>
      <td>${formatearPrecio(subtotal)}</td>
      <td><button class="btn btn-sm btn-outline-danger btn-quitar" data-nombre="${item.nombre}"><i class="bi bi-trash"></i></button></td>
    `;
    filas.appendChild(fila);
  });

  document.getElementById("subtotalCarrito").textContent = formatearPrecio(total);
  document.getElementById("totalCarrito").textContent = formatearPrecio(total);

  filas.querySelectorAll(".btn-sumar").forEach((btn) => {
    btn.addEventListener("click", () => cambiarCantidad(btn.dataset.nombre, 1));
  });
  filas.querySelectorAll(".btn-restar").forEach((btn) => {
    btn.addEventListener("click", () => cambiarCantidad(btn.dataset.nombre, -1));
  });
  filas.querySelectorAll(".btn-quitar").forEach((btn) => {
    btn.addEventListener("click", () => quitarDelCarrito(btn.dataset.nombre));
  });
}

/* ---------- Pedido por WhatsApp (sin backend) ---------- */

const NUMERO_WHATSAPP = "56967671111"; // +569 6767 11 11, sin espacios ni símbolos

function construirMensajeWhatsapp() {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) return null;

  let total = 0;
  const lineas = carrito.map((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    return `• ${item.cantidad}x ${item.nombre} — ${formatearPrecio(subtotal)}`;
  });

  const usuario = obtenerUsuarioSesion ? obtenerUsuarioSesion() : null;
  const saludoNombre = usuario ? usuario.nombre : "";

  const mensaje =
    `¡Hola Dulce Tentación! ${saludoNombre ? "Soy " + saludoNombre + ". " : ""}Quiero hacer este pedido:\n\n` +
    lineas.join("\n") +
    `\n\nTotal: ${formatearPrecio(total)}\n\n(Pedido generado desde el sitio web)`;

  return mensaje;
}

function enviarPedidoPorWhatsapp() {
  const mensaje = construirMensajeWhatsapp();
  if (!mensaje) return;
  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

/* ---------- Botones "Agregar" en cualquier página ---------- */

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
  renderizarCarrito();

  document.querySelectorAll(".btn-agregar").forEach((boton) => {
    boton.addEventListener("click", () => {
      const nombre = boton.dataset.nombre;
      const precio = parseInt(boton.dataset.precio, 10);
      agregarAlCarrito(nombre, precio);

      const textoOriginal = boton.textContent;
      boton.textContent = "Agregado ✓";
      setTimeout(() => { boton.textContent = textoOriginal; }, 900);
    });
  });

  const btnVaciar = document.getElementById("btnVaciarCarrito");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      if (confirm("¿Vaciar todo el carrito?")) vaciarCarrito();
    });
  }

  const btnWhatsapp = document.getElementById("btnPedirWhatsapp");
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener("click", enviarPedidoPorWhatsapp);
  }
});
