import { Context, Hono, Next } from "hono";
import { cors } from "hono/cors";

import { api } from "./cms/api/api";
import { authAPI } from "./cms/admin/auth";
import { Bindings } from "./cms/types/bindings";
import { admin } from "./cms/admin/admin";
import { example } from "./custom/example";
import { status } from "./cms/api/status";
import { log } from "./cms/util/logger";

import { Session, User, verifyRequestOrigin } from "lucia";
import { initializeLucia } from "./cms/auth/lucia";
import { isAuthEnabled } from "./cms/auth/auth-helpers";
import { getCookie } from "hono/cookie";

export type Variables = {
  session?: Session;
  user?: User;
  authEnabled?: boolean;
};
const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

export type AppContext = Context<{ Bindings: Bindings; Variables: Variables }>;

app.use("*", async (ctx, next) => {
  const authEnabled = await isAuthEnabled(ctx);
  ctx.set("authEnabled", authEnabled);

  // CSRF protection
  const originHeader = ctx.req.headers.get("Origin");
  const hostHeader = ctx.req.headers.get("Host");
  let allowCookie = true;
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    allowCookie = false;
  }
  const path = ctx.req.path;
  if (authEnabled && !path.includes("/public")) {
    const auth = initializeLucia(ctx.env.D1DATA, ctx.env);
    let sessionId = allowCookie
      ? getCookie(ctx, auth.sessionCookieName) ?? null
      : null;
    if (!sessionId) {
      const authorizationHeader = ctx.req.headers.get("Authorization");
      sessionId = auth.readBearerToken(authorizationHeader ?? "");
    }
    if (sessionId) {
      const { session, user } = await auth.validateSession(sessionId);
      if (session && session.fresh) {
        ctx.header(
          "Set-Cookie",
          auth.createSessionCookie(sessionId).serialize(),
          {
            append: true,
          }
        );
      } else if (!session) {
        ctx.header("Set-Cookie", auth.createBlankSessionCookie().serialize(), {
          append: true,
        });
      }
      ctx.set("session", session);
      ctx.set("user", user);
    }
  }
  return next();
});

//CORS
app.use(
  "/v1/*",
  cors({
    origin: (origin) => {
      return origin.indexOf("localhost") > 0 || origin.endsWith(".sonicjs.com")
        ? origin
        : "https://sonicjs.com";
    },
  })
);

//request Logging
app.use("*", async (ctx, next) => {
  if (ctx.req.path.indexOf("/admin") == 0 || ctx.req.path.indexOf("/v1") == 0) {
    log(ctx, { level: "info", method: ctx.req.method, url: ctx.req.path });
  }
  await next();
});

//auth

app.onError((err, ctx) => {
  console.log(`SonicJs Error: ${err}`);
  log(ctx, { level: "error", message: err });

  return ctx.text("SonicJs Error", 500);
});

app.get("/", async (ctx) => {
  return ctx.redirect("/admin");
});

app.get("/public/*", async (ctx) => {
  return await ctx.env.ASSETS.fetch(ctx.req.raw);
});

app.route("/v1", api);
app.route("/v1/auth", authAPI);
app.route("/admin", admin);
app.route("v1/example", example);
app.route("/status", status);

export default app;
