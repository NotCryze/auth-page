import { Flex, Paper, Text, Title } from "@mantine/core";
import type { Session } from "better-auth"
import SessionCard from "./session-card";
import { BetterAuthActionButton } from "../auth/better-auth-action-button";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "@tanstack/react-router";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export default function SessionsTab({ currentSessionToken, sessions }: {
    currentSessionToken: string,
    sessions?: Session[] | null;
}) {
    const otherSessions = sessions?.filter(session => session.token !== currentSessionToken) || [];
    const currentSession = sessions?.find(session => session.token === currentSessionToken);
    const router = useRouter();

    async function handleRevokeOtherSessions() {
        return await authClient.revokeOtherSessions(undefined, {
            onError: (error) => {
                notifications.show({
                    title: "Error",
                    message: error.error.message || "Failed to revoke other sessions",
                    color: "red",
                    withCloseButton: true,
                    withBorder: true,
                    icon: <IconX />
                })
            },
            onSuccess: () => {
                router.invalidate();
                notifications.show({
                    title: "Success",
                    message: "Other sessions revoked successfully",
                    color: "green",
                    withCloseButton: true,
                    withBorder: true,
                    icon: <IconCheck />
                })
            }
        });
    }

    return (
        <Paper withBorder p={"md"} style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0 }} pos={"relative"}>
            <Title order={3} mb={"md"}>Manage Sessions</Title>
            {currentSession && (
                <SessionCard session={currentSession} current />
            )}
            <Flex align={"center"} justify={"space-between"}>
                <Title order={4} mb={"md"} mt={"md"}>Other Sessions</Title>
                {otherSessions.length > 0 && (
                    <BetterAuthActionButton action={handleRevokeOtherSessions} color={"red"}>Revoke other sessions</BetterAuthActionButton>
                )}
            </Flex>
            {otherSessions.length > 0 ? (
                otherSessions.map((session) => (
                    <SessionCard key={session.token} session={session} />
                ))
            ) : (
                <Text c="dimmed">No other active sessions.</Text>
            )}
        </Paper>
    )
}