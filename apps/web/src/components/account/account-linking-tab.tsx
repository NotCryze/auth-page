import { Paper, Title } from "@mantine/core";
import { SUPPORTED_O_AUTH_PROVIDERS } from "../../lib/o-auth-providers";
import LinkedAccountCard from "./linked-account-card";

export default function AccountLinkingTab({ accounts }: {
  accounts?: Array<{
    id: string;
    providerId: string;
    createdAt: Date;
    updatedAt: Date;
    accountId: string;
    scopes: string[]
  }> | null;
}) {
  const nonCredentialAccounts = accounts?.filter(account => account.providerId !== "credential") || [];

  return (
    <Paper withBorder p={"md"} style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0 }} pos={"relative"}>
      <Title order={3} mb={"md"}>Linked Accounts</Title>
      {nonCredentialAccounts.length > 0 ? (
        nonCredentialAccounts.map((account) => (
          <LinkedAccountCard key={account.providerId} provider={account.providerId} account={account} />
        ))
      ) : (
        <div>No linked accounts found.</div>
      )}

      <Title order={4} mt={"xl"} mb={"md"}>Link Other Accounts</Title>
      {SUPPORTED_O_AUTH_PROVIDERS.filter(provider => !nonCredentialAccounts.some(account => account.providerId === provider)).map((providerId) => (
        <LinkedAccountCard key={providerId} provider={providerId} account={null} />
      ))}
    </Paper>
  )
}