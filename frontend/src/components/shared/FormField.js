import React from 'react';
import { Controller } from 'react-hook-form';
import { 
  TextField, FormControl, InputLabel, Select, MenuItem, 
  FormHelperText, Checkbox, FormControlLabel, Switch,
  RadioGroup, Radio, FormLabel
} from '@mui/material';

/**
 * An enhanced form field component that handles different input types
 * and displays validation errors consistently
 */
const FormField = ({
  control, // React Hook Form control
  name,
  label,
  type = 'text',
  required = false,
  options = [],
  helperText = '',
  fullWidth = true,
  multiline = false,
  rows = 1,
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Handle different field types
        switch (type) {
          case 'select':
            return (
              <FormControl fullWidth={fullWidth} error={!!error} {...props}>
                <InputLabel id={`${name}-label`}>{label}{required ? ' *' : ''}</InputLabel>
                <Select
                  labelId={`${name}-label`}
                  label={`${label}${required ? ' *' : ''}`}
                  {...field}
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {error && <FormHelperText>{error.message}</FormHelperText>}
                {!error && helperText && <FormHelperText>{helperText}</FormHelperText>}
              </FormControl>
            );
            
          case 'checkbox':
            return (
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={field.value || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    name={name}
                  />
                }
                label={label}
              />
            );
            
          case 'switch':
            return (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    name={name}
                  />
                }
                label={label}
              />
            );
            
          case 'radio':
            return (
              <FormControl component="fieldset" error={!!error}>
                <FormLabel component="legend">{label}</FormLabel>
                <RadioGroup {...field} row={props.row}>
                  {options.map((option) => (
                    <FormControlLabel 
                      key={option.value} 
                      value={option.value} 
                      control={<Radio />} 
                      label={option.label} 
                    />
                  ))}
                </RadioGroup>
                {error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            );

          // Default text field
          default:
            return (
              <TextField
                {...field}
                label={label}
                type={type}
                required={required}
                error={!!error}
                helperText={error ? error.message : helperText}
                fullWidth={fullWidth}
                multiline={multiline}
                rows={rows}
                {...props}
              />
            );
        }
      }}
    />
  );
};

export default FormField;