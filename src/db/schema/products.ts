import { sqliteTable, index, text } from "drizzle-orm/sqlite-core";

import { relations } from "drizzle-orm";
import { auditSchema } from "./audit";
import * as skus from "./skus";
import { ApiConfig } from "../routes";
import { isAdminOrEditor } from "../config-helpers";

export const tableName = "products";

export const route = "products";

export const definition = {
  id: text("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  nutrition: text("nutrition"),
  images: text("images", { mode: "json" }).$type<string[]>(),
};

export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema,
});
export const relation = relations(table, ({ many }) => ({
  skus: many(skus.table),
}));

export const fields: ApiConfig["fields"] = {
  images: {
    type: "file[]",
    bucket: (ctx) => ctx.env.R2_STORAGE,
    path: "images",
  },
};

export const access: ApiConfig["access"] = {
  operation: {
    read: true,
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
    update: isAdminOrEditor,
  },
};
export const hooks: ApiConfig["hooks"] = {
  resolveInput: {
    create: (ctx, data) => {
      data.createdOn = new Date().getTime();
      if (ctx.get("user")?.userId) {
        data.createdBy = ctx.get("user").userId;
      }
      return data;
    },
    update: (ctx, id, data) => {
      data.updatedOn = new Date().getTime();
      if (ctx.get("user")?.userId) {
        data.updatedOn = ctx.get("user").userId;
      }
      return data;
    },
  },
};
