import { Center, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconMail, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { authClient } from "../../lib/auth-client";
import { BetterAuthActionButton } from "../auth/better-auth-action-button";


export default function AccountSetPassword({ email }: {
    email: string
}) {
    const [loading, setLoading] = useState(false);

    function handleSendResetEmail() {
        return authClient.requestPasswordReset({
            email,
            redirectTo: import.meta.env.VITE_CALLBACK_URL + "auth/reset-password",
        },
            {
                onRequest: async () => {
                    setLoading(true);
                },
                onError: error => {
                    notifications.show({
                        title: "Error",
                        message: error.error.message,
                        color: "red",
                        withCloseButton: true,
                        withBorder: true,
                        icon: <IconX />
                    });
                    setLoading(false);
                },
                onSuccess: () => {
                    notifications.show({
                        title: "Password Reset",
                        message: "An email has been sent to your email address with instructions to set your password.",
                        color: "blue",
                        withCloseButton: true,
                        withBorder: true,
                        icon: <IconMail />
                    });
                    setLoading(false);
                }
            });
    }

    return (
        <>
            <Title order={3}>Set Password</Title>
            <Text>You currently do not have a password set. A password reset email will be sent to your registered email address.</Text>
            <Center mt={"md"}>
                <BetterAuthActionButton action={handleSendResetEmail} loading={loading}>Send Password Reset Email</BetterAuthActionButton>
            </Center>
        </>
    )
}