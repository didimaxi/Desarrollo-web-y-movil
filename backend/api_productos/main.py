"""API de Productos — Dulce Tentación (puerto 8001)."""
from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="API Productos - Dulce Tentación")


class Producto(BaseModel):
    id: int
    nombre: str
    precio: int
    categoria: str


PRODUCTOS = [
    Producto(id=1, nombre="Café Americano", precio=1800, categoria="calientes"),
    Producto(id=2, nombre="Cappuccino", precio=2500, categoria="calientes"),
    Producto(id=3, nombre="Chocolate Caliente", precio=2800, categoria="calientes"),
    Producto(id=4, nombre="Té a Elección", precio=1500, categoria="calientes"),
    Producto(id=5, nombre="Limonada Menta", precio=2500, categoria="frias"),
    Producto(id=6, nombre="Jugo Natural", precio=2300, categoria="frias"),
    Producto(id=7, nombre="Frappé de Café", precio=3200, categoria="frias"),
    Producto(id=8, nombre="Té Helado", precio=2200, categoria="frias"),
    Producto(id=9, nombre="Pastel Hojarasca Manjar", precio=3650, categoria="pasteles"),
    Producto(id=10, nombre="Pastel Húmedo Chocolate Manjar", precio=3650, categoria="pasteles"),
    Producto(id=11, nombre="Alfajor Tres Capas", precio=1500, categoria="pasteles"),
    Producto(id=12, nombre="Pastel Panqueque Nuez Manjar", precio=3650, categoria="pasteles"),
    Producto(id=13, nombre="Sandwich de Jamón y Queso", precio=3200, categoria="sandwiches"),
    Producto(id=14, nombre="Sandwich Vegetariano", precio=3000, categoria="sandwiches"),
    Producto(id=15, nombre="Sandwich de Pollo", precio=3500, categoria="sandwiches"),
    Producto(id=16, nombre="Croissant Jamón Queso", precio=3100, categoria="sandwiches"),
    Producto(id=17, nombre="Torta Húmeda de Chocolate", precio=8500, categoria="tortas"),
    Producto(id=18, nombre="Torta Tres Leches", precio=8900, categoria="tortas"),
    Producto(id=19, nombre="Kuchen de Frutas", precio=7900, categoria="tortas"),
    Producto(id=20, nombre="Tronco de Manjar", precio=7600, categoria="tortas"),
    Producto(id=21, nombre="Torta de Milhojas", precio=8200, categoria="tortas"),
    Producto(id=22, nombre="Torta de Panqueque Nuez", precio=8300, categoria="tortas"),
    Producto(id=23, nombre="Mini Torta Individual", precio=3200, categoria="tortas"),
    Producto(id=24, nombre="Torta Sin Azúcar", precio=9200, categoria="tortas"),
    Producto(id=25, nombre="Pastel Panqueque Chocolate Manjar", precio=3650, categoria="pasteles"),
    Producto(id=26, nombre="Porción Torta Tres Leches", precio=4200, categoria="pasteles"),
    Producto(id=27, nombre="Porción Kuchen de Frutas", precio=3900, categoria="pasteles"),
    Producto(id=28, nombre="Porción Tronco de Manjar", precio=3800, categoria="pasteles"),
]


@app.get("/")
def raiz():
    return {"servicio": "productos", "puerto": 8001}


@app.get("/productos", response_model=list[Producto])
def listar(categoria: Optional[str] = None, q: Optional[str] = None):
    resultado = PRODUCTOS
    if categoria:
        resultado = [p for p in resultado if p.categoria == categoria]
    if q:
        resultado = [p for p in resultado if q.lower() in p.nombre.lower()]
    return resultado


@app.get("/productos/{producto_id}", response_model=Producto)
def obtener(producto_id: int):
    for p in PRODUCTOS:
        if p.id == producto_id:
            return p
    raise HTTPException(status_code=404, detail="Producto no encontrado")
