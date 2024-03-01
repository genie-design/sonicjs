import { sqliteTable, index, text } from "drizzle-orm/sqlite-core";

import { relations } from "drizzle-orm";
import { auditSchema } from "./audit";
import * as users from "./users";
import { ApiConfig } from "../routes";
import { isAdmin, isAdminOrEditor } from "../config-helpers";

export const tableName = "features";

export const route = "features";

export const definition = {
  id: text("id").primaryKey(),
  title: text("title"),
  body: text("body"),
  link: text("link"),
  image: text("image"),
};

export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema,
});

export const fields: ApiConfig["fields"] = {
  image: {
    type: "file",
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
