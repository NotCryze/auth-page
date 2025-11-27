import { Button, Center, Paper, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { authClient } from "../../lib/auth-client";
import { notifications } from "@mantine/notifications";
import { IconExclamationMark } from "@tabler/icons-react";


export default function AccountDeleteTab() {
    const openDeleteConfirmationModal = () => modals.openConfirmModal({
        title: 'Confirm Account Deletion',
        children: (
            <div>
                Are you sure you want to delete your account? This action is irreversible.
            </div>
        ),
        labels: { confirm: 'Delete Account', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: () => {
            authClient.deleteUser({ callbackURL: import.meta.env.VITE_CALLBACK_URL });
            notifications.show({
                title: 'Account Deletion Initiated',
                message: 'Please check your email to confirm account deletion.',
                color: 'yellow',
                withCloseButton: true,
                withBorder: true,
                icon: <IconExclamationMark />,
            });
        },
    });

    return (
        <Paper withBorder p={"md"} style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0 }} pos={"relative"}>
            <Title order={3} mb={"md"}>Delete Account</Title>
            <div>
                Deleting your account is a permanent action and cannot be undone. All your data will be permanently removed from our servers. Please ensure that you have backed up any important information before proceeding.
            </div>
            <Center>
                <Button mt={"md"} color="red" onClick={openDeleteConfirmationModal}>
                    Delete My Account
                </Button>
            </Center>
        </Paper>
    )
}