// import { Hono } from 'hono'
// const app = new Hono()

import { Context, Hono } from "hono";

import { Bindings } from "../types/bindings";
import {
  loadEditContent,
  loadInMemoryCacheDetail,
  loadInMemoryCacheTable,
  loadKVCacheDetail,
  loadKVCacheTable,
  loadNewContent,
  loadTableData,
} from "./pages/content";

import { loadApis } from "./pages/api";
import { getRecords } from "../data/data";
import { apiConfig, config } from "../../db/routes";
import qs from "qs";
import { format } from "date-fns";
import { getAllFromInMemoryCache, getFromInMemoryCache } from "../data/cache";
import { getKVCache, getRecordFromKvCache } from "../data/kv-data";
import { loadLogin, loadSetup } from "./pages/login";
import { Variables } from "../../server";
import { tableSchemas } from "../../db/routes";
import { drizzle } from "drizzle-orm/d1";
import { isNotNull } from "drizzle-orm";
import { hasUser } from "../auth/auth-helpers";

const admin = new Hono<{ Bindings: Bindings; Variables: Variables }>();

admin.use("*", async (ctx, next) => {
  const path = ctx.req.path;
  let canUseAdmin = await config.adminAccessControl(ctx);
  if (
    !canUseAdmin &&
    path !== "/admin/login" &&
    path !== "/admin/content/new/auth/users/setup"
  ) {
    const userExists = await hasUser(ctx);
    if (userExists) {
      return ctx.redirect("/admin/login", 302);
    } else {
      return ctx.redirect("/admin/content/new/auth/users/setup", 302);
    }
    //redirect if not logged in
  } else if (
    canUseAdmin &&
    (path === "/admin/login" || path === "/admin/content/new/auth/users/setup")
  ) {
    //redirect if logged in
    return ctx.redirect("/admin", 302);
  }
  await next();
});
admin.get("/ping", (ctx) => {
  console.log("testing ping", Date());
  return ctx.text(Date());
});

admin.get("/", async (ctx) => ctx.html(await loadApis(ctx)));

admin.get("/login", async (ctx) => ctx.html(await loadLogin(ctx)));

admin.get("/content/new/auth/users/setup", async (ctx) =>
  ctx.html(await loadSetup(ctx))
);

admin.get("/content/edit/:route/:id", async (ctx) => {
  const route = ctx.req.param("route");
  const id = ctx.req.param("id");
  if (route === "users") {
    return ctx.redirect(`/admin/content/edit/auth/users/${id}`, 301);
  }
  return ctx.html(await loadEditContent(ctx, route, id));
});

admin.get("/content/new/:route", async (ctx) => {
  const route = ctx.req.param("route");
  if (route === "users") {
    return ctx.redirect("/admin/content/new/auth/users", 301);
  }
  return ctx.html(await loadNewContent(ctx, route));
});

admin.get("/content/new/auth/users", async (ctx) => {
  return ctx.html(await loadNewContent(ctx, "users"));
});

admin.get("/tables/auth/users", async (ctx) => {
  return ctx.html(await loadTableData(ctx, "users"));
});

admin.get("/content/edit/auth/users/:id", async (ctx) => {
  const route = "auth/users";
  const id = ctx.req.param("id");
  return ctx.html(await loadEditContent(ctx, route, id, "users"));
});

admin.get("/tables/:route", async (ctx) => {
  const route = ctx.req.param("route");
  if (route === "users") {
    return ctx.redirect("/admin/tables/auth/users", 301);
  }
  return ctx.html(await loadTableData(ctx, route));
});

admin.get("/cache/in-memory", async (ctx) => {
  return ctx.html(await loadInMemoryCacheTable(ctx));
});

admin.get("/cache/in-memory/:id", async (ctx) => {
  const id = ctx.req.param("id");
  const idDecoded = decodeURIComponent(id);
  const cacheResult = await getFromInMemoryCache(ctx, idDecoded);
  return ctx.html(await loadInMemoryCacheDetail(ctx, cacheResult));
});

admin.get("/cache/kv", async (ctx) => {
  return ctx.html(await loadKVCacheTable(ctx));
});

