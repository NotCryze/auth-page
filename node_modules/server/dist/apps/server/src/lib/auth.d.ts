export declare const auth: import("better-auth").Auth<{
    emailAndPassword: {
        enabled: true;
    };
    sessions: {
        cookieCache: {
            enabled: boolean;
            maxAge: number;
        };
    };
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth/adapters/drizzle").DBAdapter<import("better-auth").BetterAuthOptions>;
}>;
