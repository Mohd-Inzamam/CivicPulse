import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = ({ sx = {} }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      className="btn-icon"
      onClick={toggleTheme}
      title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      style={{
        color: "var(--ink-primary)",
        transition: "all 0.3s ease",
        ...sx,
      }}
    >
      {isDarkMode ? (
        <i className="ti ti-sun" aria-hidden="true" />
      ) : (
        <i className="ti ti-moon" aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggle;
