"use client";

import { AppBar, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, IconButton } from "@mui/material";
import { Today as TodayIcon, Brightness4, Brightness7 } from "@mui/icons-material";
import Link from "next/link";
import { useThemeStore } from "@/store/theme-store";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen flex">
      <AppBar position="fixed" className="z-10">
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Todo App
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        className="w-[var(--sidebar-width)]"
        classes={{
          paper: "w-[var(--sidebar-width)] mt-[var(--header-height)]",
        }}
      >
        <List>
          <ListItem component={Link} href="/">
            <ListItemIcon>
              <TodayIcon />
            </ListItemIcon>
            <ListItemText primary="Today" />
          </ListItem>
          <ListItem>
            <IconButton onClick={toggleTheme} color="inherit" size="large">
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </ListItem>
        </List>
      </Drawer>

      <main className="flex-1 mt-[var(--header-height)] p-6">{children}</main>
    </div>
  );
}
