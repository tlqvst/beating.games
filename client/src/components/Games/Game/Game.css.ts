import { style } from '@vanilla-extract/css';
import { vars } from '../../../lib/mantine/theme';

const root = style({
  height: 220,
  position: 'relative',
  textAlign: 'center',
  [`@media (max-width: ${vars.breakpoints.md})`]: {
    width: '100%',
  },
  margin: '2px',
  color: 'white',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxShadow: '9999px 9999px rgba(0,0,0,0.55) inset',
  overflow: 'hidden',
  textShadow: '2px 2px black',
  ':hover': {
    boxShadow: '9999px 9999px rgba(0,0,0,0.8) inset',
  },
});

const content = style({
  transition: '0.3s ease-in-out',
  display: 'flex',
  padding: vars.spacing.sm,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  height: '100%',
  overflow: 'hidden',

  selectors: {
    [`${root}:hover &`]: {
      opacity: 0,
      overflow: 'hidden',
      visibility: 'hidden',
      transform: 'scale(0.5)',
    },
  },
});

const hoverWrapper = style({
  position: 'absolute',
  opacity: 0,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: 'auto',
  width: '100%',
  transition: '0.3s ease-in-out',
  display: 'flex',
  padding: vars.spacing.sm,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  height: '100%',

  selectors: {
    [`${root}:hover &`]: {
      opacity: 1,
    },
  },
});

const hoverContent = style({
  overflow: 'auto',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  margin: 'auto',
  transition: '0.3s ease-in-out',
  opacity: 0,
  whiteSpace: 'pre-wrap',
  transform: 'translateX(100%)',
  height: '100%',

  selectors: {
    [`${root}:hover &`]: {
      transform: 'translateX(0px)',
      opacity: 1,
    },
  },
});

const image = style({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: -1,
});

const imageTag = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const hoverContentInner = style({
  margin: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  overflowX: 'hidden',
  flexDirection: 'column',
});

const textArea = style({
  minHeight: '2rem',
});

const title = style({
  margin: 'auto',
  minHeight: '5rem',
  alignItems: 'center',
  display: 'flex',
  fontSize: vars.fontSizes.xl,
  fontWeight: 700,
});

const playtime = style({
  margin: 'auto auto 0 auto',
});

const icon = style({
  display: 'block',
  position: 'absolute',
  zIndex: 2,
  userSelect: 'none',
  selectors: {
    [`${hoverContent} &`]: {
      color: 'white',
    },
  },
});

const iconTopLeft = style({
  top: '2%',
  left: '2%',
});

const iconTopRight = style({
  top: '2%',
  right: '2%',
});

const iconBottomLeft = style({
  left: '2%',
  bottom: '2%',
  cursor: 'pointer',
});

const iconBottomRight = style({
  right: '2%',
  bottom: '2%',
  cursor: 'pointer',
});

export const gameStyles = {
  iconBottomRight,
  iconBottomLeft,
  iconTopRight,
  iconTopLeft,
  icon,
  playtime,
  title,
  textArea,
  content,
  hoverContent,
  hoverContentInner,
  hoverWrapper,
  image,
  imageTag,
  root,
};
