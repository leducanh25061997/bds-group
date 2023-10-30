import React, { useMemo } from 'react';
import { CssBaseline, ThemeOptions } from '@mui/material';
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from '@mui/material/styles';

import shape from './shape';
import palette from './palette';
import typography from './typography';
import componentsOverride from './overrides';
import shadows, { CustomShadowProps, customShadows } from './shadows';

interface ThemeConfigProps {
  children: React.ReactNode;
}

declare module '@mui/material' {
  interface ShapeOptions {
    borderRadiusSm: number | string;
    borderRadiusMd: number | string;
  }
}
declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadowProps;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    customShadows: CustomShadowProps;
  }

  interface Shape {
    borderRadiusSm: number | string;
    borderRadiusMd: number | string;
  }
  interface ShapeOptions {
    borderRadiusSm: number | string;
    borderRadiusMd: number | string;
  }

  interface PaletteColor {
    darker: string;
    lighter: string;
  }
}

export default function ThemeConfig(props: ThemeConfigProps) {
  const { children } = props;
  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette,
      shape,
      typography,
      shadows,
      customShadows,
    }),
    [],
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
