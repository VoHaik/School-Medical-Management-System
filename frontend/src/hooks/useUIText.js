// Hook for using English UI text throughout the application
// File: frontend/src/hooks/useUIText.js

import { UI_TEXT, STATUS_COLORS, EVENT_TYPE_COLORS } from '../constants/uiText';

/**
 * Custom hook for accessing English UI text and utilities
 * Usage: const { t, statusColor, eventTypeColor } = useUIText();
 * Then: t.healthCheckup, t.planned, statusColor('PLANNED'), etc.
 */
export const useUIText = () => {
  // Get status color for Material-UI components
  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || 'default';
  };

  // Get event type color for Material-UI components
  const getEventTypeColor = (eventType) => {
    return EVENT_TYPE_COLORS[eventType] || 'default';
  };
  // Format date for display (English format)
  const formatDate = (dateString) => {
    if (!dateString) return UI_TEXT.notAvailable;
    try {
      // Handle different date formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return UI_TEXT.notAvailable;
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
      });
    } catch (error) {
      return UI_TEXT.notAvailable;
    }
  };
  // Format date and time for display (English format)
  const formatDateTime = (dateString) => {
    if (!dateString) return UI_TEXT.notAvailable;
    try {
      // Handle different date formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return UI_TEXT.notAvailable;
      
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return UI_TEXT.notAvailable;
    }
  };

  // Get event type label with proper English text
  const getEventTypeLabel = (eventType) => {
    switch (eventType) {
      case 'HEALTH_CHECKUP':
        return UI_TEXT.healthCheckup;
      case 'VACCINATION':
        return UI_TEXT.vaccination;
      default:
        return UI_TEXT.unknown;
    }
  };

  // Get status label with proper English text
  const getStatusLabel = (status) => {
    switch (status) {
      case 'PLANNED':
        return UI_TEXT.planned;
      case 'CONSENT_COLLECTION':
        return UI_TEXT.collectingConsent;
      case 'IN_PROGRESS':
        return UI_TEXT.inProgress;
      case 'COMPLETED':
        return UI_TEXT.completed;
      case 'CANCELLED':
        return UI_TEXT.cancelled;
      default:
        return status || UI_TEXT.unknown;
    }
  };

  // Get gender label with proper English text
  const getGenderLabel = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
      case 'm':
        return UI_TEXT.male;
      case 'female':
      case 'f':
        return UI_TEXT.female;
      default:
        return UI_TEXT.other;
    }
  };

  return {
    // Main UI text object
    t: UI_TEXT,
    
    // Utility functions
    getStatusColor,
    getEventTypeColor,
    formatDate,
    formatDateTime,
    getEventTypeLabel,
    getStatusLabel,
    getGenderLabel,
    
    // Direct access to color mappings
    statusColors: STATUS_COLORS,
    eventTypeColors: EVENT_TYPE_COLORS
  };
};

export default useUIText;
