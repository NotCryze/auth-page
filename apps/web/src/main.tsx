import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
import { createRouter, RouterProvider } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree: routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme='dark'>
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>,
)
