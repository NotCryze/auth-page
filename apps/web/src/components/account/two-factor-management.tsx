import { Button, Center, LoadingOverlay, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Icon2fa, IconX } from "@tabler/icons-react";
import { useRouter } from "@tanstack/react-router";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import z from "zod";
import { authClient } from "../../lib/auth-client";
import type { TwoFactorData } from "../../types/two-factor-data";
import QRCodeVerify from "./qr-code-verify";


const twoFactorSchema = z.object({
    password: z.string().min(8, "Current password is required"),     // Current password is required
});

type TwoFactorInput = z.infer<typeof twoFactorSchema>;

export default function TwoFactorManagement({
    isEnabled
}: {
    isEnabled?: boolean
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null);

    const form = useForm<TwoFactorInput>({
        initialValues: {
            password: "",
        },
        validate: zod4Resolver(twoFactorSchema)
    });

    async function handleEnableTwoFactor(data: TwoFactorInput) {
        await authClient.twoFactor.enable({ ...data }, {
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
            onSuccess: (context) => {
                const responseData = context.data as TwoFactorData;
                setTwoFactorData({ ...responseData });
                setLoading(false);
            }
        });
    }

    async function handleDisableTwoFactor(data: TwoFactorInput) {
        await authClient.twoFactor.disable({ ...data }, {
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
                router.invalidate();
                setLoading(false);
                notifications.show({
                    title: "Success",
                    message: "Two-Factor Authentication has been disabled.",
                    color: "orange",
                    withCloseButton: true,
                    withBorder: true,
                    icon: <Icon2fa />
                });

            }
        });
    }


    if (twoFactorData)
        return <QRCodeVerify {...twoFactorData} onDone={() => {
            setTwoFactorData(null);
            router.invalidate();
        }} />

    return (
        <>
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
                loaderProps={{ type: 'bars' }} />

            <form onSubmit={form.onSubmit(isEnabled ? handleDisableTwoFactor : handleEnableTwoFactor)}>
                <PasswordInput
                    label="Current Password"
                    placeholder="Enter your current password"
                    {...form.getInputProps("password")}
                    mb={"md"}
                />
                <Center>
                    <Button type="submit" color={isEnabled ? "red" : "blue"}>{isEnabled ? "Disable 2FA" : "Enable 2FA"}</Button>
                </Center>
            </form>
        </>
    )
}