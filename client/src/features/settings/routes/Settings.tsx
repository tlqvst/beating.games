import { UserHero } from '@/components/User/UserHero/UserHero';
import { FIVE_MEGABYTES } from '@/constants/fileSizes';
import { UpdateUserSettingsDto } from '@/generated/dto';
import {
  getGetProfileQueryKey,
  useGetLoginStatus,
  useGetProfile,
  useUpdateUserSettings,
} from '@/generated/user/user';
import { downloadFileAsBlob } from '@/utils/downloadFile';
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
import axios from 'axios';

export const Settings = () => {
  useDocumentTitle('User settings | beating.games');

  const loginStatus = useGetLoginStatus();
  const profile = useGetProfile(loginStatus.data?.username ?? '', {
    query: {
      enabled: Boolean(loginStatus.data?.username),
    },
  });
  const queryClient = useQueryClient();
  const updateSettingsMutation = useUpdateUserSettings();

  const form = useForm<UpdateUserSettingsDto>({
    initialValues: {
      background: undefined,
      avatar: undefined,
    },
  });

  const handleSubmit = form.onSubmit(async (settings) => {
    try {
      await updateSettingsMutation.mutateAsync({ data: settings });
      queryClient.invalidateQueries({
        queryKey: getGetProfileQueryKey(loginStatus.data!.username!),
      });
      showNotification({
        title: 'Success!',
        message: 'Your settings have been saved',
      });
    } catch (error: unknown) {}
  });

  const handleExportGames = async () => {
    try {
      const response = await axios.post<string>(
        `${import.meta.env.VITE_API_BASE}/api/game/export`,
      );
      const data = response.data;

      downloadFileAsBlob('games.csv', data);
    } catch (error) {
      notifications.show({
        title: 'Export failed',
        message:
          'Your list of games could not be exported. Please try again later.',
      });
    }
  };

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
            </SimpleGrid>
            <Button type="submit" mr="md">
              Save settings
            </Button>
            <Button variant="subtle" onClick={handleExportGames}>
              Export games to CSV
            </Button>
          </form>
        </Container>
      </>
    );

  return null;
};
