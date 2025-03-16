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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tr } from 'date-fns/locale';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthDate: null as Date | null
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email adresi zorunludur';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Geçerli bir email adresi giriniz';
    }

    if (!formData.password) {
      newErrors.password = 'Parola zorunludur';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Parola en az 8 karakter uzunluğunda olmalı, büyük-küçük harf ve rakam içermelidir';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Parola tekrarı zorunludur';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Parolalar eşleşmiyor';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'Ad zorunludur';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Soyad zorunludur';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Doğum tarihi zorunludur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5164/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate?.toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login', { state: { message: 'Kayıt başarılı! Giriş yapabilirsiniz.' } });
      } else {
        setApiError(data.message || 'Kayıt işlemi başarısız');
      }
    } catch (err) {
      setApiError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
          Kayıt Ol
        </Typography>
        {apiError && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {apiError}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Adresi"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Parola"
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Parola Tekrar"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="firstName"
            label="Ad"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="lastName"
            label="Soyad"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            disabled={loading}
          />
          <DatePicker
            label="Doğum Tarihi"
            value={formData.birthDate}
            onChange={(newValue: Date | null) => {
              setFormData(prev => ({ ...prev, birthDate: newValue }));
              if (errors.birthDate) {
                setErrors(prev => ({ ...prev, birthDate: '' }));
              }
            }}
            format="dd/MM/yyyy"
            slotProps={{
              textField: {
                margin: 'normal',
                fullWidth: true,
                required: true,
                error: !!errors.birthDate,
                helperText: errors.birthDate,
              }
            }}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Kayıt Ol'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link href="/login" variant="body2">
              {"Zaten hesabınız var mı? Giriş yapın"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register; 