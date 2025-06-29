// Grade Level Selection Component
// File: frontend/src/components/shared/GradeLevelSelector.jsx

import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
  Box,
  FormHelperText,
  OutlinedInput
} from '@mui/material';
import { useGradeLevels } from '../../hooks/useGradeLevels';
import { useUIText } from '../../hooks/useUIText';

const GradeLevelSelector = ({
  value = [],
  onChange,
  multiple = true,
  label,
  helperText,
  error = false,
  disabled = false,
  useVietnamese = false,
  required = false,
  sx = {}
}) => {
  const { t } = useUIText();
  const { gradeLevels, loading, getGradeSelectOptionsByName } = useGradeLevels();
  const [open, setOpen] = useState(false);

  // Compute gradeOptions only when gradeLevels or useVietnamese changes
  const gradeOptions = React.useMemo(() => {
    return getGradeSelectOptionsByName(useVietnamese);
  }, [getGradeSelectOptionsByName, useVietnamese]);
  
  // Debug logging - only log when values actually change
  React.useEffect(() => {
    console.log('GradeLevelSelector - gradeLevels:', gradeLevels);
    console.log('GradeLevelSelector - gradeOptions:', gradeOptions);
    console.log('GradeLevelSelector - loading:', loading);
  }, [gradeLevels, gradeOptions, loading]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    
    if (multiple) {
      // For multiple selection, ensure value is always an array
      const newValue = typeof selectedValue === 'string' ? 
        selectedValue.split(',') : selectedValue;
      onChange(newValue);
    } else {
      // For single selection
      onChange(selectedValue);
    }
  };

  const handleDelete = (gradeToDelete) => {
    if (multiple) {
      const newValue = value.filter(grade => grade !== gradeToDelete);
      onChange(newValue);
    }
  };

  const renderValue = (selected) => {
    if (!multiple) {
      const option = gradeOptions.find(opt => opt.value === selected);
      return option ? option.label : '';
    }

    if (selected.length === 0) {
      return '';
    }

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selected.map((gradeValue) => {
          const option = gradeOptions.find(opt => opt.value === gradeValue);
          return (
            <Chip
              key={gradeValue}
              label={option ? option.label : gradeValue}
              size="small"
              onDelete={() => handleDelete(gradeValue)}
              onMouseDown={(event) => event.stopPropagation()}
            />
          );
        })}
      </Box>
    );
  };

  if (loading) {
    return (
      <FormControl fullWidth sx={sx}>
        <InputLabel>{label || t.gradeLevels}</InputLabel>
        <Select disabled>
          <MenuItem value="">
            <em>{t.loading}</em>
          </MenuItem>
        </Select>
      </FormControl>
    );
  }

  return (
    <FormControl fullWidth error={error} sx={sx}>
      <InputLabel id="grade-level-selector-label" required={required}>
        {label || t.gradeLevels}
      </InputLabel>
      <Select
        labelId="grade-level-selector-label"
        multiple={multiple}
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label || t.gradeLevels} />}
        renderValue={renderValue}
        disabled={disabled}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
              width: 250,
            },
          },
        }}
      >
        {gradeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {multiple && (
              <Checkbox 
                checked={value.indexOf(option.value) > -1}
                size="small"
              />
            )}
            <ListItemText 
              primary={option.label}
              primaryTypographyProps={{
                fontSize: '0.875rem'
              }}
            />
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default GradeLevelSelector;
