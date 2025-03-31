import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  ListItemButton,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Flag as FlagIcon,
  LocalHospital as LocalHospitalIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path?: string;
  onClick?: () => void;
}

interface SideMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SideMenu = ({ isOpen, onToggle }: SideMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems: MenuItem[] = [
    { text: 'Ana Sayfa', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Hedeflerim', icon: <FlagIcon />, path: '/goals' },
    { text: 'Çıkış Yap', icon: <LogoutIcon />, onClick: handleLogout },
  ];

  const isCurrentPath = (path: string | undefined) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="toggle menu"
        onClick={onToggle}
        sx={{
          position: 'fixed',
          left: isOpen ? '260px' : '10px',
          top: '10px',
          zIndex: 1200,
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'left 0.3s ease',
          '&:hover': {
            backgroundColor: 'white',
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Paper
        elevation={4}
        sx={{
          position: 'fixed',
          left: isOpen ? 0 : '-280px',
          top: 0,
          bottom: 0,
          width: '280px',
          backgroundColor: 'white',
          transition: 'left 0.3s ease',
          zIndex: 1100,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '0 16px 16px 0',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <LocalHospitalIcon
            sx={{
              fontSize: 32,
              color: 'white',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)' },
              },
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'white',
              letterSpacing: '0.5px',
            }}
          >
            Dental Tracker
          </Typography>
        </Box>

        <List sx={{ flex: 1, pt: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleMenuClick(item)}
                selected={item.path ? isCurrentPath(item.path) : false}
                sx={{
                  py: 1.5,
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#2196f3',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '&:hover': {
                      backgroundColor: '#1976d2',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isCurrentPath(item.path) ? 'white' : '#2196f3',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  );
};

export default SideMenu; 