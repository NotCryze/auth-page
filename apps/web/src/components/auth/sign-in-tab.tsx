import { useForm } from "@mantine/form";
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { authClient } from "../../lib/auth-client"
import { z } from "zod/v4";
import { Anchor, Box, Button, Center, Divider, Group, LoadingOverlay, Paper, PasswordInput, Text, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router'
import SocialAuthButtons from "./social-auth-buttons";
import { useState } from "react";

const signInSchema = z.object({
    email: z.email(),
    password: z.string().min(1, "Invalid password"),
});

type SignInInput = z.infer<typeof signInSchema>;

export default function SignInTab({ openEmailVerificationTab, openForgotPasswordTab }: {
    openEmailVerificationTab: (email: string) => void,
    openForgotPasswordTab: () => void
}) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<SignInInput>({
        initialValues: {
            email: "",
            password: "",
        },
        validate: zod4Resolver(signInSchema)
    });

    const handleSignIn = async (data: SignInInput) => {
        // Sign in using email and password
        await authClient.signIn.email({ ...data, callbackURL: import.meta.env.VITE_CALLBACK_URL }, {
            onRequest: async () => {
                setLoading(true);
                // await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate loading state
            },
            onError: error => {
                // If email is not verified, open the email verification tab
                if (error.error.code === "EMAIL_NOT_VERIFIED") {
                    openEmailVerificationTab(data.email);
                    setLoading(false);
                    return;
                }

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
                    title: "Success",
                    message: "Sign in successful!",
                    color: "green",
                    withCloseButton: true,
                    withBorder: true,
                    icon: <IconCheck />
                });
                navigate({ to: "/" });
                setLoading(false);
            }
        });
    };

    return <>
        <Paper withBorder p={"md"} style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0, }} pos={"relative"}>
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: "sm" }}
                loaderProps={{ type: 'bars' }} />
            <form onSubmit={form.onSubmit(handleSignIn)}>
                <Text component="label" size="sm" fw={500}>
                    Email
                </Text>
                <TextInput
                    placeholder="Email"
                    {...form.getInputProps("email")}
                    mb={"md"}
                />
                <Box mb={"md"}>
                    <Group justify="space-between">
                        <Text component="label" size="sm" fw={500}>
                            Password
                        </Text>

                        <Anchor onClick={openForgotPasswordTab} fw={500} fz="xs">
                            Forgot your password?
                        </Anchor>
                    </Group>
                    <PasswordInput
                        placeholder="Password"
                        {...form.getInputProps("password")}
                    />
                </Box>
                <Center>
                    <Button type="submit">
                        Sign in
                    </Button>
                </Center>
            </form>
            <Divider my="lg" label="Or continue with" labelPosition="center" />
            <Group grow>
                <SocialAuthButtons />
            </Group>
        </Paper>
    </>
}