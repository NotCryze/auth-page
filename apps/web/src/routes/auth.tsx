import { Center, Tabs } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import SignUpTab from '../components/auth/sign-up-tab'
import SignInTab from '../components/auth/sign-in-tab'


export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})



function RouteComponent() {
  return <>
    <Center h={"100%"}>
      <Tabs defaultValue="sign-in" variant="outline">
        <Tabs.List grow>
          <Tabs.Tab value="sign-in"><b>Sign In</b></Tabs.Tab>
          <Tabs.Tab value="sign-up"><b>Sign Up</b></Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="sign-in">
          <SignInTab />
        </Tabs.Panel>
        <Tabs.Panel value="sign-up">
          <SignUpTab />
        </Tabs.Panel>
      </Tabs>
    </Center>
  </>
}