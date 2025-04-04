import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5164/api/Auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError('');
      } else {
        setError(data.message || 'Şifre sıfırlama işlemi başarısız');
      }
    } catch (error) {
      setError('Bir hata oluştu');
    }
  };

  return (
    <Container 
      maxWidth={false}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        p: 2
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: { xs: 3, sm: 6 },
          width: '100%',
          maxWidth: '450px',
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          animation: 'slideUp 0.5s ease-out',
          '@keyframes slideUp': {
            '0%': {
              transform: 'translateY(20px)',
              opacity: 0
            },
            '100%': {
              transform: 'translateY(0)',
              opacity: 1
            }
          }
        }}
      >
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Logo size={isMobile ? "medium" : "large"} />
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease-in-out',
              '@keyframes fadeIn': {
                '0%': { opacity: 0 },
                '100%': { opacity: 1 }
              }
            }}
          >
            Şifre Sıfırlama
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              animation: 'shake 0.5s ease-in-out',
              '@keyframes shake': {
                '0%, 100%': { transform: 'translateX(0)' },
                '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
                '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
              }
            }}
          >
            {error}
          </Alert>
        )}

        {success ? (
          <Box
            sx={{
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease-in-out'
            }}
          >
            <Alert 
              severity="success" 
              sx={{ mb: 3 }}
            >
              Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.
            </Alert>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Lütfen e-posta kutunuzu kontrol edin ve şifrenizi sıfırlamak için gönderilen bağlantıya tıklayın.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)'
                }
              }}
            >
              Giriş Sayfasına Dön
            </Button>
          </Box>
        ) : (
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}
          >
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
              Şifrenizi sıfırlamak için kayıtlı e-posta adresinizi girin.
            </Typography>

            <TextField
              fullWidth
              label="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)'
                }
              }}
            >
              Şifremi Sıfırla
            </Button>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 2
              }}
            >
              <Link
                href="/login"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline'
                  }
                }}
              >
                Giriş sayfasına dön
              </Link>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPassword; 