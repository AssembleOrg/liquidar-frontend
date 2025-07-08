import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Notifications,
  Settings,
} from '@mui/icons-material';
import { useAuthStore } from '../../application/stores/authStore';
import { useThemeStore } from '../../application/stores/themeStore';
import { useNavigate } from 'react-router-dom';

interface AppBarCustomProps {
  title: string;
}

const AppBarCustom: React.FC<AppBarCustomProps> = ({ title }) => {
  const { user, logout } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGoToProfile = () => {
    navigate('/perfil');
    handleClose();
  };

  const handleGoToConfig = () => {
    navigate('/configuracion');
    handleClose();
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton color="inherit" sx={{ mr: 1 }}>
          <Notifications />
        </IconButton>
        <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
          {mode === 'light' ? '🌙' : '☀️'}
        </IconButton>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
            {user?.firstName?.charAt(0) || 'U'}
          </Avatar>
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleGoToProfile}>
            <AccountCircle sx={{ mr: 1 }} />
            Perfil
          </MenuItem>
          <MenuItem onClick={handleGoToConfig}>
            <Settings sx={{ mr: 1 }} />
            Configuración
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1 }} />
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarCustom; 