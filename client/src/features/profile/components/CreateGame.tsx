import { Alert, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCreateGame } from '@/generated/game/game';
import { GameFormFields } from './GameFormFields';
import { UpsertGameRequestDto } from '@/generated/dto';

export const CreateGame = ({ onCreate }: { onCreate?: () => void }) => {
  const mutation = useCreateGame();

  const form = useForm<UpsertGameRequestDto>({
    initialValues: {
      achievementsLink: '',
      background: undefined,
      content: '',
      date: new Date(),
      owned: false,
      perfectGame: false,
      playtime: 0,
      status: '',
      system: '',
      title: '',
    },
  });

  const handleSubmit = form.onSubmit(async (game) => {
    await mutation.mutateAsync({ data: game });
    onCreate?.();
  });

  return (
    <form onSubmit={handleSubmit}>
      {Boolean(mutation.error) && (
        <Alert color="red">Failed to create game</Alert>
      )}

      <GameFormFields form={form} />

      <Button type="submit" fullWidth>
        Add game
      </Button>
    </form>
  );
};
