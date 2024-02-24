import { TextInput, Button, Text, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSignupUser } from '@/generated/user/user';
import { SignupUserDto } from '@/generated/dto';
import { AxiosError } from 'axios';
import { capitalize } from '@/utils/string';
import { notifications } from '@mantine/notifications';

const Signup = ({
  onSignup,
}: {
  onSignup?: (values: SignupUserDto) => void;
}) => {
  const mutation = useSignupUser();

  const form = useForm<SignupUserDto>({
    initialValues: {
      name: '',
      email: '',
      username: '',
      password: '',
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await mutation.mutateAsync({ data: values });
      notifications.show({
        color: 'green',
        title: 'Success',
        message: 'Your account has been created, you can sign in!',
      });
      form.reset();
      onSignup?.(values);
    } catch (error: unknown) {}
  });

  const errors: string | string[] = (mutation.error as AxiosError<any>)
    ?.response?.data?.message;

  return (
    <>
      {mutation.error && (
        <Alert color="red" my="md">
          {Array.isArray(errors) && (
            <>
              {errors.map((error: string) => (
                <Text fz="sm" mb="xs">
                  {capitalize(error)}
                </Text>
              ))}
            </>
          )}

          {typeof errors === 'string' && (
            <Text fz="sm" mb="xs">
              {capitalize(errors)}
            </Text>
          )}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextInput
          required
          mt="md"
          autoComplete="name"
          label="Name"
          id="signup-name"
          placeholder="Name"
          {...form.getInputProps('name')}
        />
        <TextInput
          required
          mt="md"
          type="email"
          autoComplete="email"
          label="Email"
          id="signup-email"
          placeholder="Email"
          {...form.getInputProps('email')}
        />
        <TextInput
          required
          mt="md"
          autoComplete="username"
          label="Username"
          id="signup-username"
          placeholder="Username"
          {...form.getInputProps('username')}
        />
        <TextInput
          required
          mt="md"
          type="password"
          autoComplete="current-password"
          label="Password"
          id="signup-password"
          placeholder="Password"
          {...form.getInputProps('password')}
        />
        <Button type="submit" mt="md" fullWidth loading={mutation.isPending}>
          Sign up!
        </Button>
      </form>
    </>
  );
};

export default Signup;
