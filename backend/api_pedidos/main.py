"""API de Pedidos — Dulce Tentación (puerto 8002)."""
from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="API Pedidos - Dulce Tentación")


class ItemPedido(BaseModel):
    nombre: str
    precio: int = Field(gt=0)
    cantidad: int = Field(gt=0)


class PedidoNuevo(BaseModel):
    cliente: str
    items: list[ItemPedido] = Field(min_length=1)


class Pedido(PedidoNuevo):
    id: int
    total: int
    fecha: str


PEDIDOS: list[Pedido] = []


@app.get("/")
def raiz():
    return {"servicio": "pedidos", "puerto": 8002}


@app.post("/pedidos", response_model=Pedido, status_code=201)
def crear(nuevo: PedidoNuevo):
    total = sum(i.precio * i.cantidad for i in nuevo.items)
    pedido = Pedido(
        id=len(PEDIDOS) + 1,
        total=total,
        fecha=datetime.now().isoformat(timespec="seconds"),
        **nuevo.model_dump(),
    )
    PEDIDOS.append(pedido)
    return pedido


@app.get("/pedidos", response_model=list[Pedido])
def listar():
    return PEDIDOS


@app.get("/pedidos/{pedido_id}", response_model=Pedido)
def obtener(pedido_id: int):
    for p in PEDIDOS:
        if p.id == pedido_id:
            return p
    raise HTTPException(status_code=404, detail="Pedido no encontrado")
