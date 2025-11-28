import { Flex, Skeleton, Tabs, type TabsProps } from '@mantine/core';
import { IconAuth2fa, IconFingerprint, IconKey, IconLink, IconPassword, IconTrash, IconUser } from '@tabler/icons-react';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import AccountCard from '../../components/account/account-card';
import ChangePasswordTab from '../../components/account/change-password-tab';
import DeleteTab from '../../components/account/delete-tab';
import LinkingTab from '../../components/account/linking-tab';
import PassKeyManagement from '../../components/account/passkey-management';
import SessionsTab from '../../components/account/sessions-tab';
import TwoFATab from '../../components/account/two-fa-tab';
import UpdateTab from '../../components/account/update-tab';
import { authClient } from '../../lib/auth-client';
import { requireAuth } from '../../lib/route-auth';

export const Route = createFileRoute('/account/')({
  beforeLoad: requireAuth,
  loader: async ({ context }) => {
    const [sessions, accounts, passkeys] = await Promise.all([
      authClient.listSessions(),
      authClient.listAccounts(),
      authClient.passkey.listUserPasskeys(),
    ]);
    // await new Promise(resolve => setTimeout(resolve, 3000)); // Promise simulating 3 seconds loading time
    return {
      ...context.session,
      sessions: sessions.data,
      accounts: accounts.data,
      passkeys: passkeys.data,
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
  const { session, user, sessions, accounts, passkeys } = useLoaderData({ from: Route.id });
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
          <Tabs.Tab value="manage-passkey"><IconFingerprint /></Tabs.Tab>
          <Tabs.Tab value="sessions"><IconKey /></Tabs.Tab>
          <Tabs.Tab value="linked-accounts"><IconLink /></Tabs.Tab>
          <Tabs.Tab value="delete-account"><IconTrash /></Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="manage-account-details">
          <UpdateTab {...user} />
        </Tabs.Panel>

        <Tabs.Panel value="change-password">
          <ChangePasswordTab email={user.email} hasPasswordAccount={accounts?.some(account => account.providerId === "credential") ?? false} />
        </Tabs.Panel>

        <Tabs.Panel value="manage-2fa">
          <TwoFATab hasPasswordAccount={accounts?.some(account => account.providerId === "credential") ?? false} hasTwoFactorEnabled={user.twoFactorEnabled ?? false} />
        </Tabs.Panel>

        <Tabs.Panel value="manage-passkey">
          <PassKeyManagement passkeys={passkeys} />
        </Tabs.Panel>

        <Tabs.Panel value="sessions">
          <SessionsTab currentSessionToken={session.token} sessions={sessions} />
        </Tabs.Panel>

        <Tabs.Panel value="linked-accounts">
          <LinkingTab accounts={accounts} />
        </Tabs.Panel>

        <Tabs.Panel value="delete-account">
          <DeleteTab />
        </Tabs.Panel>
      </Tabs>
    </Flex>
  )
}
