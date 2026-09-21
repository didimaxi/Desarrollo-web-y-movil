# Guía API Gateway (hasta la página 6)

Laboratorio de API Gateway con FastAPI. Se simulan los dos hosts en un solo PC usando `127.0.0.1` y puertos distintos.

- `backend-api/`: API de negocio (`/health`, `/products`, `/orders`), puerto 9000.
- `api-gateway/`: API Gateway básico (`/api/products`, `/api/orders`), puerto 8000. Reenvía las solicitudes al backend.

Flujo: `Cliente -> API Gateway (:8000) -> Backend API (:9000)`

## Cómo ejecutar (Windows PowerShell)

Terminal 1, backend:

```powershell
cd backend-api
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn backend_api:app --host 127.0.0.1 --port 9000
```

Terminal 2, gateway:

```powershell
cd api-gateway
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn gateway:app --host 127.0.0.1 --port 8000
```

## Probar

- Backend directo: http://127.0.0.1:9000/products
- A través del gateway: http://127.0.0.1:8000/api/products y http://127.0.0.1:8000/api/orders
