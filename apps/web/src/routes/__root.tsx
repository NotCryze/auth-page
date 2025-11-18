import { AppShell, Box, Group, Title } from '@mantine/core'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'


function RootLayout() {
    return <AppShell
        header={{ height: 60 }}
    >
        <AppShell.Header>
            <Group h="100%" px="md" justify='space-between'>
                <Title>Auth Page</Title>
            </Group>
        </AppShell.Header>
        <AppShell.Main>
            <Box h={"calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - var(--mantine-spacing-md) - var(--mantine-spacing-md))"}>
                <Outlet />
                <TanStackRouterDevtools position="bottom-right" />
            </Box>
        </AppShell.Main>
    </AppShell>
}

export const Route = createRootRoute({ component: RootLayout })