import { Avatar, Flex, Paper, Text, Title } from "@mantine/core";

export default function AccountCard({ image, email, name }
    : {
        image?: string | null;
        email?: string | null;
        name?: string | null
    }) {

    return (
        <Paper p="xl" shadow="md" withBorder>
            <Flex align={"center"} gap={"md"}>
                <Avatar src={image || undefined} alt={email || "User Avatar"} size={100} radius={50} />
                <Flex direction={"column"}>
                    <Title m={0}>{name}</Title>
                    <Text c="dimmed">{email}</Text>
                </Flex>
            </Flex>
        </Paper>
    )
}
