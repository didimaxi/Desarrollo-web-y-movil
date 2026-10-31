const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const clp = n => '$' + n.toLocaleString('es-CL');
const norm = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const CATEGORIAS = {
  tortas: 'Tortas',
  pasteles: 'Pasteles',
  calientes: 'Bebestibles calientes',
  frias: 'Bebestibles frías',
  sandwich: 'Sándwiches',
  galletas: 'Galletas'
};

let PRODUCTOS = [];

/* Carrito (localStorage) */
const Carrito = {
  get() {
    try { return JSON.parse(localStorage.getItem('dt_carrito')) || []; } catch { return []; }
  },
  set(items) {
    localStorage.setItem('dt_carrito', JSON.stringify(items));
    actualizarBadge();
  },
  agregar(p) {
    const items = this.get();
    const linea = items.find(i => i.id === p.id);
    if (linea) linea.cant++;
    else items.push({ id: p.id, nombre: p.nombre, precio: p.precio, emoji: p.emoji, cant: 1 });
    this.set(items);
  },
  cambiar(id, d) {
    this.set(this.get().map(i => i.id === id ? { ...i, cant: i.cant + d } : i).filter(i => i.cant > 0));
  },
  quitar(id) { this.set(this.get().filter(i => i.id !== id)); },
  vaciar() { this.set([]); },
  total() { return this.get().reduce((s, i) => s + i.precio * i.cant, 0); }
};

function actualizarBadge() {
  const n = Carrito.get().reduce((s, i) => s + i.cant, 0);
  $$('.badge-carrito').forEach(b => { b.textContent = n || ''; });
}

function mostrarToast(texto) {
  const t = document.createElement('div');
  t.className = 'toast align-items-center text-bg-dark border-0';
  t.innerHTML = `<div class="d-flex"><div class="toast-body">${texto}</div>
    <button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button></div>`;
  $('#toasts').append(t);
  t.addEventListener('hidden.bs.toast', () => t.remove());
  new bootstrap.Toast(t, { delay: 2200 }).show();
}

/* Navbar, footer y modal de ingreso */
function renderLayout() {
  const actual = location.pathname.split('/').pop() || 'index.html';
  const link = (href, texto) =>
    `<li class="nav-item"><a class="nav-link ${actual === href ? 'active' : ''}" href="${href}">${texto}</a></li>`;

  $('#navbar').innerHTML = `
  <nav class="navbar navbar-expand-md navbar-dt">
    <div class="container">
      <a class="logo d-md-none" href="index.html" aria-label="Dulce Tentación, inicio">Dulce<br>Tentación</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu" aria-label="Abrir menú">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse align-items-md-center" id="menu">
        <ul class="navbar-nav flex-fill">${link('index.html', 'Inicio')}${link('tortas.html', 'Tortas')}${link('carta.html', 'Carta')}</ul>
        <a class="logo d-none d-md-flex" href="index.html" aria-label="Dulce Tentación, inicio">Dulce<br>Tentación</a>
        <div class="d-flex flex-fill align-items-center justify-content-md-end gap-3 py-2 py-md-0">
          <a class="btn btn-pide" href="carta.html">Pide aquí</a>
          <a class="icono" href="carta.html" aria-label="Buscar en la carta"><i class="bi bi-search"></i></a>
          <a class="icono" href="carrito.html" aria-label="Carrito"><i class="bi bi-cart3"></i><span class="badge-carrito"></span></a>
          <button class="icono" type="button" data-bs-toggle="modal" data-bs-target="#modal-login" aria-label="Ingresar"><i class="bi bi-person"></i></button>
        </div>
      </div>
    </div>
  </nav>`;

  $('#footer').innerHTML = `
  <div class="footer-dt"><div class="container">
    <div class="row g-4">
      <div class="col-12 col-md-6">
        <h2 class="h5">Contactos</h2>
        <ul>
          <li><i class="bi bi-telephone"></i> +569 6767 11 11</li>
          <li><i class="bi bi-instagram"></i> @dulce_tentacion</li>
          <li><i class="bi bi-envelope"></i> dulce.tentacion@gmail.com</li>
        </ul>
      </div>
      <div class="col-12 col-md-6">
        <h2 class="h5">Nosotros</h2>
        <ul>
          <li><a href="nosotros.html#despacho">Despacho</a></li>
          <li><a href="nosotros.html#terminos">Términos y condiciones</a></li>
          <li><a href="nosotros.html#privacidad">Política y privacidad</a></li>
        </ul>
      </div>
    </div>
    <p class="small text-center mt-4 mb-0">© 2026 Dulce Tentación</p>
  </div></div>`;

  document.body.insertAdjacentHTML('beforeend', `
  <div id="toasts" class="toast-container position-fixed bottom-0 end-0 p-3"></div>
  <div class="modal fade" id="modal-login" tabindex="-1" aria-labelledby="titulo-login" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered"><form class="modal-content" id="form-login">
      <div class="modal-header"><h2 class="modal-title h5" id="titulo-login">Ingresar</h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button></div>
      <div class="modal-body">
        <label class="form-label" for="login-email">Correo</label>
        <input class="form-control mb-3" id="login-email" type="email" required>
        <label class="form-label" for="login-clave">Contraseña</label>
        <input class="form-control" id="login-clave" type="password" required minlength="6">
        <p class="small mt-3 mb-0">Sesión simulada: no se guarda la contraseña.</p>
      </div>
      <div class="modal-footer"><button class="btn btn-dt" type="submit">Ingresar</button></div>
    </form></div>
  </div>`);

  $('#form-login').onsubmit = e => {
    e.preventDefault();
    localStorage.setItem('dt_usuario', $('#login-email').value);
    bootstrap.Modal.getInstance($('#modal-login')).hide();
    mostrarToast('Sesión iniciada');
  };
}

