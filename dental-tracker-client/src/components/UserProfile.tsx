import { Box, Typography, Avatar } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5164/api/User/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Profil bilgileri alınamadı:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'rgba(25, 118, 210, 0.05)',
      }}
    >
      <Avatar
        sx={{
          bgcolor: '#1976d2',
          width: 45,
          height: 45,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        {userProfile ? (
          userProfile.firstName.charAt(0) + userProfile.lastName.charAt(0)
        ) : (
          <PersonIcon />
        )}
      </Avatar>
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: '#2c3e50',
            lineHeight: 1.2,
          }}
        >
          {userProfile ? (
            `${userProfile.firstName} ${userProfile.lastName}`
          ) : (
            'Kullanıcı'
          )}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.875rem',
          }}
        >
          {userProfile?.email || 'E-posta yüklenemedi'}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserProfile; 