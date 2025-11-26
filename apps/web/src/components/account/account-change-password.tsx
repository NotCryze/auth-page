import { Button, Center, Checkbox, LoadingOverlay, PasswordInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import z from "zod";
import { authClient } from "../../lib/auth-client";

const changePasswordSchema = z.object({
    currentPassword: z.string().min(8, "Current password is required"),             // Current password is required
    newPassword: z.string().min(8, "Password must be at least 8 characters"),          // Password is required and must be at least 8 characters
    confirmNewPassword: z.string().min(8, "Password must be at least 8 characters"),   // Confirm password is required and must be at least 8 characters
    revokeOtherSessions: z.boolean().optional(),                                         // Optional boolean to revoke other sessions
})
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
        path: ["password"],
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    });

type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export default function AccountChangePassword() {

    const [loading, setLoading] = useState(false);

    const form = useForm<ChangePasswordInput>({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            revokeOtherSessions: true,
        },
        validate: zod4Resolver(changePasswordSchema)
    });

    const handleChangePassword = async (data: ChangePasswordInput) => {
        authClient.changePassword(data, {
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
                    message: "Your password has been changed successfully.",
                    color: "green",
                    withCloseButton: true,
                    withBorder: true,
                    icon: <IconCheck />
                });
                setLoading(false);
            }
        });
    };

    return (
        <>
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
                loaderProps={{ type: 'bars' }} />
            <Title order={3} mb={"md"}>Change Password</Title>
            <form onSubmit={form.onSubmit(handleChangePassword)}>
                <PasswordInput
                    label="Current Password"
                    placeholder="Enter your current password"
                    {...form.getInputProps("currentPassword")}
                    mb={"md"}
                />
                <PasswordInput
                    label="New Password"
                    placeholder="Enter your new password"
                    {...form.getInputProps("password")}
                    mb={"md"}
                />
                <PasswordInput
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    {...form.getInputProps("confirmPassword")}
                    mb={"md"}
                />
                <Checkbox
                    label="Revoke other sessions"
                    description="Log out from all other devices except this one"
                    {...form.getInputProps("revokeOtherSessions", { type: "checkbox" })}
                    mb={"md"}
                />
                <Center>
                    <Button type="submit">Change Password</Button>
                </Center>
            </form>
        </>
    )
}