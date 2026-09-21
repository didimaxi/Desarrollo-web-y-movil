require('dotenv').config();
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const Usuario = require('./models/usuario');

// -------------------------------------------------
// Conexión a MongoDB
// -------------------------------------------------
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/graphql_clase10';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error de conexión a MongoDB:', err.message));

// -------------------------------------------------
// Schema GraphQL: types, input, Query, Mutation
// -------------------------------------------------
const typeDefs = gql`
  type Usuario {
    id: ID!
    nombre: String!
    pass: String!
  }

  input UsuarioInput {
    nombre: String!
    pass: String!
  }

  type Alert {
    message: String!
  }

  type Query {
    getUsuarios: [Usuario]
    getUsuariosById(id: ID!): Usuario
  }

  type Mutation {
    addUsuario(input: UsuarioInput): Usuario
    updUsuario(id: ID!, input: UsuarioInput): Usuario
    delUsuario(id: ID!): Alert
  }
`;

// -------------------------------------------------
// Resolvers: puente entre el schema y el modelo
// -------------------------------------------------
const resolvers = {
  Query: {
    getUsuarios: async () => {
      return await Usuario.find();
    },
    getUsuariosById: async (_, { id }) => {
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      return usuario;
    }
  },
  Mutation: {
    addUsuario: async (_, { input }) => {
      const nuevoUsuario = new Usuario(input);
      return await nuevoUsuario.save();
    },
    updUsuario: async (_, { id, input }) => {
      const usuarioActualizado = await Usuario.findByIdAndUpdate(id, input, {
        new: true
      });
      if (!usuarioActualizado) {
        throw new Error('Usuario no encontrado');
      }
      return usuarioActualizado;
    },
    delUsuario: async (_, { id }) => {
      const usuarioEliminado = await Usuario.findByIdAndDelete(id);
      if (!usuarioEliminado) {
        throw new Error('Usuario no encontrado');
      }
      return { message: `Usuario ${id} eliminado correctamente` };
    }
  }
};

// -------------------------------------------------
// Arranque de Express + Apollo Server
// -------------------------------------------------
async function startServer() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log('Graphql Iniciado');
    console.log(`🚀 Servidor listo en http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
