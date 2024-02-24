import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../../lib/mantine/theme';

const heroCommon = {
  minHeight: '35vmax',
  marginBottom: '2rem',
  paddingBottom: '2rem',
  width: '100%',
};

const padder = recipe({
  base: { ...heroCommon, display: 'none' },

  variants: {
    isSticky: {
      true: {
        display: 'block',
      },
    },
  },
});

const hero = recipe({
  base: {
    ...heroCommon,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    color: 'white',
    position: 'relative',
    top: 0,
    left: 0,
    zIndex: 3,
    transition: '0.25s ease-out',
  },

  variants: {
    isSticky: {
      true: {
        position: 'fixed',
        minHeight: 'unset',
        paddingTop: 'var(--app-shell-header-height)',
      },
    },
  },
});

const stats = recipe({
  base: {
    textTransform: 'uppercase',
  },

  variants: {
    isSticky: {
      true: {
        '@media': {
          [`(max-width: ${vars.breakpoints.sm})`]: {
            display: 'none',
          },
        },
      },
    },
  },
});

const gradient = style({
  backgroundImage: `linear-gradient(to bottom, transparent, ${vars.colors.dark[9]} 90%)`,
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: '100%',
});

const user = style({
  paddingTop: vars.spacing.xl,
});

const avatar = recipe({
  base: {
    width: '8rem',
    height: '8rem',
  },

  variants: {
    isSticky: {
      true: {
        width: '4rem',
        height: '4rem',
      },
    },
  },
});

export const userHeroStyles = {
  heroCommon,
  hero,
  padder,
  gradient,
  user,
  avatar,
  stats,
};
