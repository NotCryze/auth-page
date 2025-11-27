import { Button, Center, Checkbox, LoadingOverlay, Paper, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { authClient } from "../../../lib/auth-client"
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import z from "zod";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useNavigate, useRouter } from "@tanstack/react-router";

const totpSchema = z.object({
    code: z.string().length(6, "Invalid code length"),
    trustDevice: z.boolean().optional(),
});

type TotpInput = z.infer<typeof totpSchema>;

export default function TotpTab() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<TotpInput>({
        initialValues: {
            code: "",
            trustDevice: false,
        },
        validate: zod4Resolver(totpSchema)
    });

    async function handleTotp(data: TotpInput) {
        await authClient.twoFactor.verifyTotp({ ...data }, {
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
            <form onSubmit={form.onSubmit(handleTotp)}>
                <TextInput
                    label="Authenticator Code"
                    placeholder="123456"
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