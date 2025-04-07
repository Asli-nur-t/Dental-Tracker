import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Parola kriterleri kontrolü
  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Parola en az 8 karakter olmalıdır';
    }
    if (!hasUpperCase) {
      return 'Parola en az bir büyük harf içermelidir';
    }
    if (!hasLowerCase) {
      return 'Parola en az bir küçük harf içermelidir';
    }
    if (!hasNumbers) {
      return 'Parola en az bir rakam içermelidir';
    }
    if (!hasSpecialChar) {
      return 'Parola en az bir özel karakter içermelidir';
    }
    return null;
  };

  // Email doğrulama
  const handleVerifyEmail = async () => {
    if (!email) {
      setError('Email adresi boş olamaz');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5164/api/User/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowPasswordFields(true);
        setSuccess('Email doğrulandı. Şimdi yeni parolanızı belirleyebilirsiniz.');
      } else {
        setError(data.message || 'Kullanıcı bulunamadı');
        setShowPasswordFields(false);
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Şifre sıfırlama
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Tüm alanları doldurunuz');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Parolalar eşleşmiyor');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5164/api/User/reset-password', {
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
        setError(data.message || 'Parola güncellenirken bir hata oluştu');
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Typography component="h1" variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
          Parola Sıfırlama
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Adresi"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={showPasswordFields}
          />

          {!showPasswordFields && (
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleVerifyEmail}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Email Doğrula'}
            </Button>
          )}

          {showPasswordFields && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Yeni Parola"
                type="password"
                id="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Yeni Parola (Tekrar)"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
            sx={{ mt: 1 }}
          >
            Giriş Sayfasına Dön
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPassword; 