import { createTheme } from "@mui/material/styles";

// Light theme colors
const lightColors = {
  primary: {
    main: "#1976d2",
    light: "#2196f3",
    dark: "#1565c0",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#7b1fa2",
    light: "#9c27b0",
    dark: "#6a1b9a",
    contrastText: "#ffffff",
  },
  success: {
    main: "#2e7d32",
    light: "#4caf50",
    dark: "#1b5e20",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#ed6c02",
    light: "#ff9800",
    dark: "#e65100",
    contrastText: "#ffffff",
  },
  error: {
    main: "#d32f2f",
    light: "#f44336",
    dark: "#c62828",
    contrastText: "#ffffff",
  },
  info: {
    main: "#1976d2",
    light: "#42a5f5",
    dark: "#1565c0",
    contrastText: "#ffffff",
  },
  grey: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
  text: {
    primary: "#212121",
    secondary: "#666666",
    disabled: "#bdbdbd",
  },
  background: {
    default: "#f8f9fa",
    paper: "#ffffff",
    glass: "rgba(255,255,255,0.45)",
    glassDark: "rgba(255,255,255,0.8)",
  },
  glass: {
    background: "rgba(255, 255, 255, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.35)",
    blur: "18px",
    shadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
};

// Dark theme colors
const darkColors = {
  primary: {
    main: "#90caf9",
    light: "#bbdefb",
    dark: "#42a5f5",
    contrastText: "#000000",
  },
  secondary: {
    main: "#ce93d8",
    light: "#f3e5f5",
    dark: "#ab47bc",
    contrastText: "#000000",
  },
  success: {
    main: "#81c784",
    light: "#c8e6c9",
    dark: "#4caf50",
    contrastText: "#000000",
  },
  warning: {
    main: "#ffb74d",
    light: "#ffe0b2",
    dark: "#ff9800",
    contrastText: "#000000",
  },
  error: {
    main: "#f48fb1",
    light: "#fce4ec",
    dark: "#e91e63",
    contrastText: "#000000",
  },
  info: {
    main: "#90caf9",
    light: "#bbdefb",
    dark: "#42a5f5",
    contrastText: "#000000",
  },
  grey: {
    50: "#212121",
    100: "#424242",
    200: "#616161",
    300: "#757575",
    400: "#9e9e9e",
    500: "#bdbdbd",
    600: "#e0e0e0",
    700: "#eeeeee",
    800: "#f5f5f5",
    900: "#fafafa",
  },
  text: {
    primary: "#ffffff",
    secondary: "#b3b3b3",
    disabled: "#666666",
  },
  background: {
    default: "#121212",
    paper: "#1e1e1e",
    glass: "rgba(30,30,30,0.45)",
    glassDark: "rgba(30,30,30,0.8)",
  },
  glass: {
    background: "rgba(0, 0, 0, 0.35)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    blur: "18px",
    shadow: "0 4px 25px rgba(0, 0, 0, 0.3)",
  },
};

// Charts
const chartColors = ["#1976d2", "#2e7d32", "#ed6c02", "#d32f2f", "#7b1fa2"];

// Spacing scale
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 50,
};

// Shadows
const shadows = {
  light: "0 2px 8px rgba(0,0,0,0.05)",
  medium: "0 4px 20px rgba(0,0,0,0.08)",
  heavy: "0 8px 32px rgba(0,0,0,0.12)",
  glass: "0 4px 20px rgba(0,0,0,0.05)",
};

// Typography
const typography = {
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
  ].join(","),
  h1: { fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: "2rem", fontWeight: 700, lineHeight: 1.3 },
  h3: { fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.3 },
  h4: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.4 },
  h5: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.4 },
  h6: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.5 },
  body1: { fontSize: "1rem", lineHeight: 1.5 },
  body2: { fontSize: "0.875rem", lineHeight: 1.5 },
  button: { textTransform: "none", fontWeight: 500 },
};

// Create theme
const createAppTheme = (mode = "light") => {
  const colors = mode === "dark" ? darkColors : lightColors;

  return createTheme({
    palette: {
      ...colors,
      mode,
    },
    typography,
    spacing: 8,
    shape: { borderRadius: borderRadius.md },

    shadows: [
      "none",
      shadows.light,
      shadows.medium,
      shadows.heavy,
      shadows.glass,
      ...Array(20).fill(shadows.heavy),
    ],

    components: {
      // ⭐ GLOBAL BACKGROUND (Glassmorphism Foundation)
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            // background: `
            //   radial-gradient(circle at top left, #dfe9f3 0%, #ffffff 40%),
            //   linear-gradient(135deg, #c3d0f8 0%, #e8ecf7 100%)
            // `,
            // darker version in case we need it
            //             background: `
            //              radial-gradient(circle at top left, #b4c6dd 0%, #dce3ed 40%),
            //              linear-gradient(135deg, #8fa4d6 0%, #c0cde4 100%)
            //              `,

            background: `
            radial-gradient(circle at top left, #c7d4e5 0%, #e3e8f0 40%),
            linear-gradient(135deg, #9eb3e0 0%, #ccd6ea 100%)
            `,
            backgroundAttachment: "fixed",
            minHeight: "100vh",
          },

          ...(mode === "dark" && {
            body: {
              background: `
                radial-gradient(circle at top left, #1b1b2f 0%, #0f0f17 60%),
                linear-gradient(135deg, #0d0d13 0%, #1c1c27 100%)
              `,
              backgroundAttachment: "fixed",
              minHeight: "100vh",
            },
          }),
        },
      },

      // Buttons
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 600,
            padding: "10px 18px",
            boxShadow: "none",
            transition: "all 0.25s ease",
            "&:hover": {
              boxShadow: shadows.light,
              transform: "translateY(-1px)",
            },
          },
          contained: {
            "&:hover": { boxShadow: shadows.medium },
          },
        },
      },

      // Cards → iOS + Glassmorphism
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "22px",
            background: colors.background.glass,
            backdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.08)",
            transition: "0.3s ease",
            "&:hover": {
              boxShadow:
                "0 6px 18px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.10)",
              transform: "translateY(-4px)",
            },

            ...(mode === "dark" && {
              background: colors.background.glass,
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(24px) saturate(140%)",
            }),
          },
        },
      },

      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: borderRadius.md,
            },
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: shadows.light,
            backdropFilter: "blur(16px) saturate(180%)",
          },
        },
      },
    },
  });
};

export const themeValues = {
  lightColors,
  darkColors,
  chartColors,
  spacing,
  borderRadius,
  shadows,
  typography,
};

export const lightTheme = createAppTheme("light");
export const darkTheme = createAppTheme("dark");

export default lightTheme;
