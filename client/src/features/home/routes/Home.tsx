import {
  Box,
  Center,
  Container,
  Divider,
  Flex,
  Group,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import {
  IconBrush,
  IconClock,
  IconCurrencyDollar,
  IconDatabase,
  IconDeviceGamepad3,
  IconUser,
} from '@tabler/icons-react';
import { vars } from '@/lib/mantine/theme';
import classes from '@/styles/util.module.css';

export const Home = () => {
  return (
    <>
      <Flex
        mih={'50vh'}
        align="center"
        justify="center"
        style={{
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundImage: `url('/images/bg.svg')`,
        }}
      >
        <Container>
          <Group grow align="center" justify="center">
            <Box>
              <Title c="white">Track your gaming activity.</Title>
              <Title c="white">Track it in style.</Title>

              <Divider my="md" color="white" />

              <Text c="white">
                beating.games is a beautiful way to organize your video game
                backlog.
              </Text>
            </Box>
            <Box ta="center">
              <video
                autoPlay
                playsInline
                muted
                src="/videos/demo.mp4"
                style={{ maxWidth: '75%' }}
              />
            </Box>
          </Group>
        </Container>
      </Flex>

      <Container my="xl" py="xl" ta="center">
        <Title order={2} mb="lg">
          Features
        </Title>

        <SimpleGrid cols={{ base: 1, md: 3 }}>
          <Center>
            <Box>
              <IconDeviceGamepad3 size={120} stroke={1} />
              <Title order={3} mb="md">
                Game tracking
              </Title>
              <Text>
                Keep track of video games that you are playing, want to play and
                have beaten
              </Text>
            </Box>
          </Center>

          <Center>
            <Box>
              <IconUser size={120} stroke={1} />
              <Title order={3} mb="md">
                Profile
              </Title>
              <Text>
                Get your own customizable profile that you can share with
                friends
              </Text>
            </Box>
          </Center>

          <Center>
            <Box>
              <IconBrush size={120} stroke={1} />
              <Title order={3} mb="md">
                Filtering
              </Title>
              <Text>
                Filter your list of games by title, status, system, year and
                more
              </Text>
            </Box>
          </Center>
        </SimpleGrid>
      </Container>

      <Box bg={vars.colors.gray[9]} my="xl" py="xl">
        <Container>
          <Title ta="center" order={2}>
            Are you aware of your gaming habits?
          </Title>

          <SimpleGrid cols={{ base: 1, md: 2 }} my="xl">
            <Box>
              <Title order={3} my="xl">
                Overview
              </Title>

              <Text mb="md">
                Are you aware of how much time you spend playing games? Are you
                actually finishing the games you buy? Have you ever considered
                the statistics of your gaming habits?
              </Text>
              <Text>
                beating.games makes it easy to manage which games you are
                currently playing, games you have finished, and games that you
                want to play in the future. By actually looking at the numbers
                you'll increase your motivation to finish games
              </Text>
            </Box>
            <Center ta="center" className={classes.first}>
              <IconClock size={80} />
            </Center>
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, md: 2 }} my="xl">
            <Center ta="center" className={classes.first}>
              <IconCurrencyDollar size={80} />
            </Center>
            <Box>
              <Title order={3} my="xl">
                Get your moneys worth
              </Title>

              <Text mb="md">
                If you don't keep track of what games you're actually playing,
                you'll quickly find yourself in a position where you have too
                many games going at once. The next Steam sale will steal your
                wallet, while your backlog is ever-growing.
              </Text>
              <Text>
                By using beating.games you can increase the desire and
                motivation to finish the games you have already started.
              </Text>
            </Box>
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, md: 2 }} my="xl">
            <Box>
              <Title order={3} my="xl">
                Build your own database
              </Title>

              <Text mb="md">
                We have no intention of locking you down! Your data is yours!
              </Text>
              <Text>
                beating.games makes it easy to manage which games you are
                currently playing, games you have finished, and games that you
                want to play in the future. By actually looking at the numbers
                you'll increase your motivation to finish games
              </Text>
            </Box>
            <Center ta="center" className={classes.first}>
              <IconDatabase size={80} />
            </Center>
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
};
