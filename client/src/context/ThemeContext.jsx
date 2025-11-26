import React, { createContext, useContext, useState, useEffect } from "react";
import { lightTheme, darkTheme, themeValues } from "../theme/theme"; // Import themeValues

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Function to set CSS variables on the root element
  const setCssVariables = (root, colors, shadows, borderRadius, spacing) => {
    // --- 1. COLORS ---
    const colorMap = {
      // Primary Palette
      "--color-primary": colors.primary.main,
      "--color-primary-light": colors.primary.light,
      "--color-primary-dark": colors.primary.dark,
      "--color-primary-contrast": colors.primary.contrastText,

      // Secondary Palette
      "--color-secondary": colors.secondary.main,
      "--color-secondary-light": colors.secondary.light,
      "--color-secondary-dark": colors.secondary.dark,
      "--color-secondary-contrast": colors.secondary.contrastText,

      // Status Colors
      "--color-success": colors.success.main,
      "--color-warning": colors.warning.main,
      "--color-error": colors.error.main,
      "--color-info": colors.info.main,

      // Text Colors
      "--color-text-primary": colors.text.primary,
      "--color-text-secondary": colors.text.secondary,

      // Backgrounds
      "--color-bg-default": colors.background.default,
      "--color-bg-paper": colors.background.paper,
      "--color-bg-glass": colors.background.glass, // Used for global utility glass

      // Glass properties
      "--glass-bg": colors.glass.background,
      "--glass-border": colors.glass.border,
      "--glass-blur": colors.glass.blur,
      "--glass-shadow": colors.glass.shadow,
    };

    // --- 2. SHADOWS (using standard names for custom components) ---
    const shadowMap = {
      "--shadow-light": shadows.light,
      "--shadow-medium": shadows.medium,
      "--shadow-heavy": shadows.heavy,
      "--shadow-glass": shadows.glass,
    };

    // --- 3. BORDER RADIUS ---
    const radiusMap = {
      "--radius-lg": `${borderRadius.lg}px`,
      "--radius-md": `${borderRadius.md}px`,
      "--radius-sm": `${borderRadius.sm}px`,
    };

    // --- 4. SPACING (optional, good practice) ---
    const spacingMap = {
      "--spacing-xs": `${spacing.xs}px`,
      "--spacing-sm": `${spacing.sm}px`,
      "--spacing-md": `${spacing.md}px`,
    };

    const variableMaps = [colorMap, shadowMap, radiusMap, spacingMap];

    variableMaps.forEach((map) => {
      Object.entries(map).forEach(([name, value]) => {
        root.style.setProperty(name, value);
      });
    });
  };

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    // Get the base theme values (which includes shadows, radius, spacing)
    const { shadows, borderRadius, spacing } = themeValues;

    // Get the dynamic palette values from the active theme
    const activeColors = theme.palette;

    setCssVariables(
      document.documentElement,
      activeColors,
      shadows,
      borderRadius,
      spacing
    );
  }, [isDarkMode, theme]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { lightTheme, darkTheme } from "../theme/theme";

// const ThemeContext = createContext();

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) throw new Error("useTheme must be used within ThemeProvider");
//   return context;
// };

// export const ThemeProvider = ({ children }) => {
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     const saved = localStorage.getItem("theme");
//     if (saved) return saved === "dark";
//     return window.matchMedia("(prefers-color-scheme: dark)").matches;
//   });

//   const toggleTheme = () => setIsDarkMode(prev => !prev);

//   const theme = isDarkMode ? darkTheme : lightTheme;

//   useEffect(() => {
//     localStorage.setItem("theme", isDarkMode ? "dark" : "light");

//     const root = document.documentElement;
//     const colors = theme.palette;

//     // 🌟 ONLY Glass variables — nothing else
//     root.style.setProperty("--glass-bg", colors.glass.background);
//     root.style.setProperty("--glass-border", colors.glass.border);
//     root.style.setProperty("--glass-blur", colors.glass.blur);
//     root.style.setProperty("--glass-shadow", colors.glass.shadow);

//     // Text colors for custom components
//     root.style.setProperty("--text-primary", colors.text.primary);
//     root.style.setProperty("--text-secondary", colors.text.secondary);
//   }, [isDarkMode, theme]);

//   return (
//     <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { lightTheme, darkTheme } from '../theme/theme';

// const ThemeContext = createContext();

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };

// export const ThemeProvider = ({ children }) => {
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     // Check localStorage first, then system preference
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme) {
//       return savedTheme === 'dark';
//     }
//     return window.matchMedia('(prefers-color-scheme: dark)').matches;
//   });

//   const toggleTheme = () => {
//     setIsDarkMode(prev => !prev);
//   };

//   const theme = isDarkMode ? darkTheme : lightTheme;

//   useEffect(() => {
//     // Save theme preference to localStorage
//     localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

//     // Update CSS variables for non-MUI components
//     const root = document.documentElement;
//     const colors = isDarkMode ? darkTheme.palette : lightTheme.palette;

//     root.style.setProperty('--color-primary', colors.primary.main);
//     root.style.setProperty('--color-text-primary', colors.text.primary);
//     root.style.setProperty('--color-text-secondary', colors.text.secondary);
//     root.style.setProperty('--color-bg-paper', 'transparent');
//     root.style.setProperty('--color-bg-default', 'transparent');
//     root.style.setProperty('--color-bg-glass', colors.background.glass);
//   }, [isDarkMode]);

//   const value = {
//     isDarkMode,
//     toggleTheme,
//     theme,
//   };

//   return (
//     <ThemeContext.Provider value={value}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };
