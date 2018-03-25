'use strict';

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const {
  graphqlExpress,
  graphiqlExpress,
} = require('apollo-server-express');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = require('graphql');


const products = [
  {
    id: 1,
    name: 'Product 1',
    categoryId: 1,
    weight: 200,
  },
  {
    id: 2,
    name: 'Product 2',
    categoryId: 2,
    weight: 200,
  }
];


module.exports = class ApolloServer {
  constructor(serviceContext) {
    this.config = serviceContext.config;
    this.logger = serviceContext.logger;
    this.axios = axios.create({
      baseURL: `http://localhost:3000/api`,
    });
  }

  async start() {
    const app = express();

    const productType = new GraphQLObjectType({
      name: 'ProductType',
      description: 'The product type',
      fields: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        categoryId: {
          type: new GraphQLNonNull(GraphQLID),
        },
        weight: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
    });

    const queryType = new GraphQLObjectType({
      name: 'QueryType',
      description: 'The query type',
      fields: {
        products: {
          type: GraphQLList(productType),
          description: 'Collection of products',
          resolve: (_, args, ctx) => this.axios.get('/products')
            .then(response => response.data)
            .catch(err => console.log('Err: ', err) && []),
          // resolve: (_, args, ctx) => new Promise((resolve, reject) => {
          //   resolve(products);
          // }),
        },
      },
    });

    const schema = new GraphQLSchema({
      query: queryType,
    });

    app.use(this.config.endpoint, bodyParser.json(), graphqlExpress((req) => {
      this.logger.info('Received a request!');
      return {
        schema,
        context: {
          // add stuff here
        },
        formatError: (err) => {
          return err;
        }
      }
    }));

    app.use('/graphiql', graphiqlExpress({ endpointURL: this.config.endpoint }));

    await new Promise((resolve, reject) => {
      this.server = app.listen(this.config.port, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
    console.log(`Process #${process.pid} ApolloServer is now listening on http://locahost:${this.config.port}.`);
  }

  async stop() {
    await new Promise((resolve) => {
      this.server.close(resolve);
    });
    console.log(`Process #${process.pid} ApolloServer stopped.`);
  }
}