import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";
import { db } from "../db.js";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            console.log(`Send password reset email to ${user.email} with link: ${url}`);
        },
    },
    user: {
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async ({ user, url, newEmail }) => {
                console.log(`Send email change verification to ${newEmail} with link: ${url}`);
            }
        },
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url }) => {
                console.log(`Send account deletion verification to ${user.email} with link: ${url}`);
            }
        },
    },
    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
            console.log(`Send verification email to ${user.email} with link: ${url}`);
        }
    },
    socialProviders: {
        github: {
            enabled: true,
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            redirectURI: "http://localhost:3000/api/auth/callback/github",
        },
        google: {
            enabled: true,
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            redirectURI: "http://localhost:3000/api/auth/callback/google",
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
    plugins: [
        twoFactor()
    ],
});