/* Tarjeta de producto */
function tarjeta(p) {
  return `<div class="col-6 col-md-4 col-lg-3"><article class="tarjeta">
    <div class="tarjeta-img" aria-hidden="true">${p.emoji}</div>
    <div class="tarjeta-cuerpo">
      <h3>${p.nombre}</h3>
      <p class="desc">${p.descripcion}</p>
      <div class="tarjeta-pie">
        <span class="precio">${clp(p.precio)}</span>
        <button class="btn btn-dt btn-sm" data-add="${p.id}">Agregar</button>
      </div>
    </div>
  </article></div>`;
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-add]');
  if (!b) return;
  const p = PRODUCTOS.find(x => x.id === +b.dataset.add);
  Carrito.agregar(p);
  mostrarToast(`${p.nombre} agregado al carrito`);
});

/* Carga con estados: cargando, error con reintento y contenido */
async function cargar(render) {
  const estado = $('#estado'), contenido = $('#contenido');
  contenido.classList.add('d-none');
  estado.innerHTML = `<div class="estado" role="status"><div class="spinner-border"></div><p class="mb-0">Cargando productos…</p></div>`;
  try {
    PRODUCTOS = await API.getProductos();
    estado.innerHTML = '';
    contenido.classList.remove('d-none');
    render(PRODUCTOS);
  } catch (err) {
    estado.innerHTML = `<div class="alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-2" role="alert">
      <span>${err.message}</span><button class="btn btn-dt btn-sm" id="reintentar">Reintentar</button></div>`;
    $('#reintentar').onclick = () => cargar(render);
  }
}

/* Páginas */
function initIndex() {
  cargar(productos => {
    const destacados = productos.filter(p => p.destacado);
    $('#carrusel').innerHTML = `
    <div id="best" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">${destacados.map((p, i) => `
        <div class="carousel-item ${i ? '' : 'active'}"><div class="slide">
          <span class="slide-emoji" aria-hidden="true">${p.emoji}</span>
          <h3 class="mb-0">${p.nombre}</h3><p class="mb-0">${clp(p.precio)}</p>
        </div></div>`).join('')}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#best" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span><span class="visually-hidden">Anterior</span></button>
      <button class="carousel-control-next" type="button" data-bs-target="#best" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span><span class="visually-hidden">Siguiente</span></button>
    </div>`;
    $('#grilla').innerHTML = productos.filter(p => p.categoria === 'tortas').map(tarjeta).join('');
  });
}

