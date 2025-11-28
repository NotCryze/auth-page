import { Center, Paper, Title } from "@mantine/core";
import { authClient } from "../../lib/auth-client";
import { BetterAuthActionButton } from "../auth/better-auth-action-button";


export default function DeleteTab() {

    async function handleDeleteAccount() {
        return await authClient.deleteUser({ callbackURL: import.meta.env.VITE_CALLBACK_URL });
    }

    return (
        <Paper withBorder p={"md"} style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0 }} pos={"relative"}>
            <Title order={3} mb={"md"}>Delete Account</Title>
            <div>
                Deleting your account is a permanent action and cannot be undone. All your data will be permanently removed from our servers. Please ensure that you have backed up any important information before proceeding.
            </div>
            <Center>
                <BetterAuthActionButton mt={"md"} color="red" action={handleDeleteAccount} requireConfirmation={{ enabled: true, message: "Are you sure you want to delete your account? This action is irreversible.", title: "Confirm Account Deletion" }} successMessage="Account deletion initiated. Please check your email to confirm.">
                    Delete My Account
                </BetterAuthActionButton>
            </Center>
        </Paper>
    )
}