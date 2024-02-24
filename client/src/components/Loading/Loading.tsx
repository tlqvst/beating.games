import { Center, Group, Loader } from '@mantine/core';

export const Loading = () => (
  <Center mt="xl">
    <Group align="center">
      <Loader />
      Fetching user..
    </Group>
  </Center>
);
