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
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { tr } from 'date-fns/locale';

interface Activity {
  id: string;
  goalId: string;
  activityDate: string;
  duration: string;
  isCompleted: boolean;
}

interface Goal {
  id: string;
  title: string;
}

const StatusTab = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
  const [duration, setDuration] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [note, setNote] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [tip, setTip] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLastSevenDaysActivities();
    fetchGoals();
    fetchRandomTip();
  }, []);

  const fetchLastSevenDaysActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5164/api/DentalActivity/last-seven-days', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Aktiviteler getirilirken hata oluştu:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5164/api/DentalGoal', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error('Hedefler getirilirken hata oluştu:', error);
    }
  };

  const fetchRandomTip = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5164/api/DentalTip/random', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTip(data.content);
      }
    } catch (error) {
      console.error('Öneri getirilirken hata oluştu:', error);
    }
  };

  const handleActivitySubmit = async (goalId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5164/api/DentalActivity', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalId,
          activityDate: selectedDate,
          duration: duration,
          isCompleted,
        }),
      });

      if (response.ok) {
        setSuccess('Aktivite başarıyla kaydedildi');
        fetchLastSevenDaysActivities();
      } else {
        setError('Aktivite kaydedilemedi');
      }
    } catch (error) {
      setError('Aktivite kaydedilirken bir hata oluştu');
    }
  };

  const handleNoteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('description', note);
    if (image) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5164/api/DentalActivity/note', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setSuccess('Not başarıyla eklendi');
        setNote('');
        setImage(null);
      } else {
        setError('Not eklenemedi');
      }
    } catch (error) {
      setError('Not eklenirken bir hata oluştu');
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
          {activities.map((activity) => (
            <Box key={activity.id} sx={{ mb: 2 }}>
              <Typography>
                Tarih: {new Date(activity.activityDate).toLocaleDateString('tr-TR')}
                {' | '}Süre: {activity.duration}
                {' | '}Durum: {activity.isCompleted ? 'Tamamlandı' : 'Tamamlanmadı'}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Grid>

      {/* Hedef aktivite formları */}
      {goals.map((goal) => (
        <Grid item xs={12} md={6} key={goal.id}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {goal.title}
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
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isCompleted}
                      onChange={(e) => setIsCompleted(e.target.checked)}
                    />
                  }
                  label="Tamamlandı"
                />
                <Button
                  variant="contained"
                  onClick={() => handleActivitySubmit(goal.id)}
                >
                  Kaydet
                </Button>
              </Box>
            </LocalizationProvider>
          </Paper>
        </Grid>
      ))}

      {/* Not ekleme formu */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Not Ekle
          </Typography>
          <Box component="form" onSubmit={handleNoteSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
              onChange={(e) => e.target.files && setImage(e.target.files[0])}
              style={{ display: 'none' }}
              id="image-input"
            />
            <label htmlFor="image-input">
              <Button variant="outlined" component="span">
                Görsel Yükle
              </Button>
            </label>
            <Button type="submit" variant="contained">
              Not Ekle
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Günlük öneri */}
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

      {/* Hata ve başarı mesajları */}
      {error && (
        <Grid item xs={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}
      {success && (
        <Grid item xs={12}>
          <Alert severity="success">{success}</Alert>
        </Grid>
      )}
    </Grid>
  );
};

export default StatusTab; 