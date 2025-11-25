import { authClient } from "./auth-client";
import { redirect } from '@tanstack/react-router'


export async function requireAuth() {
    const session = await authClient.getSession();

    if (!session.data || session.error) {
        throw redirect({ to: '/auth' });
    }

    return { session: session.data };
}

export async function requireNoAuth() {
    const session = await authClient.getSession();

    if (session.data && !session.error) {
        throw redirect({ to: '/' });
    }

    return session.data;
}