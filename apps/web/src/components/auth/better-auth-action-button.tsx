import { Button, Text } from "@mantine/core";
import { useState } from "react";
import type { ButtonProps } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";

export function BetterAuthActionButton({
    action,
    children,
    successMessage,
    requireConfirmation,
    ...props
}: {
    action: () => Promise<{ error: null | { message?: string } }>;
    children: React.ReactNode;
    successMessage?: string;
    requireConfirmation?: { enabled: boolean, message?: string, title?: string };
} & ButtonProps) {
    const [loading, setLoading] = useState(false);

    const openConfirmModal = () => modals.openConfirmModal({
        title: requireConfirmation?.title || "Please confirm",
        children: <Text>{requireConfirmation?.message || "Are you sure you want to proceed?"}</Text>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        onConfirm: () => handleAction(),
    })

    async function handleAction() {
        setLoading(true);
        const res = await action();

        if (res.error) {
            notifications.show({
                title: "Error",
                message: res.error.message,
                color: "red",
                withCloseButton: true,
                withBorder: true,
                icon: <IconX />
            });
        }
        else if (successMessage) {
            notifications.show({
                title: "Success",
                message: successMessage,
                color: "green",
                withCloseButton: true,
                withBorder: true,
                icon: <IconCheck />
            });
        }

        setLoading(false);
    }

    return (
        <Button
            {...props}
            loading={loading}
            loaderProps={{ type: "dots", color: "white" }}
            onClick={requireConfirmation?.enabled ? () => openConfirmModal() : handleAction}
        >
            {children}
        </Button>
    );
}