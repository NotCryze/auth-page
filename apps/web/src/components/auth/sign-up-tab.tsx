import { useForm } from "@mantine/form";
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { authClient } from "../../lib/auth-client"
import { z } from "zod/v4";
import { Button, Paper, PasswordInput, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from '@tabler/icons-react';
import { useState } from "react";
import { useNavigate } from '@tanstack/react-router'

const signUpSchema = z.object({
    name: z.string().min(1),                                                // Name is required
    email: z.email(),                                                       // Email is required and must be valid
    password: z.string().min(8, "Password must be at least 8 characters"),  // Password is required and must be at least 8 characters
});

type SignUpInput = z.infer<typeof signUpSchema>;

export default function SignUpTab() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<SignUpInput>({
        initialValues: {
            name: "",
            email: "",
            password: "",
        },
        validate: zod4Resolver(signUpSchema)
    });

    const handleSignUp = async (data: SignUpInput) => {
        await authClient.signUp.email({ ...data, callbackURL: "/" }, {
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
                    message: "Sign up successful!",
                    color: "green",
                    withCloseButton: true,
                    withBorder: true,
                    icon: <IconCheck />
                });
                navigate({ to: "/" }); // Redirect to home page after sign-up
                setLoading(false);
            }
        });
    };

    return <>
        <Paper withBorder p={"md"} miw={"400px"} style={{
            borderTop: 'none',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
        }}>
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
                <Button type="submit" size="lg" fullWidth loading={loading} loaderProps={{ type: "dots", color: "white" }}>
                    Sign up
                </Button>
            </form>
        </Paper>
    </>
}