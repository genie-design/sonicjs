import { Hono } from 'hono';
import { Bindings } from '../types/bindings';
const yoga = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        hello: String!
      }
    `,
    resolvers: {
      Query: {
        hello: () => 'Hello World!'
      }
    }
  })
});
import { Variables } from '../../server';
import { createSchema, createYoga } from 'graphql-yoga';
const graphqlAPI = new Hono<{ Bindings: Bindings; Variables: Variables }>();
graphqlAPI.use('*', async (context) => {
  // @ts-ignore
  return yoga.handle(context.req, {});
});
export { graphqlAPI };
