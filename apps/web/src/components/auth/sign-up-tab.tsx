import { Button, Center, LoadingOverlay, Paper, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconX } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useState } from "react";
import { z } from "zod/v4";
import { authClient } from "../../lib/auth-client";

const signUpSchema = z.object({
    name: z.string().min(1),                                                // Name is required
    email: z.email(),                                                       // Email is required and must be valid
    password: z.string().min(8, "Password must be at least 8 characters"),  // Password is required and must be at least 8 characters
});

type SignUpInput = z.infer<typeof signUpSchema>;

export default function SignUpTab({ openEmailVerificationTab }: {
    openEmailVerificationTab: (email: string) => void
}) {
    const [loading, setLoading] = useState(false);

    const form = useForm<SignUpInput>({
        initialValues: {
            name: "",
            email: "",
            password: "",
        },
        validate: zod4Resolver(signUpSchema)
    });

    const handleSignUp = async (data: SignUpInput) => {
        await authClient.signUp.email({ ...data, callbackURL: import.meta.env.VITE_CALLBACK_URL }, {
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
            onSuccess: (ctx) => {
                if (!ctx.data.user.emailVerified) {
                    openEmailVerificationTab(ctx.data.user.email);
                }
                setLoading(false);
            }
        });
    };

    return <>
        <Paper withBorder p={"md"} style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0 }} pos={"relative"}>
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
                loaderProps={{ type: 'bars' }} />
            <form onSubmit={form.onSubmit(handleSignUp)}>
                <TextInput
                    label="Name"
                    placeholder="Name"
                    {...form.getInputProps("name")}
                    required
                    mb={"md"}
                />
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
                <Center>
                    <Button type="submit">
                        Sign up
                    </Button>
                </Center>
            </form>
        </Paper>
    </>
}