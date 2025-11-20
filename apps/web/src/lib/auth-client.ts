import { ssoClient } from "@better-auth/sso/client";
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    init: {
        credentials: "include",
    },
    plugins: [
        ssoClient()
    ]
})