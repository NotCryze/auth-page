import type { ComponentProps, ElementType } from "react";
import { GitHubIcon, GoogleIcon } from "../components/auth/o-auth-icons";


export const SUPPORTED_O_AUTH_PROVIDERS = ["github", "google"] as const;
export type SupportedOAuthProvider = (typeof SUPPORTED_O_AUTH_PROVIDERS)[number];

export const SUPPORTED_O_AUTH_PROVIDER_DETAILS: Record<
    SupportedOAuthProvider, {
        name: string;
        Icon: ElementType<ComponentProps<"svg">>; // URL or icon name
    }
> = {
    github: {
        name: "GitHub",
        Icon: GitHubIcon,
    },
    google: {
        name: "Google",
        Icon: GoogleIcon,
    },
};