function initTortas() {
  cargar(productos => {
    const tortas = productos.filter(p => p.categoria === 'tortas');
    const pintar = orden => {
      const lista = [...tortas];
      if (orden === 'menor') lista.sort((a, b) => a.precio - b.precio);
      if (orden === 'mayor') lista.sort((a, b) => b.precio - a.precio);
      $('#lista').innerHTML = lista.map(tarjeta).join('');
    };
    $('#orden').onchange = e => pintar(e.target.value);
    pintar('');
  });
}

function initCarta() {
  cargar(productos => {
    let cat = 'todas', q = '';
    const chips = $('#chips'), lista = $('#lista');
    chips.innerHTML = ['todas', ...Object.keys(CATEGORIAS)]
      .map(c => `<button class="chip" data-cat="${c}">${c === 'todas' ? 'Todas' : CATEGORIAS[c]}</button>`).join('');

    const pintar = () => {
      $$('.chip', chips).forEach(b => b.classList.toggle('activo', b.dataset.cat === cat));
      const r = productos.filter(p => (cat === 'todas' || p.categoria === cat) && norm(p.nombre).includes(q));
      lista.innerHTML = r.length
        ? r.map(tarjeta).join('')
        : '<div class="estado col-12"><p class="mb-0">No hay productos con ese filtro. Prueba con otra categoría o palabra.</p></div>';
    };
    chips.onclick = e => {
      const b = e.target.closest('[data-cat]');
      if (b) { cat = b.dataset.cat; pintar(); }
    };
    $('#buscar').oninput = e => { q = norm(e.target.value.trim()); pintar(); };
    pintar();
  });
}

function initCarrito() {
  const lista = $('#lineas'), form = $('#form-pedido'), msg = $('#mensaje');
  form.email.value = localStorage.getItem('dt_usuario') || '';

  const pintar = () => {
    const items = Carrito.get();
    $('#vacio').classList.toggle('d-none', items.length > 0);
    $('#con-items').classList.toggle('d-none', !items.length);
    lista.innerHTML = items.map(i => `
      <div class="linea">
        <span class="emoji" aria-hidden="true">${i.emoji}</span>
        <div class="info"><strong>${i.nombre}</strong><div>${clp(i.precio)}</div></div>
        <div class="cantidad">
          <button class="btn btn-sm btn-outline-secondary" data-cant="${i.id}" data-d="-1" aria-label="Quitar una unidad">−</button>
          <span>${i.cant}</span>
          <button class="btn btn-sm btn-outline-secondary" data-cant="${i.id}" data-d="1" aria-label="Agregar una unidad">+</button>
        </div>
        <button class="btn btn-sm" data-del="${i.id}" aria-label="Eliminar ${i.nombre}"><i class="bi bi-trash"></i></button>
      </div>`).join('');
    $('#total').textContent = clp(Carrito.total());
  };

  lista.onclick = e => {
    const c = e.target.closest('[data-cant]'), d = e.target.closest('[data-del]');
    if (c) Carrito.cambiar(+c.dataset.cant, +c.dataset.d);
    if (d) Carrito.quitar(+d.dataset.del);
    pintar();
  };

  form.tipo.onchange = () => {
    const despacho = form.tipo.value === 'despacho';
    form.direccion.required = despacho;
    $('#campo-dir').classList.toggle('d-none', !despacho);
  };

  form.onsubmit = async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    const btn = $('#btn-confirmar');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Enviando pedido…';
    try {
      const r = await API.crearPedido({ cliente: Object.fromEntries(new FormData(form)), items: Carrito.get(), total: Carrito.total() });
      Carrito.vaciar();
      form.reset();
      form.classList.remove('was-validated');
      msg.innerHTML = `<div class="alert alert-success" role="status">Pedido ${r.id} confirmado. Te enviaremos el detalle por correo.</div>`;
    } catch (err) {
      msg.innerHTML = `<div class="alert alert-danger" role="alert">${err.message}. Tu carrito sigue guardado: vuelve a confirmar el pedido.</div>`;
    }
    btn.disabled = false;
    btn.textContent = 'Confirmar pedido';
    pintar();
  };

  pintar();
}

document.addEventListener('DOMContentLoaded', () => {
  renderLayout();
  actualizarBadge();
  const inicio = { index: initIndex, tortas: initTortas, carta: initCarta, carrito: initCarrito }[document.body.dataset.pagina];
  if (inicio) inicio();
});
