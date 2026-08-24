<?php
// productos.php - Semana 3

?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mis Juegos - Productos</title>

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

  <!-- ===================== NAVBAR ===================== -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="index.php">MisJuegos</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav me-auto">
          <li class="nav-item"><a class="nav-link" href="index.php">Inicio</a></li>
          <li class="nav-item"><a class="nav-link active" href="productos.php">Juegos</a></li>
          <li class="nav-item"><a class="nav-link" href="contacto.php">Contacto</a></li>
        </ul>
        <!-- Botón que abre el modal de login -->
        <button class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#modalLogin">
          Iniciar sesión
        </button>
      </div>
    </div>
  </nav>

  <!-- ===================== CARRUSEL ===================== -->
  <div id="carruselJuegos" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#carruselJuegos" data-bs-slide-to="0" class="active"></button>
      <button type="button" data-bs-target="#carruselJuegos" data-bs-slide-to="1"></button>
      <button type="button" data-bs-target="#carruselJuegos" data-bs-slide-to="2"></button>
    </div>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img src="img/banner1.jpg" class="d-block w-100" alt="Banner 1" style="max-height:400px;object-fit:cover;">
        <div class="carousel-caption d-none d-md-block">
          <h5>Los mejores juegos, en un solo lugar</h5>
        </div>
      </div>
      <div class="carousel-item">
        <img src="img/banner2.jpg" class="d-block w-100" alt="Banner 2" style="max-height:400px;object-fit:cover;">
        <div class="carousel-caption d-none d-md-block">
          <h5>Nuevos lanzamientos cada semana</h5>
        </div>
      </div>
      <div class="carousel-item">
        <img src="img/banner3.jpg" class="d-block w-100" alt="Banner 3" style="max-height:400px;object-fit:cover;">
        <div class="carousel-caption d-none d-md-block">
          <h5>Ofertas exclusivas para miembros</h5>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carruselJuegos" data-bs-slide="prev">
      <span class="carousel-control-prev-icon"></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carruselJuegos" data-bs-slide="next">
      <span class="carousel-control-next-icon"></span>
    </button>
  </div>

  <!-- ===================== CONTENIDO PRINCIPAL ===================== -->
  <div class="container my-5">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <h2 class="m-0">Catálogo de Juegos</h2>

      <div class="d-flex align-items-center gap-2">
        <!-- ComboBox: se llena dinámicamente desde app.js -->
        <select id="filtro-categoria" class="form-select"></select>

        <!-- Botón que "carga" los productos (simula llamado a API) -->
        <button id="btn-cargar-productos" class="btn btn-success">Cargar juegos</button>
      </div>
    </div>

    <div id="contenedor-productos" class="row"></div>
  </div>

  <!-- ===================== MODAL LOGIN ===================== -->
  <div class="modal fade" id="modalLogin" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Iniciar sesión</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="formLogin">
            <div class="mb-3">
              <label for="loginEmail" class="form-label">Correo electrónico</label>
              <input type="email" class="form-control" id="loginEmail" required>
            </div>
            <div class="mb-3">
              <label for="loginPassword" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="loginPassword" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Ingresar</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- ===================== FOOTER ===================== -->
  <footer class="bg-dark text-light text-center py-4 mt-5">
    <div class="container">
      <p class="mb-1">&copy; <?php echo date("Y"); ?> MisJuegos. Todos los derechos reservados.</p>
      <p class="mb-0 small">Proyecto académico - Semana 3</p>
    </div>
  </footer>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <!-- Nuestro script con la lógica dinámica -->
  <script src="js/app.js"></script>

  <script>
    document.getElementById("formLogin").addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Login simulado correctamente ✅");
      bootstrap.Modal.getInstance(document.getElementById("modalLogin")).hide();
    });
  </script>

</body>
</html>
