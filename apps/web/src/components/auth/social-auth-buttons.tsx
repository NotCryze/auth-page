import { SUPPORTED_O_AUTH_PROVIDER_DETAILS, SUPPORTED_O_AUTH_PROVIDERS } from "../../lib/o-auth-providers";
import { authClient } from "../../lib/auth-client";
import { BetterAuthActionButton } from "./better-auth-action-button";

export default function SocialAuthButtons() {
    return SUPPORTED_O_AUTH_PROVIDERS.map((provider) => {
        const Icon = SUPPORTED_O_AUTH_PROVIDER_DETAILS[provider].Icon;
        async function handleSocialSignIn() {
            return await authClient.signIn.social({
                provider,
                callbackURL: import.meta.env.VITE_CALLBACK_URL,
                errorCallbackURL: `${import.meta.env.VITE_CALLBACK_URL}/auth`
            });
        }

        return (
            <BetterAuthActionButton key={provider} action={handleSocialSignIn} variant="outline">
                <Icon />
                {SUPPORTED_O_AUTH_PROVIDER_DETAILS[provider].name}
            </BetterAuthActionButton>
        );
    });
}