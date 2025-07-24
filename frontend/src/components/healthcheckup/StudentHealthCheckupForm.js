import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Paper, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const StudentHealthCheckupForm = ({ onSubmit, initialData, eventId, studentId, isEdit = false }) => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    vision: '',
    hearing: '',
    dentalHealth: '',
    scoliosisScreening: '',
    generalCondition: '',
    notes: '',
    consentStatus: 'PENDING', // Default to PENDING
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        height: initialData.height || '',
        weight: initialData.weight || '',
        vision: initialData.vision || '',
        hearing: initialData.hearing || '',
        dentalHealth: initialData.dentalHealth || '',
        scoliosisScreening: initialData.scoliosisScreening || '',
        generalCondition: initialData.generalCondition || '',
        notes: initialData.notes || '',
        consentStatus: initialData.consentStatus || 'PENDING',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // The parent component will handle eventId and studentId
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Edit Student Health Record' : 'Record Student Health Checkup'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Height (cm)" name="height" value={formData.height} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Weight (kg)" name="weight" value={formData.weight} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Vision (e.g., 20/20)" name="vision" value={formData.vision} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Hearing (e.g., Normal)" name="hearing" value={formData.hearing} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Dental Health" name="dentalHealth" value={formData.dentalHealth} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Scoliosis Screening" name="scoliosisScreening" value={formData.scoliosisScreening} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="General Condition" name="generalCondition" value={formData.generalCondition} onChange={handleChange} multiline rows={2} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Notes" name="notes" value={formData.notes} onChange={handleChange} multiline rows={3} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="consent-status-label">Consent Status</InputLabel>
              <Select
                labelId="consent-status-label"
                name="consentStatus"
                value={formData.consentStatus}
                label="Consent Status"
                onChange={handleChange}
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="CONSENTED">Consented</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              {isEdit ? 'Save Changes' : 'Record Checkup'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default StudentHealthCheckupForm;
