declare module '@shared-ui/theme' {
  type ColorScheme = 'light' | 'dark';

  interface ThemeColors {
    primary: string;
    'primary-foreground': string;
    secondary: string;
    'secondary-foreground': string;
    accent: string;
    'accent-foreground': string;
    destructive: string;
    'destructive-foreground': string;
    background: string;
    foreground: string;
    card: string;
    'card-foreground': string;
    popover: string;
    'popover-foreground': string;
    muted: string;
    'muted-foreground': string;
    border: string;
    input: string;
    ring: string;
  }

  interface Theme {
    colors: ThemeColors;
    radius: string;
    colorScheme: ColorScheme;
  }
}