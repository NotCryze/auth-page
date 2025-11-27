import { Badge, Box, Flex, Paper, Title } from "@mantine/core";
import { IconCheck, IconDeviceDesktop, IconDeviceMobile, IconX } from "@tabler/icons-react";
import type { Session } from "better-auth"
import { UAParser } from "ua-parser-js";
import { authClient } from "../../lib/auth-client";
import { notifications } from "@mantine/notifications";
import { useRouter } from "@tanstack/react-router";


export default function SessionCard({ session, current }: {
    session: Session,
    current?: boolean
}) {
    const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;
    const router = useRouter();

    function getBrowserInformation() {
        if (!userAgentInfo) return "Unknown Browser";
        const browserName = userAgentInfo.browser.name || "Unknown Browser";
        const browserOS = userAgentInfo.os.name || "Unknown OS";
        return `${browserName}, ${browserOS}`;
    }

    async function handleRevokeSession() {
        await authClient.revokeSession({ token: session.token }, {
            onError: (error) => {
                notifications.show({
                    title: "Error",
                    message: error.error.message || "Failed to revoke session",
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
                    message: "Session revoked successfully",
                    color: "green",
                    withCloseButton: true,
                    withBorder: true,
                    icon: <IconCheck />
                })
            }
        });
    }

    return (
        <Paper withBorder p={"md"}>
            <Box w={"100%"}>
                <Flex align={"center"} justify={"space-between"} mb={"md"}>
                    <Title order={4}>
                        {getBrowserInformation()}
                    </Title>
                    {current
                        ? <Badge>Current Session</Badge>
                        : <Badge color="red" variant="outline" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={handleRevokeSession}>Revoke Session</Badge>}
                </Flex>
                <Flex gap={"md"} align={"center"}>
                    {userAgentInfo?.device.type === "mobile" ? (
                        <IconDeviceMobile size={48} />
                    ) : (
                        <IconDeviceDesktop size={48} />
                    )}
                    <Flex direction={"column"} justify={"center"}>
                        <div><strong>IP Address:</strong> {session.ipAddress || "Unknown IP"}</div>
                        <div><strong>Created At:</strong> {new Date(session.createdAt).toLocaleString()}</div>
                        <div><strong>Expires At:</strong> {new Date(session.expiresAt).toLocaleString()}</div>
                    </Flex>
                </Flex>
            </Box>
        </Paper>
    )
}