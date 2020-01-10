  
import express = require('express');
import {ApolloServer} from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
function gqlServer(dependencies = {}) {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers(dependencies),
    // Enable graphiql gui
    introspection: true,
    playground: true
  });

  apolloServer.applyMiddleware({app, path: '/', cors: true});

  return app;
}

export default gqlServer;