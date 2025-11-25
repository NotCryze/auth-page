import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { requireAuth } from '../../lib/route-auth';
import { authClient } from '../../lib/auth-client';

export const Route = createFileRoute('/profile/')({
  beforeLoad: requireAuth,
  loader: async ({ context }) => {
    const sessions = await authClient.listSessions();
    return {
      ...context.session,
      sessions: sessions.data
    };
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { session, user, sessions } = useLoaderData({ from: Route.id });
  console.log("Profile sessions:", sessions);

  return <div>Hello "/profile/"!</div>
}
