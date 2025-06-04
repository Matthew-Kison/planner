"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { useThemeStore } from "@/store/theme-store";
import { lightTheme, darkTheme } from "@/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <AppRouterCacheProvider>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </DndProvider>
    </AppRouterCacheProvider>
  );
}
