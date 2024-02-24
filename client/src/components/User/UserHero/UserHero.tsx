import { Avatar, Container, Group, Title, Text, Box } from '@mantine/core';
import { IUserHero } from './IUserHero';
import { useEffect, useState } from 'react';
import { userHeroStyles } from './UserHero.css';
import clsx from 'clsx';
import { vars } from '@/lib/mantine/theme';

export const UserHero = ({
  username,
  background,
  avatar,
  inProgress,
  beaten,
  wantToPlay,
  continual,
  dropped,
}: IUserHero) => {
  const [isSticky, setisSticky] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 550) {
      return setisSticky(true);
    }
    setisSticky(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Padder, is visible when the user banner is sticky to prevent the page from jumping */}
      <div
        className={clsx(
          userHeroStyles.heroCommon,
          userHeroStyles.padder({ isSticky }),
        )}
      />

      <section
        className={clsx(
          userHeroStyles.heroCommon,
          userHeroStyles.hero({
            isSticky,
          }),
        )}
        style={{
          backgroundImage: background
            ? `url(${background})`
            : `linear-gradient(
              ${vars.colors.primaryColors[9]}, ${vars.colors.primaryColors[9]}
              )`,
        }}
      >
        <div className={userHeroStyles.gradient} />
        <Container size="xl" w="100%" style={{ zIndex: 1 }}>
          <Group align={'end'} className={userHeroStyles.user}>
            <Avatar
              className={userHeroStyles.avatar({ isSticky })}
              src={avatar ?? undefined}
            />
            <Box>
              <Title>{username}'s profile</Title>
              <Group style={{ textTransform: 'uppercase' }}>
                {inProgress && (
                  <Text c="dimmed">
                    Playing {`${inProgress} game${inProgress !== 1 ? 's' : ''}`}
                  </Text>
                )}
                {continual && (
                  <Text c="dimmed">
                    Continuously playing{' '}
                    {`${continual} game${continual !== 1 ? 's' : ''}`}
                  </Text>
                )}
                {beaten && (
                  <Text c="dimmed">
                    Beaten {`${beaten} game${beaten !== 1 ? 's' : ''}`}
                  </Text>
                )}
                {wantToPlay && (
                  <Text c="dimmed">
                    Want to play{' '}
                    {`${wantToPlay} game${wantToPlay !== 1 ? 's' : ''}`}
                  </Text>
                )}
                {dropped && (
                  <Text c="dimmed">
                    Dropped {`${dropped} game${dropped !== 1 ? 's' : ''}`}
                  </Text>
                )}
              </Group>
            </Box>
          </Group>
        </Container>
      </section>
    </>
  );
};
