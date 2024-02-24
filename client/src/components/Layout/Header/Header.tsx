import { Anchor, Menu, Box, Flex, Button } from '@mantine/core';
import { Container, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import {
  IconMenu2,
  IconUser,
  IconSettings,
  IconDoor,
} from '@tabler/icons-react';
import { useLogout } from '../../../generated/auth/auth';
import {
  getGetLoginStatusQueryKey,
  useGetLoginStatus,
} from '../../../generated/user/user';
import { useQueryClient } from '@tanstack/react-query';
import { modals } from '@mantine/modals';
import { LoginAndSignup } from '@/components/Auth/LoginAndSignup';

const Header = () => {
  const queryClient = useQueryClient();

  const user = useGetLoginStatus();
  const logoutMutation = useLogout({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getGetLoginStatusQueryKey(),
        });
      },
    },
  });

  const handleClickLoginRegister = () => {
    modals.open({
      title: (
        <Text fz="lg" fw={700}>
          Log in / register
        </Text>
      ),
      children: <LoginAndSignup onLogin={modals.closeAll} />,
    });
  };

  return (
    <Container size="xl" style={{ height: '100%' }}>
      <Flex align="center" justify="space-between" style={{ height: '100%' }}>
        <Anchor to={'/'} component={Link}>
          <Text style={{ fontSize: '1.7rem' }} c="white" w={'bolder'}>
            beating.games
          </Text>
        </Anchor>
        <Box>
          {user.data?.isLoggedIn ? (
            <Menu width={120}>
              <Menu.Target>
                <Button variant="subtle" rightSection={<IconMenu2 />}>
                  Menu
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <>
                  <Menu.Label>User</Menu.Label>
                  <Menu.Item
                    rightSection={<IconUser />}
                    component={Link}
                    to={`/user/${user.data?.username}`}
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Item
                    rightSection={<IconSettings />}
                    component={Link}
                    to={`/user/settings`}
                  >
                    Settings
                  </Menu.Item>
                  <Menu.Item
                    color="red.6"
                    rightSection={<IconDoor />}
                    onClick={() => logoutMutation.mutateAsync()}
                  >
                    Log out
                  </Menu.Item>
                </>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button onClick={handleClickLoginRegister}>
              Log in / register
            </Button>
          )}
        </Box>
      </Flex>
    </Container>
  );
};

export default Header;
