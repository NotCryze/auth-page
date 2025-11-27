import { Flex, Grid, Paper, Text } from "@mantine/core";
import { IconLinkPlus, IconShield, IconUnlink } from "@tabler/icons-react";
import { useRouter } from "@tanstack/react-router";
import { authClient } from "../../lib/auth-client";
import { SUPPORTED_O_AUTH_PROVIDER_DETAILS, type SupportedOAuthProvider } from "../../lib/o-auth-providers";
import { BetterAuthActionButton } from "../auth/better-auth-action-button";


export default function LinkedAccountCard({ provider, account }: {
    provider: string;
    account: {
        id: string;
        providerId: string;
        createdAt: Date;
        updatedAt: Date;
        accountId: string;
        scopes: string[]
    } | null;

}) {
    const router = useRouter();
    const providerDetails = SUPPORTED_O_AUTH_PROVIDER_DETAILS[provider as SupportedOAuthProvider] ?? {
        name: provider,
        Icon: IconShield,
    };

    async function linkAccount() {
        return await authClient.linkSocial({
            provider: provider,
            callbackURL: import.meta.env.VITE_CALLBACK_URL + "account#linked-accounts",
        });
    }

    async function unlinkAccount() {
        return await authClient.unlinkAccount({ providerId: provider }, {
            onSuccess: () => {
                router.invalidate();
            }
        });
    }

    return (
        <Paper withBorder p={"md"} mb={"md"}>
            <Grid>
                <Grid.Col span={"content"}>
                    <Flex h={"100%"} align={"center"} gap={"sm"}>
                        {<providerDetails.Icon />}
                        <span>{providerDetails.name}</span>
                    </Flex>
                </Grid.Col>
                <Grid.Col span={"auto"} >
                    <Flex h={"100%"} align={"center"} justify={"center"} >
                        {!account ? (
                            <Text>Connect your {providerDetails.name} account</Text>
                        ) : (
                            <Text>Linked on: {new Date(account.createdAt).toLocaleDateString()}</Text>
                        )}
                    </Flex>

                </Grid.Col>
                <Grid.Col span={"content"}>
                    <Flex h={"100%"} align={"center"}>
                        {!account ? (
                            <BetterAuthActionButton action={linkAccount} successmessage={`Redirecting to link your ${providerDetails.name} account...`}><IconLinkPlus /></BetterAuthActionButton>
                        ) : (
                            <BetterAuthActionButton color={"red"} action={unlinkAccount} successmessage={`Successfully unlinked ${providerDetails.name} account.`}><IconUnlink /></BetterAuthActionButton>
                        )}
                    </Flex>
                </Grid.Col>
            </Grid>
        </Paper>
    )
}