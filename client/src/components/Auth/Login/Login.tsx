import { TextInput, Button, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLogin } from '../../../generated/auth/auth';
import { ApiError } from '../../../types/apiError';
import { useQueryClient } from '@tanstack/react-query';
import { getGetLoginStatusQueryKey } from '@/generated/user/user';

const Login = ({ onLogin }: { onLogin?: () => void }) => {
  const loginMutation = useLogin();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync({
        data: values,
      });
      queryClient.invalidateQueries({
        queryKey: getGetLoginStatusQueryKey(),
      });
      onLogin?.();
    } catch (error: unknown) {}
  });

  return (
    <form onSubmit={handleSubmit}>
      {loginMutation.isError && (
        <Alert color="red" title="Error" mt="md">
          {(loginMutation.error as ApiError).response.data.message}
        </Alert>
      )}

      <TextInput
        mt="md"
        required
        autoComplete="username"
        label="Username"
        id="login-username"
        placeholder="Username"
        {...form.getInputProps('username')}
      />
      <TextInput
        mt="md"
        required
        type="password"
        autoComplete="current-password"
        label="Password"
        id="login-password"
        placeholder="Password"
        {...form.getInputProps('password')}
      />
      <Button type="submit" mt="md" fullWidth>
        Log in
      </Button>
    </form>
  );
};

export default Login;
