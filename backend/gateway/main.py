"""API Gateway — Dulce Tentación (puerto 8000).

Recibe todas las peticiones del frontend y las redirige, de forma asíncrona
con httpx.AsyncClient, a la API backend que corresponda.
"""
import httpx
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="API Gateway - Dulce Tentación")

# Permite que el frontend (GitHub Pages o archivo local) llame al gateway
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# prefijo de ruta -> host del backend
RUTAS = {
    "productos": "http://localhost:8001",
    "pedidos": "http://localhost:8002",
}

# Headers que no se deben reenviar tal cual
HEADERS_EXCLUIDOS = {"host", "content-length", "connection", "transfer-encoding"}


@app.get("/")
async def raiz():
    return {"servicio": "gateway", "rutas": RUTAS}


@app.api_route("/{servicio}/{ruta:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
@app.api_route("/{servicio}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def redirigir(servicio: str, request: Request, ruta: str = ""):
    host = RUTAS.get(servicio)
    if host is None:
        return Response(content='{"detail":"Servicio no encontrado"}',
                        status_code=404, media_type="application/json")

    url = f"{host}/{servicio}" + (f"/{ruta}" if ruta else "")
    headers = {k: v for k, v in request.headers.items() if k.lower() not in HEADERS_EXCLUIDOS}
    cuerpo = await request.body()

    try:
        async with httpx.AsyncClient(timeout=10.0) as cliente:
            respuesta = await cliente.request(
                request.method, url,
                params=request.query_params,
                content=cuerpo,
                headers=headers,
            )
    except httpx.ConnectError:
        return Response(content='{"detail":"Backend no disponible"}',
                        status_code=502, media_type="application/json")
    except httpx.TimeoutException:
        return Response(content='{"detail":"Backend no respondió a tiempo"}',
                        status_code=504, media_type="application/json")

    return Response(
        content=respuesta.content,
        status_code=respuesta.status_code,
        media_type=respuesta.headers.get("content-type"),
    )
