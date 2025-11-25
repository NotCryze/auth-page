import { Flex, Tabs } from '@mantine/core';
import { IconAuth2fa, IconKey, IconLink, IconPassword, IconTrash, IconUser } from '@tabler/icons-react';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import Account2FATab from '../../components/account/account-2fa-tab';
import AccountCard from '../../components/account/account-card';
import AccountChangePasswordTab from '../../components/account/account-change-password-tab';
import AccountDeleteTab from '../../components/account/account-delete-tab';
import AccountLinkingTab from '../../components/account/account-linking-tab';
import AccountSessionsTab from '../../components/account/account-sessions-tab';
import AccountUpdateTab from '../../components/account/account-update-tab';
import { authClient } from '../../lib/auth-client';
import { requireAuth } from '../../lib/route-auth';

export const Route = createFileRoute('/account/')({
  beforeLoad: requireAuth,
  loader: async ({ context }) => {
    const sessions = await authClient.listSessions();
    return {
      ...context.session,
      sessions: sessions.data
    };
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { session, user, sessions } = useLoaderData({ from: Route.id });

  return (
    <Flex direction="column" align="center" gap="md" mt="xl">
      <AccountCard {...user} />

      <Tabs defaultValue="manage-account-details">
        <Tabs.List grow>
          <Tabs.Tab value="manage-account-details"><IconUser /></Tabs.Tab>
          <Tabs.Tab value="change-password"><IconPassword /></Tabs.Tab>
          <Tabs.Tab value="manage-2fa"><IconAuth2fa /></Tabs.Tab>
          <Tabs.Tab value="sessions"><IconKey /></Tabs.Tab>
          <Tabs.Tab value="linked-accounts"><IconLink /></Tabs.Tab>
          <Tabs.Tab value="delete-account"><IconTrash /></Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="manage-account-details">
          <AccountUpdateTab {...user} />
        </Tabs.Panel>

        <Tabs.Panel value="change-password">
          <AccountChangePasswordTab />
        </Tabs.Panel>

        <Tabs.Panel value="manage-2fa">
          <Account2FATab />
        </Tabs.Panel>

        <Tabs.Panel value="sessions">
          <AccountSessionsTab />
        </Tabs.Panel>

        <Tabs.Panel value="linked-accounts">
          <AccountLinkingTab />
        </Tabs.Panel>

        <Tabs.Panel value="delete-account">
          <AccountDeleteTab />
        </Tabs.Panel>
      </Tabs>
    </Flex>
  )
}
