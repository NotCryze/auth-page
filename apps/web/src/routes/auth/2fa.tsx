import { Flex, Tabs } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import TotpTab from '../../components/auth/2fa/totp-tab'
import { requireNoAuth } from '../../lib/route-auth'
import BackupCodesTab from '../../components/auth/2fa/backup-codes-tab'

export const Route = createFileRoute('/auth/2fa')({
  beforeLoad: requireNoAuth,
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <Flex justify="center" mt={"xl"}>
      <Tabs defaultValue="Authenticator" w={{ base: "100%", sm: 600, lg: 500 }}>
        <Tabs.List grow>
          <Tabs.Tab value="Authenticator">Authenticator</Tabs.Tab>
          <Tabs.Tab value="Backup Code">Backup Code</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="Authenticator">
          <TotpTab />
        </Tabs.Panel>
        <Tabs.Panel value="Backup Code">
          <BackupCodesTab />
        </Tabs.Panel>
      </Tabs>
    </Flex>
  </>
}
