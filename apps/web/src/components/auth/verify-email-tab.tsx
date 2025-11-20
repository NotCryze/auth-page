import { Center, Paper, Text, Title } from "@mantine/core";
import { BetterAuthActionButton } from "./better-auth-action-button";
import { authClient } from "../../lib/auth-client";
import { useEffect, useRef, useState } from "react";

export function VerifyEmailTab({ email }: { email: string }) {

    async function handleResendVerificationEmail() {
        startEmailVerificationTimer();
        return authClient.sendVerificationEmail({ email, callbackURL: import.meta.env.VITE_CALLBACK_URL });
    }

    const [timeToNextEmail, setTimeToNextEmail] = useState(30);
    const interval = useRef<ReturnType<typeof setInterval>>(undefined);

    useEffect(() => {
        startEmailVerificationTimer();
        return () => {
            if (interval.current) clearInterval(interval.current);
        }
    }, []);

    function startEmailVerificationTimer(time = 30) {
        // Clear any existing interval first
        if (interval.current) clearInterval(interval.current);

        setTimeToNextEmail(time);

        interval.current = setInterval(() => {
            setTimeToNextEmail((prev) => {
                if (prev <= 1) {
                    clearInterval(interval.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    return <>
        <Paper withBorder p={"md"}>
            <Title order={2} mb={"md"}>Verify Your Email</Title>
            <Text size="lg" mb={"md"}>
                We have sent a verification email to <b>{email}</b>. Please check your inbox and click on the verification link to verify your email address.
            </Text>
            <Center>
                <BetterAuthActionButton action={handleResendVerificationEmail} successmessage="Verification email resent successfully!" disabled={timeToNextEmail > 0}>
                    {timeToNextEmail > 0
                        ? `Resend Email (${timeToNextEmail}s)`
                        : "Resend Email"}
                </BetterAuthActionButton>
            </Center>
        </Paper>
    </>
}