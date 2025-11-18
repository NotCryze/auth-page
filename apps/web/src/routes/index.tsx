import { Button, Center, Flex, Title } from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { authClient } from '../lib/auth-client';
import LoadingSpinner from '../components/misc/loading-spinner';

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate();
    const { data: session, isPending: loading } = authClient.useSession();
    
    if (loading) {
        return <Center h={"100%"}>
            <LoadingSpinner />
        </Center>;
    }

    return <>
        <Center h={"100%"}>
            {!session ?
                <Flex align={"center"} direction={"column"} rowGap={"md"}>
                    <Button onClick={() => navigate({ to: "/auth" })}>Login</Button>
                </Flex>
                :
                <Flex align={"center"} direction={"column"} rowGap={"md"}>
                    <Title>Welcome, {session.user.name || session.user.email}!</Title>
                    <Button onClick={async () => {
                        await authClient.signOut();
                        navigate({ to: "/auth" });
                    }}>Sign Out</Button>
                </Flex>}
        </Center>
    </>
}