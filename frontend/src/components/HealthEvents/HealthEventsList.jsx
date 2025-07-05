// Example Component: Health Events with English UI and Vietnamese Content Support
// File: frontend/src/components/HealthEvents/HealthEventsList.jsx

import React, { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import './HealthEventsList.css';

const HealthEventsList = () => {
  const { t, formatVietnameseContent, formatName, searchContent, formatDate } = useI18n();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events based on search term (works with Vietnamese content)
    if (searchTerm) {
      const filtered = events.filter(event => 
        searchContent(searchTerm, event.eventName) ||
        searchContent(searchTerm, event.description) ||
        searchContent(searchTerm, event.location)
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [searchTerm, events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/health-checkup-events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json; charset=utf-8' // Ensure UTF-8 encoding
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error('Failed to fetch events:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      PLANNED: 'status-planned',
      IN_PROGRESS: 'status-in-progress',
      COMPLETED: 'status-completed',
      CANCELLED: 'status-cancelled'
    };

    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {t(status?.toLowerCase() || 'planned')}
      </span>
    );
  };

  const getEventTypeLabel = (eventType) => {
    return t(eventType?.toLowerCase()?.replace('_', '') || 'healthCheckup');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="health-checkup-events">
      <div className="page-header">
        <h1>{t('healthEvents')}</h1>
        <button className="btn-primary" onClick={() => {/* Navigate to create event */}}>
          {t('createEvent')}
        </button>
      </div>

      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder={`${t('search')} ${t('healthEvents').toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="no-data">
          <p>{t('noData')}</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => (
            <div key={event.eventId} className="event-card">
              <div className="event-header">
                <h3 className="event-name">
                  {formatVietnameseContent(event.eventName)}
                </h3>
                <div className="event-type">
                  {getEventTypeLabel(event.eventType)}
                </div>
              </div>

              <div className="event-details">
                <div className="detail-row">
                  <span className="label">{t('scheduledDate')}:</span>
                  <span className="value">{formatDate(event.scheduledDate)}</span>
                </div>

                <div className="detail-row">
                  <span className="label">{t('location')}:</span>
                  <span className="value">
                    {formatVietnameseContent(event.location)}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="label">{t('status')}:</span>
                  <span className="value">
                    {getStatusBadge(event.status)}
                  </span>
                </div>

                {event.description && (
                  <div className="detail-row">
                    <span className="label">{t('description')}:</span>
                    <p className="description">
                      {formatVietnameseContent(event.description)}
                    </p>
                  </div>
                )}

                {event.targetGradeLevels && (
                  <div className="detail-row">
                    <span className="label">{t('targetGradeLevels')}:</span>
                    <span className="value">
                      {formatVietnameseContent(event.targetGradeLevels)}
                    </span>
                  </div>
                )}

                {event.typesOfCheckups && event.typesOfCheckups.length > 0 && (
                  <div className="detail-row">
                    <span className="label">{t('typesOfCheckups')}:</span>
                    <div className="checkup-types">
                      {event.typesOfCheckups.map((type, index) => (
                        <span key={index} className="checkup-type-badge">
                          {t(type.toLowerCase())}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="event-actions">
                <button className="btn-secondary" onClick={() => {/* View event */}}>
                  {t('view')}
                </button>
                <button className="btn-primary" onClick={() => {/* Edit event */}}>
                  {t('edit')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthEventsList;
