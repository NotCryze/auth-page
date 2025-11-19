import { Button } from "@mantine/core";
import { useState } from "react";
import type { ButtonProps } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export function BetterAuthActionButton({
    action,
    children,
    ...props
}: {
    action: () => Promise<{ error: null | { message?: string } }>;
    children: React.ReactNode;
    successmessage?: string;
} & ButtonProps) {
    const [loading, setLoading] = useState(false);

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
        else if (props.successmessage) {
            notifications.show({
                title: "Success",
                message: props.successmessage,
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
            onClick={handleAction}
        >
            {children}
        </Button>
    );
}