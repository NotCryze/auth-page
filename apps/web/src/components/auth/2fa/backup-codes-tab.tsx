import { Button, Center, Checkbox, LoadingOverlay, Paper, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "../../../lib/auth-client"
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import z from "zod";

const backupCodeSchema = z.object({
    code: z.string().min(1, "Backup code is required"),
    trustDevice: z.boolean().optional(),
});

type BackupCodeInput = z.infer<typeof backupCodeSchema>;

export default function BackupCodesTab() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<BackupCodeInput>({
        initialValues: {
            code: "",
        },
        validate: zod4Resolver(backupCodeSchema)
    });

    async function handleBackupCodeVerification(data: BackupCodeInput) {
        await authClient.twoFactor.verifyBackupCode({ ...data }, {
            onRequest: async () => {
                setLoading(true);
            },
            onError: error => {
                notifications.show({
                    title: "Error",
                    message: error.error.message || "An error occurred while verifying the code.",
                    color: "red",
                    withCloseButton: true,
                    withBorder: true,
                    icon: <IconX />
                });
                setLoading(false);
            },
            onSuccess: () => {
                navigate({ to: "/" });
            }
        });
    }

    return (
        <Paper withBorder p={"md"} style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0, }} pos={"relative"}>
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: "sm" }}
                loaderProps={{ type: 'bars' }} />
            <form onSubmit={form.onSubmit(handleBackupCodeVerification)}>
                <TextInput
                    label="Backup Code"
                    placeholder="01234-56789"
                    {...form.getInputProps("code")}
                    mb={"md"}
                />
                <Checkbox
                    label="Remember this device"
                    {...form.getInputProps("trustDevice", { type: "checkbox" })}
                    mb={"md"} />
                <Center>
                    <Button type="submit">
                        Submit Code
                    </Button>
                </Center>
            </form>
        </Paper>
    )
}