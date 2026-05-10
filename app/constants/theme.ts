import { MD3LightTheme } from 'react-native-paper';
import { Colors } from './colors';

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    secondary: Colors.primary,
    background: Colors.background,
    surface: Colors.surface,
    onPrimary: Colors.white,
  },
};
