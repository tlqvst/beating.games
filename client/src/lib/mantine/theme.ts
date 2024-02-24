import { CSSVariablesResolver, Container, createTheme } from '@mantine/core';
import { themeToVars } from '@mantine/vanilla-extract';

export const theme = createTheme({
  primaryColor: 'pink',
  primaryShade: 6,
  headings: {
    fontFamily: 'Proxima Nova, sans-serif',
    fontWeight: '700',
  },
  fontFamily: 'Proxima Nova, sans-serif',
  components: {
    Container: Container.extend({
      defaultProps: {
        size: 'xl',
      },
    }),
    Button: {
      styles: {
        label: {
          textTransform: 'uppercase',
        },
      },
    },
  },
});

export const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--mantine-color-body': theme.colors.dark[9],
  },
  light: {},
  dark: {},
});

export const vars = themeToVars(theme);
