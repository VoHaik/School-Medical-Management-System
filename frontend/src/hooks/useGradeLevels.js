// Hook for managing grade levels
// File: frontend/src/hooks/useGradeLevels.js

import { useState, useEffect, useCallback } from 'react';
import { getAllActiveGradeLevels, getGradeDisplayOptions } from '../utils/api';

export const useGradeLevels = () => {
  const [gradeLevels, setGradeLevels] = useState([]);
  const [gradeOptions, setGradeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to extract grade number from grade name - move outside useCallback to prevent dependencies
  const getGradeNumber = (gradeName) => {
    if (gradeName) {
      // Handle format like "6A", "7A", "8A", "9A"
      if (gradeName.match(/^\d+[A-Z]$/)) {
        const num = parseInt(gradeName.substring(0, gradeName.length - 1));
        return isNaN(num) ? null : num;
      }
      // Handle format like "Grade 1", "Grade 2", etc.
      if (gradeName.startsWith('Grade ')) {
        const num = parseInt(gradeName.substring(6));
        return isNaN(num) ? null : num;
      }
    }
    return null;
  };

  const fetchGradeLevels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const gradeLevels = await getAllActiveGradeLevels();
      if (gradeLevels && Array.isArray(gradeLevels)) {
        // Sort by grade number
        const sortedGrades = gradeLevels.sort((a, b) => {
          const numA = getGradeNumber(a.gradeName);
          const numB = getGradeNumber(b.gradeName);
          return (numA || 0) - (numB || 0);
        });
        
        setGradeLevels(sortedGrades);
        
        const options = sortedGrades.map(grade => grade.gradeName);
        setGradeOptions(options);
        
        } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error('Error fetching grade levels:', err);
      setError(err.message || 'Failed to fetch grade levels');
      
      // No fallback data - only show what's actually in the database
      setGradeLevels([]);
      setGradeOptions([]);
    } finally {
      setLoading(false);
    }
  }, []); // Remove getGradeNumber dependency

  useEffect(() => {
    fetchGradeLevels();
  }, []); // Empty dependency array to run only once

  // Get grade name by number
  const getGradeNameByNumber = useCallback((gradeNumber) => {
    const grade = gradeLevels.find(g => getGradeNumber(g.gradeName) === gradeNumber);
    return grade ? grade.gradeName : `Grade ${gradeNumber}`;
  }, [gradeLevels]);

  // Get Vietnamese grade name by number (derived from English name)
  const getVietnameseGradeNameByNumber = useCallback((gradeNumber) => {
    return `Lớp ${gradeNumber}`;
  }, []);

  // Get grade options for select components (using grade names)
  const getGradeSelectOptionsByName = useCallback((useVietnamese = false) => {
    return gradeLevels.map(grade => {
      const gradeNumber = getGradeNumber(grade.gradeName);
      return {
        value: grade.gradeName, // Use gradeName as value
        label: useVietnamese ? getVietnameseGradeNameByNumber(gradeNumber) : grade.gradeName,
        gradeId: grade.gradeId,
        gradeNumber: gradeNumber
      };
    }).filter(option => option.gradeNumber !== null);
  }, [gradeLevels, getVietnameseGradeNameByNumber]);

  // Get grade options for select components (using grade IDs)
  const getGradeSelectOptions = useCallback((useVietnamese = false) => {
    return gradeLevels.map(grade => {
      const gradeNumber = getGradeNumber(grade.gradeName);
      return {
        value: grade.gradeId, // Use gradeId instead of gradeNumber
        label: useVietnamese ? getVietnameseGradeNameByNumber(gradeNumber) : grade.gradeName,
        gradeId: grade.gradeId,
        gradeNumber: gradeNumber
      };
    }).filter(option => option.gradeNumber !== null);
  }, [gradeLevels, getVietnameseGradeNameByNumber]);

  // Get multiple grade selection options (for events targeting multiple grades)
  const getMultipleGradeOptions = useCallback((selectedGrades = [], useVietnamese = false) => {
    return gradeLevels.map(grade => {
      const gradeNumber = getGradeNumber(grade.gradeName);
      return {
        ...grade,
        gradeNumber,
        selected: selectedGrades.includes(gradeNumber),
        displayName: useVietnamese ? getVietnameseGradeNameByNumber(gradeNumber) : grade.gradeName
      };
    }).filter(option => option.gradeNumber !== null);
  }, [gradeLevels, getVietnameseGradeNameByNumber]);

  // Format grade range for display
  const formatGradeRange = useCallback((minGrade, maxGrade, useVietnamese = false) => {
    if (minGrade === maxGrade) {
      return useVietnamese ? 
        getVietnameseGradeNameByNumber(minGrade) : 
        getGradeNameByNumber(minGrade);
    }
    
    const minName = useVietnamese ? 
      getVietnameseGradeNameByNumber(minGrade) : 
      getGradeNameByNumber(minGrade);
    const maxName = useVietnamese ? 
      getVietnameseGradeNameByNumber(maxGrade) : 
      getGradeNameByNumber(maxGrade);
    
    return `${minName} - ${maxName}`;
  }, [getGradeNameByNumber, getVietnameseGradeNameByNumber]);

  // Parse grade levels from string (e.g., "Grade 1, Grade 3-5, Grade 7")
  const parseGradeLevelsString = useCallback((gradeString) => {
    if (!gradeString) return [];
    
    const gradeNumbers = [];
    const parts = gradeString.split(',').map(s => s.trim());
    
    parts.forEach(part => {
      if (part.includes('-')) {
        // Handle range like "Grade 3-5"
        const rangeParts = part.split('-');
        const start = parseInt(rangeParts[0].replace(/\D/g, ''));
        const end = parseInt(rangeParts[1].replace(/\D/g, ''));
        
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= 12) {
            gradeNumbers.push(i);
          }
        }
      } else {
        // Handle single grade like "Grade 1"
        const gradeNum = parseInt(part.replace(/\D/g, ''));
        if (gradeNum >= 1 && gradeNum <= 12) {
          gradeNumbers.push(gradeNum);
        }
      }
    });
    
    return [...new Set(gradeNumbers)].sort((a, b) => a - b);
  }, []);

  // Format array of grade numbers to string
  const formatGradeNumbersToString = useCallback((gradeNumbers, useVietnamese = false) => {
    if (!gradeNumbers || gradeNumbers.length === 0) return '';
    
    const sortedGrades = [...gradeNumbers].sort((a, b) => a - b);
    const gradeNames = sortedGrades.map(num => 
      useVietnamese ? 
        getVietnameseGradeNameByNumber(num) : 
        getGradeNameByNumber(num)
    );
    
    return gradeNames.join(', ');
  }, [getGradeNameByNumber, getVietnameseGradeNameByNumber]);

  return {
    gradeLevels,
    gradeOptions,
    loading,
    error,
    
    // Utility functions
    getGradeNumber,
    getGradeNameByNumber,
    getVietnameseGradeNameByNumber,
    getGradeSelectOptions,
    getGradeSelectOptionsByName,
    getMultipleGradeOptions,
    formatGradeRange,
    parseGradeLevelsString,
    formatGradeNumbersToString,
    
    // Refresh function
    refetch: fetchGradeLevels
  };
};

export default useGradeLevels;
