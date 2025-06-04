import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import { Today as TodayIcon, Brightness4, Brightness7 } from "@mui/icons-material";
import Link from "next/link";
import { useThemeStore } from "@/store/theme-store";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export default function Sidebar({ open, onClose, isMobile }: SidebarProps) {
  const { isDarkMode, toggleTheme } = useThemeStore();

  const drawer = (
    <>
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
    </>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          pt: "var(--header-height)",
          backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
          color: isDarkMode ? 'white' : 'inherit',
          borderRight: isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
} 