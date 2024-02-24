import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import axios from 'axios';
import { Notifications } from '@mantine/notifications';
import { resolver, theme } from './lib/mantine/theme';

import '@mantine/core/styles.layer.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/dates/styles.css';
import './styles/global.css';
import { AppRoutes } from './routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 0,
      retry: 0,
    },
  },
});

axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        defaultColorScheme="dark"
        theme={theme}
        cssVariablesResolver={resolver}
      >
        <ErrorBoundary FallbackComponent={ErrorMessage}>
          <ModalsProvider>
            <Notifications />
            <AppRoutes />
          </ModalsProvider>
        </ErrorBoundary>
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
