// React Hook for English UI with Vietnamese Content Support
// File: frontend/src/hooks/useI18n.js

import { useState, useEffect } from 'react';
import I18N_CONFIG, { ContentUtils } from '../config/i18n';

export const useI18n = () => {
  const [currentLanguage] = useState('en'); // UI is always English
  
  // Get UI text (always in English)
  const t = (key) => {
    const keys = key.split('.');
    let value = I18N_CONFIG.ui;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };
  
  // Format Vietnamese content for display
  const formatVietnameseContent = (content) => {
    return ContentUtils.encodeVietnamese(content);
  };
  
  // Format Vietnamese names
  const formatName = (name) => {
    return ContentUtils.formatVietnameseName(name);
  };
  
  // Search function for Vietnamese content
  const searchContent = (searchTerm, content) => {
    return ContentUtils.searchVietnamese(searchTerm, content);
  };
  
  // Format dates according to locale
  const formatDate = (date, locale = 'en') => {
    if (!date) return '';
    
    const dateObj = new Date(date);
    const format = I18N_CONFIG.content.dateFormat[locale] || 'MM/DD/YYYY';
    
    return dateObj.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US');
  };
  
  // Format numbers according to locale
  const formatNumber = (number, locale = 'en') => {
    if (number === null || number === undefined) return '';
    
    const formatLocale = I18N_CONFIG.content.numberFormat[locale] || 'en-US';
    return new Intl.NumberFormat(formatLocale).format(number);
  };
  
  return {
    t, // UI text translation (English)
    formatVietnameseContent,
    formatName,
    searchContent,
    formatDate,
    formatNumber,
    currentLanguage
  };
};

export default useI18n;
