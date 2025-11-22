import { IconButton, Tooltip } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = ({ sx = {} }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: "text.primary",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "action.hover",
            transform: "rotate(180deg)",
          },
          ...sx,
        }}>
        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
