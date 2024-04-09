import { sqliteTable, index, text } from 'drizzle-orm/sqlite-core';

import { relations } from 'drizzle-orm';
import { auditSchema } from './audit';
import * as products from './products';
import { ApiConfig } from '../routes';
import { isAdminOrEditor } from '../config-helpers';

export const tableName = 'skus';

export const route = 'skus';

export const definition = {
  id: text('id').primaryKey(),
  name: text('name'),
  description: text('description'),
  images: text('images', { mode: 'json' }).$type<string[]>(),
  quantity: text('quantity'),
  size: text('size'),
  price: text('price'),

  product_id: text('product_id')
    .notNull()
    .references(() => products.table.id)
};

export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema
});

export const relation = relations(table, ({ one }) => ({
  product: one(products.table, {
    fields: [table.product_id],
    references: [products.table.id]
  })
}));

export const fields: ApiConfig['fields'] = {
  images: {
    type: 'file[]',
    bucket: (ctx) => ctx.env.R2_STORAGE,
    path: 'images'
  }
};

export const access: ApiConfig['access'] = {
  operation: {
    read: true,
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
    update: isAdminOrEditor
  }
};
export const hooks: ApiConfig['hooks'] = {
  resolveInput: {
    create: (ctx, data) => {
      data.createdOn = new Date().getTime();
      if (ctx.get('user')?.userId) {
        data.createdBy = ctx.get('user').userId;
      }
      return data;
    },
    update: (ctx, id, data) => {
      data.updatedOn = new Date().getTime();
      if (ctx.get('user')?.userId) {
        data.updatedOn = ctx.get('user').userId;
      }
      return data;
    }
  }
};
