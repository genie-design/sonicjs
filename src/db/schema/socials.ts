import { sqliteTable, index, text } from "drizzle-orm/sqlite-core";
import { auditSchema } from "./audit";
import { ApiConfig } from "../routes";
import { isAdmin, isAdminOrEditor } from "../config-helpers";

export const tableName = "socials";

export const route = "socials";

export const definition = {
  id: text("id").primaryKey(),
  facebook: text("facebook"),
  twitter: text("twitter"),
  instagram: text("instagram"),
  youtube: text("youtube"),
  tiktok: text("tiktok"),
};

export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema,
});

export const access: ApiConfig["access"] = {
  operation: {
    read: true,
    update: isAdminOrEditor,
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
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
