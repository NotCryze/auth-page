import { Center, Tabs } from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import SignUpTab from '../components/auth/sign-up-tab'
import SignInTab from '../components/auth/sign-in-tab'
import { useEffect, useState } from 'react'
import { authClient } from '../lib/auth-client'
import { VerifyEmailTab } from '../components/auth/verify-email-tab'
import type { TabsProps } from '@mantine/core'
import ForgotPasswordTab from '../components/auth/forgot-password-tab'


export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState<TabsProps['value']>('sign-in');

  useEffect(() => {
    // If user is already authenticated, redirect to home page
    authClient.getSession().then(({ data: session }) => {
      {
        if (session) {
          navigate({ to: "/" });
        }
      }
    });

    // Set document title based on active tab
    switch (activeTab) {
      case 'sign-in':
        document.title = "Sign In";
        break;
      case 'sign-up':
        document.title = "Sign Up";
        break;
      case 'verify-email':
        document.title = "Verify Email";
        break;
    }
  }, [activeTab]);

  function openEmailVerificationTab(email: string) {
    setEmail(email);
    setActiveTab('verify-email');
  }

  return <>
    <Center h={"100%"} p={"md"}>
      <Tabs value={activeTab} onChange={setActiveTab} w={{ base: "100%", sm: 600, lg: 500 }}>
        {(activeTab === 'sign-in' || activeTab === 'sign-up') && <Tabs.List grow>
          <Tabs.Tab value="sign-in"><b>Sign In</b></Tabs.Tab>
          <Tabs.Tab value="sign-up"><b>Sign Up</b></Tabs.Tab>
        </Tabs.List>}
        <Tabs.Panel value="sign-in">
          <SignInTab openEmailVerificationTab={openEmailVerificationTab} openForgotPasswordTab={() => setActiveTab("forgot-password")} />
        </Tabs.Panel>
        <Tabs.Panel value="sign-up">
          <SignUpTab openEmailVerificationTab={openEmailVerificationTab} />
        </Tabs.Panel>
        <Tabs.Panel value="verify-email">
          {activeTab === "verify-email" && (
            <VerifyEmailTab email={email} />
          )}
        </Tabs.Panel>
        <Tabs.Panel value="forgot-password">
          <ForgotPasswordTab openSignInTab={() => setActiveTab('sign-in')} />
        </Tabs.Panel>
      </Tabs>
    </Center>
  </>
}