import { useForm } from "@mantine/form";
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { authClient } from "../../lib/auth-client"
import { z } from "zod/v4";
import { Button, Divider, Paper, PasswordInput, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router'
import SocialAuthButtons from "./social-auth-buttons";
import { useState } from "react";

const signInSchema = z.object({
    email: z.email(),
    password: z.string(),
});

type SignInInput = z.infer<typeof signInSchema>;

export default function SignInTab() {
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
        await authClient.signIn.email({ ...data, callbackURL: "http://localhost:3001/" }, {
            onRequest: async () => {
                setLoading(true);
                // await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate loading state
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
        <Paper withBorder p={"md"} miw={"400px"} style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0, }}>
            <form onSubmit={form.onSubmit(handleSignIn)}>
                <TextInput
                    label="Email"
                    placeholder="Email"
                    {...form.getInputProps("email")}
                    required
                    mb={"md"}
                />
                <PasswordInput
                    label="Password"
                    placeholder="Password"
                    {...form.getInputProps("password")}
                    required
                    mb={"md"}
                />
                <Button type="submit" size="lg" fullWidth loading={loading} loaderProps={{ type: "dots", color: "white" }}>
                    Sign in
                </Button>
            </form>
            <Divider my="lg" label="Or continue with" labelPosition="center" />
            <SocialAuthButtons />
        </Paper>
    </>
}