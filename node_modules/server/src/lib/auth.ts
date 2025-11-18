import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db.js";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        github: {
            enabled: true,
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
    sessions: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24 * 7, // 7 days
        },
    },
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    trustedOrigins: ["http://localhost:3001"],
});