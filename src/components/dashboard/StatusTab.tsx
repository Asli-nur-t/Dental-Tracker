import { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { tr } from 'date-fns/locale';

const StatusTab = () => {
  const [activities, setActivities] = useState([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [tip, setTip] = useState('');

  useEffect(() => {
    fetchLastSevenDaysActivities();
    fetchRandomTip();
  }, []);

  const fetchLastSevenDaysActivities = async () => {
    try {
      const response = await fetch('http://localhost:5164/api/DentalActivity/last-seven-days');
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Aktiviteler getirilirken hata oluştu:', error);
    }
  };

  const fetchRandomTip = async () => {
    try {
      const response = await fetch('http://localhost:5164/api/DentalTip/random');
      const data = await response.json();
      setTip(data.content);
    } catch (error) {
      console.error('Öneri getirilirken hata oluştu:', error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmitNote = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('description', note);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('http://localhost:5164/api/DentalActivity/note', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setNote('');
        setImage(null);
      }
    } catch (error) {
      console.error('Not eklenirken hata oluştu:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Son 7 günlük aktiviteler */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Son 7 Gün Aktiviteleri
          </Typography>
          {/* Aktivite listesi */}
        </Paper>
      </Grid>

      {/* Aktivite formu */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Aktivite Ekle
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <DatePicker
                label="Tarih"
                value={selectedDate}
                onChange={setSelectedDate}
              />
              <TimePicker
                label="Saat"
                value={selectedTime}
                onChange={setSelectedTime}
              />
              <TextField
                label="Süre (dakika)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                type="number"
              />
              <Button variant="contained" color="primary">
                Kaydet
              </Button>
            </Box>
          </LocalizationProvider>
        </Paper>
      </Grid>

      {/* Not ekleme formu */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Not Ekle
          </Typography>
          <Box component="form" onSubmit={handleSubmitNote} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Açıklama"
              multiline
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <input
              accept="image/*"
              type="file"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="image-input"
            />
            <label htmlFor="image-input">
              <Button variant="outlined" component="span">
                Görsel Yükle
              </Button>
            </label>
            <Button type="submit" variant="contained" color="primary">
              Not Ekle
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Öneri kartı */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Günün Önerisi
            </Typography>
            <Typography variant="body1">
              {tip || 'Yükleniyor...'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatusTab; 