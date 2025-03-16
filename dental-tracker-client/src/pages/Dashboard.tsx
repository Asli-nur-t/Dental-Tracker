import { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Paper, CircularProgress } from '@mui/material';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
        Kullanıcı bilgileri yüklenemedi
      </Typography>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Hoş geldiniz, {user.firstName}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Aktiviteleriniz
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Henüz bir aktivite eklenmemiş.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Günlük İpuçları
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Düzenli diş fırçalama alışkanlığı edinmek için her gün aynı saatlerde fırçalamayı deneyin.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 