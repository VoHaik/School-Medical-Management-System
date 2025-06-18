import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Grid
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const FormModal = ({
  open,
  onClose,
  onSubmit,
  title,
  fields,
  initialData = {},
  loading = false,
  validationSchema,
  fullWidth = true,
  maxWidth = 'md'
}) => {
  const defaultSchema = yup.object().shape(
    fields.reduce((acc, field) => {
      if (field.required) {
        acc[field.name] = yup.string().required(`${field.label} is required`);
      } else {
        acc[field.name] = yup.string();
      }
      return acc;
    }, {})
  );

  const schema = validationSchema || defaultSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData
  });

  React.useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        setValue(key, initialData[key]);
      });
    }
  }, [initialData, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <FormControl fullWidth error={!!errors[field.name]}>
                <InputLabel>{field.label}</InputLabel>
                <Select {...controllerField} label={field.label}>
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors[field.name] && (
                  <Typography variant="caption" color="error" className="mt-1">
                    {errors[field.name].message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        );

      case 'multiline':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                label={field.label}
                multiline
                rows={field.rows || 4}
                fullWidth
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
                placeholder={field.placeholder}
              />
            )}
          />
        );

      case 'chips':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <Box>
                <Typography variant="subtitle2" className="mb-2">
                  {field.label}
                </Typography>
                <Box className="flex flex-wrap gap-2">
                  {field.options?.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      onClick={() => {
                        const current = controllerField.value || [];
                        const newValue = current.includes(option.value)
                          ? current.filter(v => v !== option.value)
                          : [...current, option.value];
                        controllerField.onChange(newValue);
                      }}
                      color={
                        (controllerField.value || []).includes(option.value)
                          ? 'primary'
                          : 'default'
                      }
                      variant={
                        (controllerField.value || []).includes(option.value)
                          ? 'filled'
                          : 'outlined'
                      }
                    />
                  ))}
                </Box>
                {errors[field.name] && (
                  <Typography variant="caption" color="error" className="mt-1">
                    {errors[field.name].message}
                  </Typography>
                )}
              </Box>
            )}
          />
        );

      default:
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                label={field.label}
                type={field.type || 'text'}
                fullWidth
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
                placeholder={field.placeholder}
                disabled={field.disabled}
                InputProps={field.InputProps}
              />
            )}
          />
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      <DialogTitle>{title}</DialogTitle>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            {fields.map((field) => (
              <Grid 
                item 
                xs={12} 
                sm={field.width === 'half' ? 6 : 12}
                key={field.name}
              >
                {renderField(field)}
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        
        <DialogActions className="p-4">
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            className={loading ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormModal;
