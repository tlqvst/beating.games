import { ActionIcon, Box, Text } from '@mantine/core';
import { clsx } from 'clsx';

import { IGame } from './IGame';
import { gameStyles } from './Game.css';
import {
  IconEdit,
  IconExternalLink,
  IconTrash,
  IconTrophy,
} from '@tabler/icons-react';
import { vars } from '@/lib/mantine/theme';
import { getGameUrl } from '@/utils/imageUrls';

export const Game = ({ game, onDelete, onUpdate }: IGame) => {
  const addedOnFormatted = new Date(game.addedOn).toLocaleDateString();
  const dateFormatted = new Date(game.date).toLocaleDateString();

  return (
    <Box className={gameStyles.root}>
      <Box className={gameStyles.image}>
        <img
          src={
            Boolean(game.background)
              ? getGameUrl(game.background)
              : `/images/bg.svg`
          }
          className={gameStyles.imageTag}
        />
      </Box>
      <Box className={gameStyles.content}>
        <Box className={gameStyles.textArea}>{dateFormatted}</Box>
        <Box className={gameStyles.textArea}>{game.system}</Box>
        <Box className={clsx(gameStyles.textArea, gameStyles.title)}>
          {game.title}
        </Box>
        {Boolean(game.playtime) && (
          <Box className={clsx(gameStyles.textArea, gameStyles.playtime)}>
            {game.playtime} hours
          </Box>
        )}
        <Box className={gameStyles.textArea}>{game.status}</Box>
      </Box>
      <Box className={gameStyles.hoverWrapper}>
        {onUpdate && (
          <ActionIcon
            variant="subtle"
            onClick={onUpdate}
            classNames={{
              root: clsx(gameStyles.icon, gameStyles.iconBottomLeft),
            }}
          >
            <IconEdit />
          </ActionIcon>
        )}

        {onDelete && (
          <ActionIcon
            variant="subtle"
            classNames={{
              root: clsx(gameStyles.icon, gameStyles.iconBottomRight),
            }}
            onClick={onDelete}
          >
            <IconTrash />
          </ActionIcon>
        )}

        {(game.perfectGame || game.achievementsLink) && (
          <ActionIcon
            variant="subtle"
            component={game.achievementsLink ? 'a' : 'div'}
            disabled={!Boolean(game.achievementsLink)}
            target="_blank"
            href={
              Boolean(game.achievementsLink) ? game.achievementsLink : undefined
            }
            classNames={{
              root: clsx(gameStyles.icon, gameStyles.iconTopLeft),
            }}
          >
            <IconTrophy
              color={
                game.perfectGame ? vars.colors.yellow[4] : vars.colors.primary
              }
            />
          </ActionIcon>
        )}

        {game.background && (
          <ActionIcon
            variant="subtle"
            component="a"
            target="_blank"
            href={getGameUrl(game.background)}
            classNames={{
              root: clsx(gameStyles.icon, gameStyles.iconTopRight),
            }}
          >
            <IconExternalLink />
          </ActionIcon>
        )}

        <Box className={gameStyles.hoverContent}>
          <Box className={gameStyles.hoverContentInner}>
            <Text mb="md">Added on: {addedOnFormatted}</Text>
            {game.content}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
