import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useThemeStore } from "@/store/theme-store";
import { useAuthStore } from "@/store/auth-store";

interface HeaderProps {
  onMenuClick: () => void;
  isMobile: boolean;
}

export default function Header({ onMenuClick, isMobile }: HeaderProps) {
  const { isDarkMode } = useThemeStore();
  const { signOut } = useAuthStore();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
        color: isDarkMode ? 'white' : 'inherit'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <div className="flex items-center">
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Todo App
          </Typography>
        </div>
        <Button
          variant="outlined"
          onClick={() => signOut()}
          className={isDarkMode ? "text-gray-300 border-gray-600 hover:bg-gray-800" : ""}
        >
          로그아웃
        </Button>
      </Toolbar>
    </AppBar>
  );
} 