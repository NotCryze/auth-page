import { Paper } from "@mantine/core";
import ChangePassword from "./change-password";
import SetPassword from "./set-password";

export default function ChangePasswordTab({ email, hasPasswordAccount }: {
  email: string,
  hasPasswordAccount: boolean
}) {
  return (
    <Paper withBorder p={"md"} style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0 }} pos={"relative"}>
      {hasPasswordAccount ? (
        <ChangePassword />
      ) : (
        <SetPassword email={email} />
      )}
    </Paper>
  )
}