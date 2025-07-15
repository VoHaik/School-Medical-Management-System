import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  TextField,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  FormHelperText,
  Button,
  Grid,
  Box,
  Typography,
  Paper
} from '@mui/material';

const FormBuilder = ({
  defaultValues,
  validationSchema,
  onSubmit,
  fields,
  submitText = 'Submit',
  title,
  description,
  loading = false
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues,
    resolver: validationSchema ? yupResolver(validationSchema) : undefined
  });

  const renderField = (field) => {
    const { name, label, type, options, required, placeholder, fullWidth = true, gridSize = 12 } = field;
    
    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <Grid item xs={12} sm={gridSize} key={name}>
            <Controller
              name={name}
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <TextField
                  onChange={onChange}
                  value={value || ''}
                  inputRef={ref}
                  label={label}
                  type={type}
                  placeholder={placeholder}
                  required={required}
                  fullWidth={fullWidth}
                  error={!!errors[name]}
                  helperText={errors[name]?.message}
                  variant="outlined"
                  margin="normal"
                />
              )}
            />
          </Grid>
        );
      case 'select':
        return (
          <Grid item xs={12} sm={gridSize} key={name}>
            <Controller
              name={name}
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <FormControl 
                  fullWidth={fullWidth} 
                  margin="normal" 
                  error={!!errors[name]}
                  variant="outlined"
                >
                  <InputLabel id={`${name}-label`}>{label}</InputLabel>
                  <Select
                    labelId={`${name}-label`}
                    value={value || ''}
                    onChange={onChange}
                    inputRef={ref}
                    label={label}
                  >
                    {options?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors[name] && (
                    <FormHelperText>{errors[name]?.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
        );
      case 'checkbox':
        return (
          <Grid item xs={12} sm={gridSize} key={name}>
            <Controller
              name={name}
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!value}
                      onChange={onChange}
                      inputRef={ref}
                      color="primary"
                    />
                  }
                  label={label}
                />
              )}
            />
            {errors[name] && (
              <FormHelperText error>{errors[name]?.message}</FormHelperText>
            )}
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      {title && (
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="body2" color="textSecondary" paragraph>
          {description}
        </Typography>
      )}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          {fields.map(renderField)}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Processing...' : submitText}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default FormBuilder;