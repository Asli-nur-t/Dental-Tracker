import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { FaTooth, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5164/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Giriş işlemi sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 3, backgroundColor: '#e3f2fd', maxWidth: 400, width: '100%' }}>
        <FaTooth size={50} color="#1976d2" style={{ marginBottom: 10 }} />
        <Typography component="h1" variant="h5" sx={{ color: '#1976d2' }}>
          Giriş Yap
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 1, padding: 1, mb: 2 }}>
            <FaEnvelope color="#1976d2" style={{ marginRight: 8 }} />
            <TextField
              required
              fullWidth
              label="Email Adresi"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              variant="standard"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 1, padding: 1, mb: 2 }}>
            <FaLock color="#1976d2" style={{ marginRight: 8 }} />
            <TextField
              required
              fullWidth
              label="Parola"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              variant="standard"
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2, backgroundColor: '#1976d2' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Giriş Yap'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link href="/register" variant="body2" sx={{ color: '#1976d2' }}>
              {"Hesabınız yok mu? Kayıt olun"}
            </Link>
            <br />
            <Link href="/reset-password" variant="body2" sx={{ color: '#1976d2' }}>
              {"Parolanızı mı unuttunuz?"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
