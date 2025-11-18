import { SUPPORTED_O_AUTH_PROVIDER_DETAILS, SUPPORTED_O_AUTH_PROVIDERS } from "../../lib/o-auth-providers";
import { authClient } from "../../lib/auth-client";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { BetterAuthActionButton } from "./better-auth-action-button";

export default function SocialAuthButtons() {
    return SUPPORTED_O_AUTH_PROVIDERS.map((provider) => {
        const Icon = SUPPORTED_O_AUTH_PROVIDER_DETAILS[provider].icon;
        async function handleSocialSignIn() {
            const res = await authClient.signIn.social({ provider, callbackURL: "http://localhost:3001/" })
            if (res.error) {
                notifications.show({
                    title: "Error",
                    message: res.error.message,
                    color: "red",
                    withCloseButton: true,
                    withBorder: true,
                    icon: <IconX />
                });
            }
            return res;
        }

        return <BetterAuthActionButton key={provider} action={handleSocialSignIn} variant="outline" fullWidth>
            <Icon />
            {SUPPORTED_O_AUTH_PROVIDER_DETAILS[provider].name}
        </BetterAuthActionButton>;
    });
}