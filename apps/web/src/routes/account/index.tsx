import { Flex, Skeleton, Tabs, type TabsProps } from '@mantine/core';
import { IconAuth2fa, IconKey, IconLink, IconPassword, IconTrash, IconUser } from '@tabler/icons-react';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
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
    const accounts = await authClient.listAccounts();
    // await new Promise(resolve => setTimeout(resolve, 3000)); // Promise simulating 3 seconds loading time
    return {
      ...context.session,
      sessions: sessions.data,
      accounts: accounts.data,
    };
  },
  component: RouteComponent,
  pendingComponent: () => {
    return (
      <Flex align="center" direction={"column"} style={{ height: '100vh' }} mt={"xl"} gap={"md"}>
        <Skeleton height={150} width={400} />
        <Skeleton height={250} width={300} />
      </Flex>
    )
  },
})

function RouteComponent() {
  const { session, user, sessions, accounts } = useLoaderData({ from: Route.id });
  const [activeTab, setActiveTab] = useState<TabsProps['value']>(window.location.hash.substring(1) || 'manage-account-details');

  useEffect(() => {
    // Remove hash from URL after using it
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [])

  useEffect(() => {
    // Set document title based on active tab
    switch (activeTab) {
      case 'manage-account-details':
        document.title = "Manage Account Details";
        break;
      case 'change-password':
        document.title = "Change Password";
        break;
      case 'manage-2fa':
        document.title = "Manage Two-Factor Authentication";
        break;
      case 'sessions':
        document.title = "Manage Sessions";
        break;
      case 'linked-accounts':
        document.title = "Manage Linked Accounts";
        break;
      case 'delete-account':
        document.title = "Delete Account";
        break;
    }
  }, [activeTab]);

  return (
    <Flex direction="column" align="center" gap="md" mt="xl">
      <AccountCard {...user} />

      <Tabs value={activeTab} onChange={setActiveTab} w={{ base: "100%", sm: 600, lg: 500 }}>
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
          <AccountChangePasswordTab email={user.email} hasPasswordAccount={accounts?.some(account => account.providerId === "credential") ?? false} />
        </Tabs.Panel>

        <Tabs.Panel value="manage-2fa">
          <Account2FATab />
        </Tabs.Panel>

        <Tabs.Panel value="sessions">
          <AccountSessionsTab currentSessionToken={session.token} sessions={sessions} />
        </Tabs.Panel>

        <Tabs.Panel value="linked-accounts">
          <AccountLinkingTab accounts={accounts} />
        </Tabs.Panel>

        <Tabs.Panel value="delete-account">
          <AccountDeleteTab />
        </Tabs.Panel>
      </Tabs>
    </Flex>
  )
}
