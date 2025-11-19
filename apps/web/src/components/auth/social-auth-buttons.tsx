import { SUPPORTED_O_AUTH_PROVIDER_DETAILS, SUPPORTED_O_AUTH_PROVIDERS } from "../../lib/o-auth-providers";
import { authClient } from "../../lib/auth-client";
import { BetterAuthActionButton } from "./better-auth-action-button";

export default function SocialAuthButtons() {
    return SUPPORTED_O_AUTH_PROVIDERS.map((provider) => {
        const Icon = SUPPORTED_O_AUTH_PROVIDER_DETAILS[provider].Icon;
        async function handleSocialSignIn() {
            return await authClient.signIn.social({
                provider,
                callbackURL: "http://localhost:3001/",
                errorCallbackURL: "http://localhost:3001/auth"
            });
        }

        return (
            <BetterAuthActionButton key={provider} action={handleSocialSignIn} variant="outline" fullWidth>
                <Icon />
                {SUPPORTED_O_AUTH_PROVIDER_DETAILS[provider].name}
            </BetterAuthActionButton>
        );
    });
}