import { useMemo, type ReactNode } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";

interface AppThemeProps {
  children: ReactNode;
}

const AppTheme = ({ children }: AppThemeProps) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: prefersDarkMode ? "#c084fc" : "#7c3aed",
          },
          background: prefersDarkMode
            ? { default: "#121218", paper: "#1b1b23" }
            : { default: "#f7f7fb", paper: "#ffffff" },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        },
        components: {
          MuiButton: {
            defaultProps: { disableElevation: true },
          },
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppTheme;
