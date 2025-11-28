import type { Passkey } from "@better-auth/passkey";
import { Button, Center, Flex, LoadingOverlay, Paper, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import z from "zod";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "@tanstack/react-router";

const passkeySchema = z.object({
    name: z.string().min(1, "Name is required"),
});

type PasskeyInput = z.infer<typeof passkeySchema>;

export default function PassKeyManagement({
    passkeys
}: {
    passkeys?: Passkey[] | null;
}) {
    const openAddPasskeyModal = () => {
        modals.open({
            title: "Add New Passkey",
            children: <PasskeyForm />,
            centered: true,
            size: "md",
        });
    };

    return (
        <Paper withBorder p={"md"} style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0, }} pos={"relative"}>
            {passkeys && passkeys?.length > 0 ? (
                passkeys.map((passkey) => (
                    <Paper withBorder p={"md"} mb={"md"} key={passkey.id}>
                        <Text fw={500}>{passkey.name}</Text>
                    </Paper>
                ))
            ) : (
                <Paper withBorder p={"md"} mb={"md"}>
                    <Text>No passkeys yet.</Text>
                    <Text c={"dimmed"} size="sm">Add your first passkey for your account.</Text>
                </Paper>
            )}

            <Center>
                <Button onClick={openAddPasskeyModal}>
                    Add Passkey
                </Button>
            </Center>
        </Paper>
    );
}

function PasskeyForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<PasskeyInput>({
        initialValues: {
            name: "",
        },
        validate: zod4Resolver(passkeySchema)
    });

    const handleSubmit = async (data: PasskeyInput) => {
        setLoading(true);

        authClient.passkey.addPasskey({ ...data }, {
            onRequest: async () => {
                setLoading(true);
            },
            onError: error => {
                notifications.show({
                    title: "Error",
                    message: error.error.message || "An error occurred while adding the passkey.",
                    color: "red",
                    withCloseButton: true,
                    withBorder: true,
                    icon: <IconX />
                });
                setLoading(false);
            },
            onSuccess: () => {
                setLoading(false);
                modals.closeAll();
                router.invalidate();
            }
        });
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
                label="Passkey Name"
                placeholder="Name your passkey"
                {...form.getInputProps("name")}
                mb={"md"}
                disabled={loading}
                error={form.errors.name}
            />
            <Flex justify={"flex-end"} gap={"md"}>
                <Button
                    type="submit"
                    loading={loading}
                >
                    Add Passkey
                </Button>
                <Button
                    color="gray"
                    onClick={() => modals.closeAll()}
                    disabled={loading}
                >
                    Cancel
                </Button>
            </Flex>
        </form>
    );
}