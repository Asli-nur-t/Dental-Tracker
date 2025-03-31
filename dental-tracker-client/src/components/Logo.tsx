import { Box, Typography } from '@mui/material';
import { LocalHospital } from '@mui/icons-material';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'light' | 'primary';
}

const Logo = ({ size = 'medium', color = 'primary' }: LogoProps) => {
  const sizes = {
    small: {
      icon: '1.8rem',
      text: '1.2rem',
      gap: 1
    },
    medium: {
      icon: '2.5rem',
      text: '1.8rem',
      gap: 1.5
    },
    large: {
      icon: '3.5rem',
      text: '2.5rem',
      gap: 2
    }
  };

  const colors = {
    light: {
      icon: '#ffffff',
      text: '#ffffff'
    },
    primary: {
      icon: '#1976d2',
      text: '#2c3e50'
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: sizes[size].gap,
        animation: 'fadeIn 0.5s ease-in-out',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}
    >
      <LocalHospital
        sx={{
          fontSize: sizes[size].icon,
          color: colors[color].icon,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)'
            },
            '50%': {
              transform: 'scale(1.1)'
            },
            '100%': {
              transform: 'scale(1)'
            }
          }
        }}
      />
      <Typography
        variant={size === 'small' ? 'h6' : size === 'medium' ? 'h4' : 'h3'}
        component="h1"
        sx={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 700,
          color: colors[color].text,
          letterSpacing: '0.5px',
          textTransform: 'none',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-4px',
            left: 0,
            width: '100%',
            height: '2px',
            background: colors[color].icon,
            transform: 'scaleX(0)',
            transition: 'transform 0.3s ease-in-out',
            transformOrigin: 'right'
          },
          '&:hover::after': {
            transform: 'scaleX(1)',
            transformOrigin: 'left'
          }
        }}
      >
        Dental Tracker
      </Typography>
    </Box>
  );
};

export default Logo; 