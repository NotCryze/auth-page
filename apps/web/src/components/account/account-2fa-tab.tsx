import { Badge, Flex, Paper, Text, Title } from "@mantine/core"
import TwoFactorManagement from "./two-factor-management"


export default function Account2FATab({
    hasPasswordAccount,
    hasTwoFactorEnabled
}: {
    hasPasswordAccount: boolean,
    hasTwoFactorEnabled: boolean
}) {
    return (
        <Paper withBorder p={"md"} style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0 }} pos={"relative"}>
            <Flex justify={"space-between"} align={"center"} mb={"md"}>
                <Title order={3}>Two-Factor Authentication</Title>
                <Badge ml={"sm"} color={hasTwoFactorEnabled ? "green" : "red"} variant="filled" style={{ alignSelf: "center" }}>
                    {hasTwoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
            </Flex>
            {hasPasswordAccount ? (
                <TwoFactorManagement isEnabled={hasTwoFactorEnabled} />
            ) : (
                <Text>You need a password account to enable 2FA. Go and set a password in the password section.</Text>
            )}
        </Paper>
    )
}   