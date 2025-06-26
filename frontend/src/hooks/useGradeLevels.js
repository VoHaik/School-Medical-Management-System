// Hook for managing grade levels
// File: frontend/src/hooks/useGradeLevels.js

import { useState, useEffect, useCallback } from 'react';
import { getAllActiveGradeLevels, getGradeDisplayOptions } from '../utils/api';

export const useGradeLevels = () => {
  const [gradeLevels, setGradeLevels] = useState([]);
  const [gradeOptions, setGradeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGradeLevels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both detailed grade levels and display options
      const [levels, options] = await Promise.all([
        getAllActiveGradeLevels(),
        getGradeDisplayOptions()
      ]);
      
      setGradeLevels(levels || []);
      setGradeOptions(options || []);
    } catch (err) {
      console.error('Error fetching grade levels:', err);
      setError(err.message || 'Failed to fetch grade levels');
      
      // Fallback to static grades 1-12 if API fails
      const fallbackGrades = Array.from({ length: 12 }, (_, i) => ({
        gradeId: i + 1,
        gradeName: `Grade ${i + 1}`,
        isActive: true
      }));
      
      const fallbackOptions = fallbackGrades.map(grade => grade.gradeName);
      
      setGradeLevels(fallbackGrades);
      setGradeOptions(fallbackOptions);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGradeLevels();
  }, [fetchGradeLevels]);

  // Helper to extract grade number from grade name
  const getGradeNumber = useCallback((gradeName) => {
    if (gradeName && gradeName.startsWith('Grade ')) {
      const num = parseInt(gradeName.substring(6));
      return isNaN(num) ? null : num;
    }
    return null;
  }, []);

  // Get grade name by number
  const getGradeNameByNumber = useCallback((gradeNumber) => {
    const grade = gradeLevels.find(g => getGradeNumber(g.gradeName) === gradeNumber);
    return grade ? grade.gradeName : `Grade ${gradeNumber}`;
  }, [gradeLevels, getGradeNumber]);

  // Get Vietnamese grade name by number (derived from English name)
  const getVietnameseGradeNameByNumber = useCallback((gradeNumber) => {
    return `Lớp ${gradeNumber}`;
  }, []);

  // Get grade options for select components
  const getGradeSelectOptions = useCallback((useVietnamese = false) => {
    return gradeLevels.map(grade => {
      const gradeNumber = getGradeNumber(grade.gradeName);
      return {
        value: gradeNumber ? gradeNumber.toString() : grade.gradeId.toString(),
        label: useVietnamese ? getVietnameseGradeNameByNumber(gradeNumber) : grade.gradeName,
        gradeId: grade.gradeId,
        gradeNumber: gradeNumber
      };
    }).filter(option => option.gradeNumber !== null);
  }, [gradeLevels, getGradeNumber, getVietnameseGradeNameByNumber]);

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
  }, [gradeLevels, getGradeNumber, getVietnameseGradeNameByNumber]);

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
    getMultipleGradeOptions,
    formatGradeRange,
    parseGradeLevelsString,
    formatGradeNumbersToString,
    
    // Refresh function
    refetch: fetchGradeLevels
  };
};

export default useGradeLevels;
