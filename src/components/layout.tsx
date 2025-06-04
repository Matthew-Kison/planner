"use client";

import { useAuthStore } from "@/store/auth-store";
import { useThemeStore } from "@/store/theme-store";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  // 로그인 페이지에서는 헤더와 사이드바를 보여주지 않음
  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          isMobile={isMobile}
        />
        <Sidebar
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isMobile={isMobile}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            pt: "var(--header-height)",
            width: { sm: `calc(100% - ${isSidebarOpen ? 240 : 0}px)` },
            ml: { sm: isSidebarOpen ? "240px" : 0 },
            transition: (theme) =>
              theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
