import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { auth } from './lib/auth.js';
import { cors } from 'hono/cors';
const app = new Hono();
app.use("/api/auth/*", // or replace with "*" to enable cors for all routes
cors({
    origin: ["http://localhost:3001"], // Manually set in vite.config.ts
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
}));
app.use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) {
        c.set("user", null);
        c.set("session", null);
        await next();
        return;
    }
    c.set("user", session.user);
    c.set("session", session.session);
    await next();
});
app.on(["POST", "GET", "OPTIONS"], "/api/auth/*", (c) => auth.handler(c.req.raw));
serve({
    fetch: app.fetch,
    port: 3000
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
export default app;
