import {
  ActionIcon,
  Affix,
  Alert,
  Anchor,
  Center,
  Container,
  Drawer,
  Pagination,
  SimpleGrid,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { Link, useParams } from 'react-router-dom';
import { Loading } from '@/components/Loading/Loading';
import {
  getGetGamesQueryKey,
  useDeleteGame,
  useGetGames,
} from '@/generated/game/game';
import { useGetProfile, useGetLoginStatus } from '@/generated/user/user';
import { UserHero } from '@/components/User/UserHero/UserHero';
import { Game } from '@/components/Games/Game/Game';
import { useQueryClient } from '@tanstack/react-query';
import { modals } from '@mantine/modals';
import { IconFilter, IconPlus } from '@tabler/icons-react';
import { CreateGame } from '../components/CreateGame';
import { notifications, showNotification } from '@mantine/notifications';
import { getAvatarUrl, getBackgroundUrl } from '@/utils/imageUrls';
import { UpdateGame } from '../components/UpdateGame';
import { GameDto } from '@/generated/dto';
import { useDisclosure, useDocumentTitle, useHotkeys } from '@mantine/hooks';
import { GameFilters } from '@/components/Games/GameFilters/GameFilters';
import { useCallback, useRef, useState } from 'react';
import { IGameFilters } from '@/components/Games/GameFilters/IGameFilters';

export const Profile = () => {
  const params = useParams();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<IGameFilters>();
  const [page, setPage] = useState(0);
  const [filtersOpen, { open: openFilters, close: closeFilters }] =
    useDisclosure(false);

  const upperPaginationRef = useRef<HTMLDivElement>(null);

  useHotkeys([
    ['alt+A', () => handleCreateGame()],
    ['alt+F', () => openFilters()],
  ]);

  const user = useGetLoginStatus({
    query: { throwOnError: false, retry: false },
  });
  const games = useGetGames(
    params.username!,
    {
      ...filters,
      skip: page * 30,
    },
    {
      query: { throwOnError: false, placeholderData: (a) => a },
    },
  );

  const profile = useGetProfile(params.username ?? '', {
    query: { throwOnError: false, placeholderData: (a) => a },
  });

  useDocumentTitle(`${profile.data?.username}'s profile | beating.games`);

  const deleteGameMutation = useDeleteGame();

  const handleFiltered = (filters: IGameFilters) => {
    closeFilters();
    setFilters(filters);
  };

  const handleClearedFilters = () => {
    closeFilters();
    setFilters(undefined);
  };

  const handleGameDeleted = async (id: number) => {
    try {
      await deleteGameMutation.mutateAsync({
        id,
      });
      queryClient.invalidateQueries({
        queryKey: getGetGamesQueryKey(params.username!),
      });
    } catch (error: unknown) {
      showNotification({
        color: 'red',
        title: 'Delete failed',
        message: 'Failed to delete game. Please try again later',
      });
    }
  };

  const showDeleteConfirmation = useCallback(
    (id: number) =>
      modals.openConfirmModal({
        title: 'Confirm deletion',
        children: 'Are you sure you want to delete this game?',
        onConfirm: () => handleGameDeleted(id),
        labels: {
          confirm: 'Yes',
          cancel: 'No',
        },
      }),
    [],
  );

  const handleGameCreated = useCallback(() => {
    modals.closeAll();
    queryClient.invalidateQueries({
      queryKey: getGetGamesQueryKey(params.username!),
    });
    notifications.show({
      title: 'Success',
      color: 'green',
      message: 'Game successfully created',
    });
  }, []);

  const handleGameUpdated = useCallback(() => {
    modals.closeAll();
    queryClient.invalidateQueries({
      queryKey: getGetGamesQueryKey(params.username!),
    });
  }, []);

  const handleCreateGame = useCallback(() => {
    modals.open({
      title: 'Add game',
      children: <CreateGame onCreate={handleGameCreated} />,
    });
  }, []);

  const handleUpdateGame = useCallback((game: GameDto) => {
    modals.open({
      title: 'Update game',
      children: <UpdateGame onUpdate={handleGameUpdated} game={game} />,
    });
  }, []);

  const handleChangedPage = useCallback(
    (page: number, scrollToTop: boolean) => {
      setPage(page - 1);
      if (scrollToTop && upperPaginationRef.current) {
        window.scrollTo(0, upperPaginationRef.current.offsetTop - 200);
      }
    },
    [page],
  );

  const getBackground = () =>
    profile.data?.background
      ? getBackgroundUrl(profile.data?.background)
      : undefined;

  const getAvatar = () =>
    profile.data?.avatar ? getAvatarUrl(profile.data?.avatar) : undefined;

  const isProfileOwner = user.data?.username === params.username!;
  const isGameOwner = (userId: number) => userId === user.data?.userId;

  if (profile.isLoading || games.isLoading) return <Loading />;

  if (games.isError || profile.isError)
    return (
      <Container my="xl">
        <Alert title={<Title>Failed to load user</Title>}>
          <Text>
            This user could not be found, or the database could not be reached.
            Please try again later, or{' '}
            <Anchor component={Link} to={'/'}>
              go home
            </Anchor>
            .
          </Text>
        </Alert>
      </Container>
    );

  return (
    <>
      <UserHero
        username={profile.data?.username ?? ''}
        background={getBackground()}
        avatar={getAvatar()}
        inProgress={games.data?.inProgress}
        beaten={games.data?.beaten}
        continual={games.data?.continual}
        dropped={games.data?.dropped}
        wantToPlay={games.data?.wantToPlay}
      />

      {isProfileOwner && (
        <Tooltip label="Click here to add a new game to your profile (ALT+A)">
          <Affix position={{ bottom: 20, right: 20 }}>
            <ActionIcon size={80} radius={100} onClick={handleCreateGame}>
              <IconPlus size={50} />
            </ActionIcon>
          </Affix>
        </Tooltip>
      )}

      <Tooltip label="Open filters (ALT+F)">
        <Affix position={{ bottom: 20, left: 20 }}>
          <ActionIcon size={80} radius={100} onClick={openFilters}>
            <IconFilter size={40} />
          </ActionIcon>
        </Affix>
      </Tooltip>

      <Drawer opened={filtersOpen} onClose={closeFilters} zIndex={300}>
        <GameFilters
          filters={filters}
          onFilter={(filters) => handleFiltered(filters)}
          onClearFilters={() => handleClearedFilters()}
        />
      </Drawer>

      <Container size="xl">
        <Center my="lg">
          <Pagination
            ref={upperPaginationRef}
            value={page + 1}
            onChange={(page) => handleChangedPage(page, false)}
            total={Math.ceil(games.data!.total / games.data!.take)}
          />
        </Center>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={1}>
          {games.data?.games.map((game) => (
            <Game
              key={game.id}
              game={game}
              onUpdate={
                isGameOwner(game.userId)
                  ? () => handleUpdateGame(game)
                  : undefined
              }
              onDelete={
                isGameOwner(game.userId)
                  ? () => showDeleteConfirmation(game.id)
                  : undefined
              }
            />
          ))}
        </SimpleGrid>

        <Center my="lg">
          <Pagination
            value={page + 1}
            onChange={(page) => handleChangedPage(page, true)}
            total={Math.ceil(games.data!.total / games.data!.take)}
          />
        </Center>
      </Container>
    </>
  );
};
