# Backend Dulce Tentación (FastAPI)

- `api_productos/` → puerto 8001
- `api_pedidos/`   → puerto 8002
- `gateway/`       → puerto 8000 (único punto de entrada)

## Instalación (una vez)
    pip install fastapi uvicorn httpx

## Ejecutar (una terminal por servicio)
    cd api_productos ; uvicorn main:app --port 8001
    cd api_pedidos   ; uvicorn main:app --port 8002
    cd gateway       ; uvicorn main:app --port 8000

## Probar (siempre a través del gateway)
    http://localhost:8000/productos
    http://localhost:8000/productos?categoria=tortas
    http://localhost:8000/productos/13
    POST http://localhost:8000/pedidos   (docs de cada API en /docs de su puerto)

Ejemplo de body para POST /pedidos:
    {"cliente":"Esteban","items":[{"nombre":"Cappuccino","precio":2500,"cantidad":2}]}
