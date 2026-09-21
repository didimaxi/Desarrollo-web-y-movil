# API GraphQL — Clase 10 (Node.js + Express + Apollo Server + MongoDB/Mongoose)

Implementa lo pedido en la guía de la Clase 10: una API GraphQL con un modelo `Usuario`,
queries para listar y buscar por id, y mutations para crear, actualizar y eliminar.

## 1. Requisitos

- Node.js instalado
- MongoDB corriendo localmente (o una URI de MongoDB Atlas)

## 2. Instalación

```bash
npm install
```

## 3. Configuración

Copia `.env.example` a `.env` y ajusta la URI de MongoDB si es necesario:

```bash
cp .env.example .env
```

## 4. Ejecutar el servidor

Con reinicio automático (nodemon):

```bash
npm run dev
```

O directamente con Node:

```bash
npm start
```

Cuando levante correctamente verás en consola el mensaje `Graphql Iniciado` y la URL
del endpoint (por defecto `http://localhost:4000/graphql`). Ábrelo en el navegador
para usar Apollo Sandbox y probar las operaciones.

## 5. Estructura del proyecto

```
graphql-clase10/
├── models/
│   └── usuario.js       # Schema de Mongoose (nombre, pass)
├── server.js            # typeDefs, resolvers y arranque de Express + Apollo
├── package.json
├── .env.example
└── README.md
```

## 6. Ejemplos de queries y mutations (probar en /graphql)

**Listar usuarios**
```graphql
query {
  getUsuarios {
    id
    nombre
  }
}
```

**Buscar por id**
```graphql
query {
  getUsuariosById(id: "PON_AQUI_UN_ID") {
    id
    nombre
  }
}
```

**Crear usuario**
```graphql
mutation {
  addUsuario(input: { nombre: "Juan", pass: "123456" }) {
    id
    nombre
  }
}
```

**Actualizar usuario**
```graphql
mutation {
  updUsuario(id: "PON_AQUI_UN_ID", input: { nombre: "Juan Actualizado", pass: "abcdef" }) {
    id
    nombre
  }
}
```

**Eliminar usuario**
```graphql
mutation {
  delUsuario(id: "PON_AQUI_UN_ID") {
    message
  }
}
```

## 7. Notas

- La guía de la clase menciona límites importantes de GraphQL a tener en cuenta si
  quieres ampliar el ejercicio: profundidad de consulta, paginación, validación y
  seguridad.
- El campo `pass` se guarda tal cual llega (sin hashear) porque así se ve en la
  clase; si esto es para producción real, habría que hashear la contraseña
  (por ejemplo con `bcrypt`) antes de guardarla.
