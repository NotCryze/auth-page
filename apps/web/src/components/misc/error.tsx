import { Button, Center, Flex, Paper, Title } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";

export default function ErrorComponent({ message, buttonRedirectPath, buttonText }: {
    message: string,
    buttonRedirectPath: string,
    buttonText: string
}) {
    const navigate = useNavigate();
    return (
        <Center h={"100%"}>
            <Paper withBorder p={"md"} pos={"relative"}>
                <Flex mb={"md"} direction={"column"} justify={"center"}>
                    <Title mb={"md"} order={3}>{message}</Title>
                    <Center>
                        <Button onClick={() => navigate({ to: buttonRedirectPath })}>{buttonText}</Button>
                    </Center>
                </Flex>
            </Paper>
        </Center>
    );
}