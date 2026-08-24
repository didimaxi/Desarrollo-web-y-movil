// ============================================
// SEMANA 3 - app.js
// Simulación de datos de una API + manipulación del DOM
// ============================================

// 1. "Base de datos" 
const juegos = [
  {
    id: 1,
    nombre: "Clash Royale",
    categoria: "Estrategia",
    plataforma: "Mobile",
    precio: 0,
    imagen: "img/clash-royale.jpg",
    descripcion: "Batallas 1vs1 en tiempo real combinando cartas, torres y estrategia."
  },
  {
    id: 2,
    nombre: "Deep Rock Galactic",
    categoria: "Cooperativo",
    plataforma: "PC",
    precio: 29990,
    imagen: "img/deep-rock-galactic.jpg",
    descripcion: "Shooter cooperativo de minería espacial en cuevas generadas proceduralmente."
  },
  {
    id: 3,
    nombre: "Valorant",
    categoria: "Shooter",
    plataforma: "PC",
    precio: 0,
    imagen: "img/valorant.jpg",
    descripcion: "Shooter táctico 5vs5 con habilidades únicas por personaje."
  },
  {
    id: 4,
    nombre: "Stardew Valley",
    categoria: "Simulación",
    plataforma: "Multiplataforma",
    precio: 8990,
    imagen: "img/stardew-valley.jpg",
    descripcion: "Simulador de granja, vida rural y relaciones con el pueblo."
  },
  {
    id: 5,
    nombre: "Hollow Knight",
    categoria: "Aventura",
    plataforma: "Multiplataforma",
    precio: 11990,
    imagen: "img/hollow-knight.jpg",
    descripcion: "Metroidvania en un reino subterráneo de insectos, con combate y exploración."
  }
];

// ============================================
// 2. Función flecha para crear una card de Bootstrap por cada juego
// ============================================
const crearCardJuego = (juego) => {
  const col = document.createElement("div");
  col.className = "col-md-4 mb-4";

  const card = document.createElement("div");
  card.className = "card h-100 shadow-sm";

  const img = document.createElement("img");
  img.src = juego.imagen;
  img.className = "card-img-top";
  img.alt = juego.nombre;
  img.onerror = () => { img.src = "https://via.placeholder.com/300x180?text=" + encodeURIComponent(juego.nombre); };

  const body = document.createElement("div");
  body.className = "card-body d-flex flex-column";

  const titulo = document.createElement("h5");
  titulo.className = "card-title";
  titulo.textContent = juego.nombre;

  const badge = document.createElement("span");
  badge.className = "badge bg-secondary mb-2";
  badge.style.width = "fit-content";
  badge.textContent = juego.categoria;

  const desc = document.createElement("p");
  desc.className = "card-text flex-grow-1";
  desc.textContent = juego.descripcion;

  const precio = document.createElement("p");
  precio.className = "fw-bold";
  precio.textContent = juego.precio === 0 ? "Gratis" : `$${juego.precio.toLocaleString("es-CL")}`;

  const boton = document.createElement("button");
  boton.className = "btn btn-primary mt-auto";
  boton.textContent = "Ver más";
  boton.addEventListener("click", () => alert(`${juego.nombre} (${juego.plataforma})\n${juego.descripcion}`));

  body.append(titulo, badge, desc, precio, boton);
  card.append(img, body);
  col.appendChild(card);

  return col;
};

// ============================================
// 3. Renderiza el listado completo de juegos en el contenedor
// ============================================
const renderizarJuegos = (listaJuegos) => {
  const contenedor = document.getElementById("contenedor-productos");
  contenedor.innerHTML = ""; // limpia antes de volver a pintar

  if (listaJuegos.length === 0) {
    contenedor.innerHTML = `<p class="text-center text-muted">No hay juegos en esta categoría.</p>`;
    return;
  }

  listaJuegos.forEach((juego) => {
    const card = crearCardJuego(juego);
    contenedor.appendChild(card);
  });
};

// ============================================
// 4. ComboBox dinámico
// ============================================
const crearComboBoxCategorias = () => {
  const select = document.getElementById("filtro-categoria");

  // opción por defecto
  const opcionTodas = document.createElement("option");
  opcionTodas.value = "todas";
  opcionTodas.textContent = "Todas las categorías";
  select.appendChild(opcionTodas);

  // categorías únicas usando un Set
  const categoriasUnicas = [...new Set(juegos.map((j) => j.categoria))];

  categoriasUnicas.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    select.appendChild(option);
  });

  select.addEventListener("change", (e) => {
    const valor = e.target.value;
    const filtrados = valor === "todas"
      ? juegos
      : juegos.filter((j) => j.categoria === valor);
    renderizarJuegos(filtrados);
  });
};

// ============================================
// 5. Inicialización al cargar la página
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  crearComboBoxCategorias();
  renderizarJuegos(juegos);

  // botón "Cargar juegos" (simula el llamado a la API)
  const btnCargar = document.getElementById("btn-cargar-productos");
  if (btnCargar) {
    btnCargar.addEventListener("click", () => renderizarJuegos(juegos));
  }
});
