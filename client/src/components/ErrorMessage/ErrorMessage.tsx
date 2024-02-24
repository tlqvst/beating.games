import { Button, Text } from '@mantine/core';
import { FallbackProps } from 'react-error-boundary';

const ErrorMessage = ({
  error,
  resetErrorBoundary,
}: Partial<FallbackProps>) => {
  return (
    <>
      <Text>An error occurred:</Text>
      <Text>{error?.message}</Text>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </>
  );
};

export default ErrorMessage;
