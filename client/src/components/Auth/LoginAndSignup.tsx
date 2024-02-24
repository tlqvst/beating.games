import { Box, Container, Paper, Tabs } from '@mantine/core';
import { useState } from 'react';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { IconDoor, IconForms } from '@tabler/icons-react';

export const LoginAndSignup = ({
  onLogin,
  onSignup,
}: {
  onLogin?: () => void;
  onSignup?: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<
    string | 'login' | 'signup' | null
  >('login');

  const handleSignup = () => {
    setActiveTab('login');
    onSignup?.();
  };

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorMessage}>
        <Container>
          <Paper>
            <Box>
              <Tabs variant="outline" value={activeTab} onChange={setActiveTab}>
                <Tabs.List grow>
                  <Tabs.Tab value="login" rightSection={<IconDoor />}>
                    Log in
                  </Tabs.Tab>
                  <Tabs.Tab value="signup" rightSection={<IconForms />}>
                    Signup
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="login">
                  <Login onLogin={onLogin} />
                </Tabs.Panel>

                <Tabs.Panel value="signup">
                  <Signup onSignup={handleSignup} />
                </Tabs.Panel>
              </Tabs>
            </Box>
          </Paper>
        </Container>
      </ErrorBoundary>
    </>
  );
};
