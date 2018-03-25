'use strict';

const ApolloServer = require('./services/apolloServer');
const LoopbackServer = require('./services/loopbackServer');

module.exports = (pandora) => {
  pandora
    .process('MASTER')
    .scale('auto');

  pandora
    .service('loopback', LoopbackServer)
    // Allows to define apolloServer as a Dependency.
    // Dependencies are executed after the current Service
    // is operational. Otherwise, they would execute simultaneously
    .dependency(['apolloServer'])
    .process('MASTER');
  pandora
    .service('apolloServer', ApolloServer)
    .config({
      endpoint: '/graphql',
      port: 4000,
    })
    .process('MASTER');

};
