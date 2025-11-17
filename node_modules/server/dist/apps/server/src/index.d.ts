import { Hono } from 'hono';
import { auth } from './lib/auth.js';
declare const app: Hono<{
    Variables: {
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null;
    };
}, import("hono/types").BlankSchema, "/">;
export type AppType = typeof app;
export default app;
