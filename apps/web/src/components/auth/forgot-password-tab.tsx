import { useForm } from "@mantine/form";
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { authClient } from "../../lib/auth-client"
import { z } from "zod/v4";
import { Button, Center, Group, LoadingOverlay, Paper, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconMail, IconX } from '@tabler/icons-react';
import { redirect, useNavigate } from '@tanstack/react-router'
import { useState } from "react";

const forgotPasswordSchema = z.object({
    email: z.email(),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordTab({ openSignInTab }: {
    openSignInTab: () => void
}) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<ForgotPasswordInput>({
        initialValues: {
            email: "",
        },
        validate: zod4Resolver(forgotPasswordSchema)
    });

    const handleForgotPassword = async (data: ForgotPasswordInput) => {
        await authClient.requestPasswordReset({
            ...data,
            redirectTo: "/auth/reset-password"
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
                        message: "If an account with that email exists, a reset link has been sent.",
                        color: "blue",
                        withCloseButton: true,
                        withBorder: true,
                        icon: <IconMail />
                    });
                    setLoading(false);
                }
            }
        );
    }

    return <>
        <Paper withBorder p={"md"} pos={"relative"}>
            <Title order={3} mb="md">Forgot Password</Title>
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: "sm" }}
                loaderProps={{ type: 'bars' }} />
            <form onSubmit={form.onSubmit(handleForgotPassword)}>
                <TextInput
                    label="Email"
                    placeholder="Email"
                    {...form.getInputProps("email")}
                    required
                    mb={"md"}
                />
                <Group grow preventGrowOverflow={false}>
                    <Button color="gray" onClick={openSignInTab}>Back</Button>
                    <Button type="submit">
                        Send Reset Email
                    </Button>
                </Group>
            </form>
        </Paper>
    </>
}