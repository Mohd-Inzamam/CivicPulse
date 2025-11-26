import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
import "./theme/cssVariables.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { CssBaseline } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import lightTheme from "./theme/theme.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <MuiThemeProvider theme={lightTheme}>
      <ThemeProvider>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </MuiThemeProvider>
  </>
);
