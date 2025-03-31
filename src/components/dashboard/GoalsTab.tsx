import { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

interface Goal {
  id: string;
  title: string;
  description: string;
  period: string;
  priority: string;
}

const GoalsTab = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    period: '',
    priority: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('http://localhost:5164/api/DentalGoal');
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error('Hedefler getirilirken hata oluştu:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5164/api/DentalGoal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGoal),
      });
      if (response.ok) {
        setNewGoal({
          title: '',
          description: '',
          period: '',
          priority: '',
        });
        fetchGoals();
      }
    } catch (error) {
      console.error('Hedef eklenirken hata oluştu:', error);
    }
  };

  const handleDeleteClick = (goalId: string) => {
    setSelectedGoalId(goalId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedGoalId) {
      try {
        const response = await fetch(`http://localhost:5164/api/DentalGoal/${selectedGoalId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchGoals();
        }
      } catch (error) {
        console.error('Hedef silinirken hata oluştu:', error);
      }
    }
    setDeleteDialogOpen(false);
    setSelectedGoalId(null);
  };

  return (
    <Grid container spacing={3}>
      {/* Hedef listesi */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Hedeflerim
          </Typography>
          <List>
            {goals.map((goal) => (
              <ListItem key={goal.id}>
                <ListItemText
                  primary={goal.title}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        {goal.description}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2">
                        Periyot: {goal.period} | Önem: {goal.priority}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleDeleteClick(goal.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Yeni hedef formu */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Yeni Hedef Ekle
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              label="Başlık"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            <TextField
              required
              label="Açıklama"
              multiline
              rows={4}
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            />
            <FormControl required>
              <InputLabel>Periyot</InputLabel>
              <Select
                value={newGoal.period}
                onChange={(e) => setNewGoal({ ...newGoal, period: e.target.value })}
              >
                <MenuItem value="daily">Günlük</MenuItem>
                <MenuItem value="weekly">Haftalık</MenuItem>
                <MenuItem value="monthly">Aylık</MenuItem>
                <MenuItem value="threeMonths">3 Aylık</MenuItem>
                <MenuItem value="sixMonths">6 Aylık</MenuItem>
                <MenuItem value="yearly">Yıllık</MenuItem>
              </Select>
            </FormControl>
            <FormControl required>
              <InputLabel>Önem Derecesi</InputLabel>
              <Select
                value={newGoal.priority}
                onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
              >
                <MenuItem value="low">Düşük</MenuItem>
                <MenuItem value="medium">Orta</MenuItem>
                <MenuItem value="high">Yüksek</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              Hedef Ekle
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Silme onay dialogu */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Hedefi Sil</DialogTitle>
        <DialogContent>
          Bu hedefi silmek istediğinizden emin misiniz?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default GoalsTab; 