import { Paper } from "@mantine/core";
import AccountChangePassword from "./account-change-password";
import AccountSetPassword from "./account-set-password";

export default function AccountChangePasswordTab({ email, hasPasswordAccount }: {
  email: string,
  hasPasswordAccount: boolean
}) {
  return (
    <Paper withBorder p={"md"} style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0 }} pos={"relative"}>
      {hasPasswordAccount ? (
        <AccountChangePassword />
      ) : (
        <AccountSetPassword email={email} />
      )}
    </Paper>
  )
}