import { integer, text } from "drizzle-orm/sqlite-core";

export const auditSchema = {
  createdBy: text("createdBy"),
  updatedBy: text("updatedBy"),
  createdOn: integer("createdOn"),
  updatedOn: integer("updatedOn"),
};
