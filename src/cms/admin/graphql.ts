import { Hono } from 'hono';
import { Bindings } from '../types/bindings';
import { Variables } from '../../server';

import { SQLiteTable } from 'drizzle-orm/sqlite-core';
import { schema as dbSchema } from '../../db/routes';
import { drizzle } from 'drizzle-orm/d1';
import { createYoga } from 'graphql-yoga';
import { buildVanillaSchema } from 'drizzle-graphql';
import { is } from 'drizzle-orm/entity';
const graphqlAPI = new Hono<{ Bindings: Bindings; Variables: Variables }>();
graphqlAPI.use('*', async (ctx) => {
  console.time('create yoga');
  const db = drizzle(ctx.env.D1DATA, dbSchema);
  const schemaEntries = Object.entries(dbSchema);
  const tables = Object.fromEntries(
    schemaEntries.filter(([key, value]) => is(value, SQLiteTable))
  );
  const { schema } = buildVanillaSchema(db, dbSchema.schema);
  const yoga = createYoga({ schema, logging: 'debug' });
  console.timeEnd('create yoga');
  // @ts-ignore
  console.log('HANDLE');
  return yoga.handle(ctx.req, {});
});

export { graphqlAPI };
