import { Hono } from 'hono';
import { Bindings } from '../types/bindings';
import { Variables } from '../../server';
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql';

import { SQLiteTable } from 'drizzle-orm/sqlite-core';
import { schema as dbSchema } from '../../db/routes';
import { drizzle } from 'drizzle-orm/d1';
import { createYoga } from 'graphql-yoga';
import { buildSchema } from 'drizzle-graphql';
import { is } from 'drizzle-orm/entity';
const graphqlAPI = new Hono<{ Bindings: Bindings; Variables: Variables }>();
graphqlAPI.use('*', async (ctx) => {
  const db = drizzle(ctx.env.D1DATA, dbSchema);
  const schemaEntries = Object.entries(dbSchema);
  const tables = Object.fromEntries(
    schemaEntries.filter(([key, value]) => is(value, SQLiteTable))
  );
  const { entities } = buildSchema(db);
  delete entities.queries.userKeys;
  delete entities.queries.userKeysSingle;
  delete entities.queries.userSessions;
  delete entities.queries.userSessionsSingle;
  delete entities.queries.users;
  delete entities.queries.usersSingle;
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        ...entities.queries
      }
    })
  });

  const yoga = createYoga({ schema, logging: 'debug' });
  return yoga.handle(ctx.req, {});
});

export { graphqlAPI };
