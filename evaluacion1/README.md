# Dulce Tentación – Evaluación 1 (Front-End responsivo)

**Caso:** sitio web de ventas en línea para Dulce Tentación (pastelería/cafetería).
**Actor:** cliente que quiere pedir tortas y productos de la carta.
**Flujo implementado:** consultar catálogo → filtrar/buscar → agregar al carrito → completar datos → confirmar pedido.
**Integrantes:** _completar_

## Requisitos abordados
- Catálogo con categorías (tortas, pasteles, bebestibles calientes y frías, sándwiches, galletas).
- Búsqueda y filtro por categoría; orden por precio en tortas.
- Carrito con cantidades, total y formulario validado (retiro o despacho).
- Estados de carga, éxito, error con reintento y vacío.

## Ejecución
Los datos se leen con `fetch`, así que hay que servir la carpeta por HTTP (no abrir el archivo directo):
```
cd Frontend
python -m http.server 5500
```
Luego abrir `http://localhost:5500` (o usar Live Server en VS Code).

## Servicios simulados (`js/api.js`)
| Servicio | Tipo | Fuente |
|---|---|---|
| `API.getProductos()` | Consulta | `data/productos.json` con latencia simulada |
| `API.crearPedido(pedido)` | Acción | Respuesta simulada con id de pedido |

Para probar errores, abrir en una pestaña nueva: `carta.html?fallo=catalogo` o `carrito.html?fallo=pedido`. Falla una vez por sesión; "Reintentar" o volver a confirmar funciona.

## Estructura
- `index.html`, `tortas.html`, `carta.html`, `carrito.html`, `nosotros.html`
- `css/estilos.css` · `js/api.js` · `js/main.js` · `data/productos.json` · `img/`

## Diseño previo
Boceto y anotaciones: _agregar en `docs/` (foto del boceto)._

## Prueba responsiva
| Ancho | Qué cambia |
|---|---|
| 360 px (móvil) | _completar_ |
| 576 px | _completar_ |
| 768 px (tablet) | _completar_ |
| 1280 px (escritorio) | _completar_ |
