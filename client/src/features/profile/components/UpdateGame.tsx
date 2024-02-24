import { GameDto, UpsertGameRequestDto } from '@/generated/dto';
import { Alert, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useUpdateGame } from '@/generated/game/game';
import { GameFormFields } from './GameFormFields';

export const UpdateGame = ({
  game,
  onUpdate,
}: {
  game: GameDto;
  onUpdate?: () => void;
}) => {
  const mutation = useUpdateGame();

  const form = useForm<UpsertGameRequestDto>({
    initialValues: {
      achievementsLink: game.achievementsLink,
      background: undefined,
      content: game.content,
      date: new Date(game.date),
      owned: game.owned,
      perfectGame: game.perfectGame,
      playtime: game.playtime,
      status: game.status,
      system: game.system,
      title: game.title,
    },
  });

  const handleSubmit = form.onSubmit(async (updatedGame) => {
    await mutation.mutateAsync({ id: game.id.toString(), data: updatedGame });
    onUpdate?.();
  });

  return (
    <form onSubmit={handleSubmit}>
      {Boolean(mutation.error) && (
        <Alert color="red">Failed to update game</Alert>
      )}

      <GameFormFields form={form} />

      <Button type="submit" fullWidth>
        Update game
      </Button>
    </form>
  );
};
