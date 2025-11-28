import { createAuthClient } from "better-auth/react"
import { twoFactorClient } from "better-auth/plugins"

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    init: {
        credentials: "include",
    },
    plugins: [
        twoFactorClient({
            onTwoFactorRedirect: () => {
                window.location.href = "/auth/2fa";
            }
        }),
    ],
})