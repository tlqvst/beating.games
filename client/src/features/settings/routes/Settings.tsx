import { UserHero } from '@/components/User/UserHero/UserHero';
import { FIVE_MEGABYTES } from '@/constants/fileSizes';
import { UpdateUserSettingsDto } from '@/generated/dto';
import {
  getGetProfileQueryKey,
  useGetLoginStatus,
  useGetProfile,
  useUpdateUserSettings,
} from '@/generated/user/user';
import { getAvatarUrl, getBackgroundUrl } from '@/utils/imageUrls';
import {
  Box,
  Button,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import { useDocumentTitle } from '@mantine/hooks';
import { notifications, showNotification } from '@mantine/notifications';
import { IconUpload } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

export const Settings = () => {
  useDocumentTitle('User settings | beating.games');

  const loginStatus = useGetLoginStatus();
  const profile = useGetProfile(loginStatus.data?.username ?? '', {
    query: {
      enabled: Boolean(loginStatus.data?.username),
    },
  });
  const queryClient = useQueryClient();
  const mutation = useUpdateUserSettings();

  const form = useForm<UpdateUserSettingsDto>({
    initialValues: {
      background: undefined,
      avatar: undefined,
    },
  });

  const handleSubmit = form.onSubmit(async (settings) => {
    try {
      await mutation.mutateAsync({ data: settings });
      queryClient.invalidateQueries({
        queryKey: getGetProfileQueryKey(loginStatus.data!.username!),
      });
      showNotification({
        title: 'Success!',
        message: 'Your settings have been saved',
      });
    } catch (error: unknown) {}
  });

  const getBackground = () => {
    if (form.values.background)
      return URL.createObjectURL(form.values.background);
    if (profile.data?.background)
      return getBackgroundUrl(profile.data.background);

    return undefined;
  };

  const getAvatar = () => {
    if (form.values.avatar) return URL.createObjectURL(form.values.avatar);
    if (profile.data?.avatar) return getAvatarUrl(profile.data.avatar);

    return undefined;
  };

  if (loginStatus.data)
    return (
      <>
        <UserHero
          username={loginStatus.data.username}
          background={getBackground()}
          avatar={getAvatar()}
        />
        <Container>
          <Title my={'md'}>User settings</Title>
          <Divider my={'md'} />
          <form onSubmit={handleSubmit}>
            <SimpleGrid cols={{ base: 1, md: 2 }} mb="lg">
              <Box>
                <Dropzone
                  maxSize={FIVE_MEGABYTES}
                  onReject={() =>
                    notifications.show({
                      color: 'red',
                      title: 'Image too large',
                      message: 'Max file size is 5 MB',
                    })
                  }
                  onDrop={(files) => form.setFieldValue('avatar', files[0])}
                  mb="md"
                >
                  <Group justify="center" align="center">
                    <IconUpload size={40} />
                    <Box>
                      <Text fz="lg" fw="bold">
                        Avatar
                      </Text>
                      <Text>Drag and drop your avatar or click to select</Text>
                    </Box>
                  </Group>
                </Dropzone>
              </Box>

              <Dropzone
                maxSize={FIVE_MEGABYTES}
                onReject={() =>
                  notifications.show({
                    color: 'red',
                    title: 'Image too large',
                    message: 'Max file size is 5 MB',
                  })
                }
                onDrop={(files) => form.setFieldValue('background', files[0])}
                mb="md"
              >
                <Group justify="center" align="center">
                  <IconUpload size={40} />
                  <Box>
                    <Text fz="lg" fw="bold">
                      Background
                    </Text>
                    <Text>
                      Drag and drop your background or click to select
                    </Text>
                  </Box>
                </Group>
              </Dropzone>
              {/* <TextInput
              mb="sm"
              label="Background"
              id="background"
              placeholder="Background"
              type={'url'}
              {...form.getInputProps('background')}
            />
            <TextInput
              mb="sm"
              label="Avatar"
              id="avatar"
              placeholder="Avatar"
              type={'url'}
              {...form.getInputProps('avatar')}
            /> */}
            </SimpleGrid>
            <Button type="submit">Save settings</Button>
          </form>
        </Container>
      </>
    );

  return null;
};
