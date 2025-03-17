import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress
} from '@mui/material';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLongEnough = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasNumber && isLongEnough;
  };

  const handleVerifyEmail = async () => {
    if (!email) {
      setError('Email adresi zorunludur');
      return;
    }

    if (!validateEmail(email)) {
      setError('Geçerli bir email adresi giriniz');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5164/api/user/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsEmailVerified(true);
        setSuccess('Email doğrulandı. Yeni parolanızı belirleyebilirsiniz.');
      } else {
        setError(data.message || 'Kullanıcı bulunamadı');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword(newPassword)) {
      setError('Parola en az 8 karakter uzunluğunda olmalı, büyük-küçük harf ve rakam içermelidir');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Parolalar eşleşmiyor');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5164/api/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          newPassword,
          confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Parolanız başarıyla güncellendi');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Parola sıfırlama başarısız');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Parola Sıfırlama
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
            {success}
          </Alert>
        )}
        <Box sx={{ mt: 3, width: '100%' }}>
          {!isEmailVerified ? (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Adresi"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleVerifyEmail}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Email Doğrula'}
              </Button>
            </>
          ) : (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="Yeni Parola"
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Yeni Parola Tekrar"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Parolayı Güncelle'}
              </Button>
            </>
          )}
          <Box sx={{ textAlign: 'center' }}>
            <Link href="/login" variant="body2">
              {"Giriş sayfasına dön"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword; 