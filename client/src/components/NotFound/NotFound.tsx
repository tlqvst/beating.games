import { Alert, Anchor, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <Alert title={<Title>404 - Not found.</Title>} my="xl">
      <Text>
        The requested page could not be found. Perhaps you'd like to{' '}
        <Anchor component={Link} to={'/'}>
          go home
        </Anchor>{' '}
        instead?
      </Text>
    </Alert>
  );
};
