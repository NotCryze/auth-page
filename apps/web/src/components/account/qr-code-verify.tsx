import { Box, Button, Center, Flex, Grid, LoadingOverlay, Text, TextInput } from "@mantine/core";
import type { TwoFactorData } from "../../types/two-factor-data";
import { useState } from "react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";
import z from "zod";
import { QRCodeSVG } from "qrcode.react";
import { authClient } from "../../lib/auth-client";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

const qrSchema = z.object({
    code: z.string().min(6),
});

type QRInput = z.infer<typeof qrSchema>;

export default function QRCodeVerify({
    totpURI,
    backupCodes,
    onDone
}: TwoFactorData & {
    onDone: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [setUpSuccess, setSetUpSuccess] = useState(false);

    const form = useForm<QRInput>({
        initialValues: {
            code: "",
        },
        validate: zod4Resolver(qrSchema)
    });

    async function handleVeryfyToken(data: QRInput) {
        await authClient.twoFactor.verifyTotp({ ...data }, {
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
                setLoading(false);
                setSetUpSuccess(true);
            }
        });
    }

    if (setUpSuccess)
        return (
            <Box>
                <Text mb={"md"}>Two-Factor Authentication has been successfully set up on your account.</Text>
                <Text mb={"md"}>Please store the following backup codes in a safe place. They can be used to access your account if you lose access to your authenticator app:</Text>
                <Grid mb={"md"} grow>
                    {backupCodes.map((code, index) => (
                        <Grid.Col span={6} key={index}>
                            <Flex justify={"center"} align={"center"} p={"sm"}>
                                <Text>
                                    {code}
                                </Text>
                            </Flex>
                        </Grid.Col>
                    ))}
                </Grid>
                <Center>
                    <Button mt={"md"} onClick={onDone}>Done</Button>
                </Center>
            </Box>
        );

    return (
        <>
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
                loaderProps={{ type: 'bars' }} />

            <Box mb={"md"}>
                <Text>
                    Scan the QR code below with your authenticator app and enter the 6-digit token to verify.
                </Text>
                <form onSubmit={form.onSubmit(handleVeryfyToken)}>
                    <TextInput
                        label="Token"
                        placeholder="Enter the 6-digit token"
                        {...form.getInputProps("code")}
                        mb={"md"}
                    />
                    <Center>
                        <Button type="submit">Submit Code</Button>
                    </Center>
                </form>
            </Box>

            <Center>
                <Box bg={"white"} p={"md"}>
                    <QRCodeSVG size={256} value={totpURI} />
                </Box>
            </Center>
        </>
    );
}