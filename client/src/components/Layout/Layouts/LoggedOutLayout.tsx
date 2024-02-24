import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';

export const LoggedOutLayout = () => {
  return (
    <AppShell header={{ height: 64 }} padding={0}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};