admin.get("/cache/kv/:id", async (ctx) => {
  const id = ctx.req.param("id");
  const idDecoded = decodeURIComponent(id);
  console.log("idDecoded", idDecoded);
  const kv = await getRecordFromKvCache(ctx.env.KVDATA, idDecoded, true);
  return ctx.html(await loadKVCacheDetail(ctx, kv));
});

admin.get("/api/in-memory-cache", async (ctx) => {
  const start = Date.now();

  var params = qs.parse(ctx.req.query());
  params.limit = params.limit ?? 1000;

  const records = await getAllFromInMemoryCache();

  const data = records.data.map((item) => {
    const itemEncoded = encodeURIComponent(item.key);
    return {
      key: item.key,
      createdOn: format(item.meta.created, "MM/dd/yyyy h:mm b"),
      viewLink: `<a href="/admin/cache/in-memory/${itemEncoded}">${item.key}</a>`,
    };
  });

  const end = Date.now();
  const executionTime = end - start;
  // console.log(`Execution time: ${end - start} ms`);

  return ctx.json({
    data,
    source: records.source,
    total: records.total,
    executionTime,
  });
});

admin.get("/api/kv-cache", async (ctx) => {
  const start = Date.now();

  var params = qs.parse(ctx.req.query());
  params.limit = params.limit ?? 1000;

  const records = await getKVCache(ctx.env.KVDATA);

  const data = records.keys.map((item) => {
    const itemEncoded = encodeURIComponent(item.name);
    return {
      key: item.name,
      viewLink: `<a href="/admin/cache/kv/${itemEncoded}">${item.name}</a>`,
      createdOn: item.metadata.createdOn
        ? format(item.metadata.createdOn, "MM/dd/yyyy h:mm b")
        : "",
    };
  });

  const end = Date.now();
  const executionTime = end - start;
  // console.log(`Execution time: ${end - start} ms`);

  return ctx.json({
    data,
    source: records.source,
    total: records.total,
    executionTime,
  });
});
async function dataRoute(
  route: string,
  ctx: Context<{ Bindings: Bindings; Variables: Variables }>
) {
  const start = Date.now();

  var params = qs.parse(ctx.req.query());
  params.limit = params.limit ?? 1000;

  const table = apiConfig.find((entry) => entry.route === route).table;
  ctx.env.D1DATA = ctx.env.D1DATA ?? ctx.env.__D1_BETA__D1DATA;

  const records = await getRecords(
    ctx,
    table,
    params,
    ctx.req.url,
    "fastest",
    undefined
  );

  // console.log("===> records", records);

  const authMode = ctx.req.path.includes("/auth/");

  const data = records.data.map((item) => {
    const deleteButton = `
      <button data-delete-id="${item.id}" class="btn btn-link delete-btn text-white">
        <i class="bi bi-trash"></i>
      </button>
    `;

    const editButton = `
      <a href="/admin/content/edit/${authMode ? `auth/${route}` : route}/${
        item.id
      }" class="text-decoration-none">
        <i class="bi bi-pencil"></i>
      </a>
    `;

    return {
      id: item.id,
      updatedOn: format(item.updatedOn, "MM/dd/yyyy h:mm b"),
      displayValue: `<span>${getDisplayField(item)}</span>`,
      apiLink: `<a target="_blank" href="/v1/${route}/${item.id}">raw <i class="bi bi-box-arrow-up-right ms-2"></i></a>`,
      actionButtons: `<div class="action-buttons">${editButton} ${deleteButton}</div>`,
    };
  });

  // console.log("===> data", data);

  const end = Date.now();
  const executionTime = end - start;
  // console.log(`Execution time: ${end - start} ms`);

  return ctx.json({
    data,
    source: records.source,
    total: records.total,
    executionTime,
  });
}
admin.get("/api/auth/:route", (ctx) => dataRoute(ctx.req.param("route"), ctx));
admin.get("/api/:route", (ctx) => dataRoute(ctx.req.param("route"), ctx));

function getDisplayField(item) {
  return item.name ?? item.title ?? item.firstName ?? item.id ?? "record";
}

export { admin };
