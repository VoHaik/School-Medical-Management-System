// Medical Events Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeMedicalEvents();
    loadMedicalEventsData();
    setupEventListeners();
});

let medicalEventsData = [];
let filteredEvents = [];

function initializeMedicalEvents() {
    setupFilters();
    setupPagination();
}

function setupEventListeners() {
    // Add new event button
    const addEventBtn = document.getElementById('add-event-btn');
    if (addEventBtn) {
        addEventBtn.addEventListener('click', showAddEventModal);
    }

    // Search functionality
    const searchInput = document.getElementById('search-events');
    if (searchInput) {
        searchInput.addEventListener('input', filterEvents);
    }

    // Filter controls
    const severityFilter = document.getElementById('severity-filter');
    const statusFilter = document.getElementById('status-filter');
    const typeFilter = document.getElementById('type-filter');
    const dateFilter = document.getElementById('date-filter');

    if (severityFilter) severityFilter.addEventListener('change', filterEvents);
    if (statusFilter) statusFilter.addEventListener('change', filterEvents);
    if (typeFilter) typeFilter.addEventListener('change', filterEvents);
    if (dateFilter) dateFilter.addEventListener('change', filterEvents);

    // Export functionality
    const exportBtn = document.getElementById('export-events');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportEvents);
    }

    // Quick action buttons
    setupQuickActions();
}

function loadMedicalEventsData() {
    // Sample medical events data
    medicalEventsData = [
        {
            id: 1,
            studentName: 'Emily Johnson',
            studentId: 'STU001',
            eventType: 'injury',
            severity: 'moderate',
            date: '2025-05-29',
            time: '10:30',
            location: 'Playground',
            description: 'Student fell from monkey bars and injured left wrist',
            actionTaken: 'Applied ice pack, contacted parents, recommended X-ray',
            staffMember: 'Nurse Mary Wilson',
            parentNotified: true,
            followUpRequired: true,
            followUpDate: '2025-05-31',
            status: 'open',
            createdDate: '2025-05-29',
            lastUpdated: '2025-05-29',
            attachments: ['incident_report.pdf'],
            witnesses: ['Teacher Sarah Smith', 'Student Mike Brown']
        },
        {
            id: 2,
            studentName: 'Michael Brown',
            studentId: 'STU002',
            eventType: 'allergic_reaction',
            severity: 'high',
            date: '2025-05-28',
            time: '12:15',
            location: 'Cafeteria',
            description: 'Student experienced mild allergic reaction to peanuts in lunch',
            actionTaken: 'Administered antihistamine, monitored breathing, contacted emergency contact',
            staffMember: 'Nurse Mary Wilson',
            parentNotified: true,
            followUpRequired: false,
            followUpDate: null,
            status: 'resolved',
            createdDate: '2025-05-28',
            lastUpdated: '2025-05-28',
            attachments: ['allergy_response_log.pdf'],
            witnesses: ['Cafeteria Staff John Doe']
        },
        {
            id: 3,
            studentName: 'Sarah Miller',
            studentId: 'STU003',
            eventType: 'illness',
            severity: 'low',
            date: '2025-05-27',
            time: '14:20',
            location: 'Classroom 3A',
            description: 'Student complained of headache and nausea',
            actionTaken: 'Took temperature (normal), provided water, contacted parent for pickup',
            staffMember: 'Health Aide Lisa Chen',
            parentNotified: true,
            followUpRequired: true,
            followUpDate: '2025-05-30',
            status: 'monitoring',
            createdDate: '2025-05-27',
            lastUpdated: '2025-05-29',
            attachments: [],
            witnesses: ['Teacher David Johnson']
        },
        {
            id: 4,
            studentName: 'James Wilson',
            studentId: 'STU004',
            eventType: 'medication_error',
            severity: 'moderate',
            date: '2025-05-26',
            time: '11:00',
            location: 'Health Office',
            description: 'Wrong dosage of ADHD medication administered',
            actionTaken: 'Contacted physician immediately, monitored student, documented error',
            staffMember: 'Nurse Mary Wilson',
            parentNotified: true,
            followUpRequired: true,
            followUpDate: '2025-05-27',
            status: 'resolved',
            createdDate: '2025-05-26',
            lastUpdated: '2025-05-27',
            attachments: ['medication_error_report.pdf', 'physician_consult.pdf'],
            witnesses: []
        },
        {
            id: 5,
            studentName: 'Lisa Anderson',
            studentId: 'STU005',
            eventType: 'emergency',
            severity: 'critical',
            date: '2025-05-25',
            time: '09:45',
            location: 'Gym',
            description: 'Student collapsed during PE class, suspected seizure',
            actionTaken: 'Called 911, administered first aid, contacted emergency contacts',
            staffMember: 'PE Teacher Robert Smith',
            parentNotified: true,
            followUpRequired: true,
            followUpDate: '2025-05-28',
            status: 'resolved',
            createdDate: '2025-05-25',
            lastUpdated: '2025-05-28',
            attachments: ['emergency_response_log.pdf', 'hospital_report.pdf'],
            witnesses: ['Nurse Mary Wilson', 'Students (PE Class)']
        }
    ];

    filteredEvents = [...medicalEventsData];
    updateEventsDisplay();
    updateEventStats();
}

function updateEventsDisplay() {
    const eventsContainer = document.getElementById('events-container');
    if (!eventsContainer) return;

    eventsContainer.innerHTML = filteredEvents.map(event => {
        const severityClass = getSeverityClass(event.severity);
        const statusClass = getStatusClass(event.status);
        const eventTypeDisplay = getEventTypeDisplay(event.eventType);
        
        return `
            <div class="event-card ${severityClass} ${statusClass}" data-event-id="${event.id}">
                <div class="event-header">
                    <div class="event-info">
                        <h3>${event.studentName} (${event.studentId})</h3>
                        <div class="event-meta">
                            <span class="event-type">${eventTypeDisplay}</span>
                            <span class="event-date">${formatDateTime(event.date, event.time)}</span>
                            <span class="event-location">${event.location}</span>
                        </div>
                    </div>
                    <div class="event-badges">
                        <span class="severity-badge severity-${event.severity}">${capitalizeFirst(event.severity)}</span>
                        <span class="status-badge status-${event.status}">${capitalizeFirst(event.status)}</span>
                    </div>
                </div>

                <div class="event-content">
                    <div class="event-description">
                        <h4><i class="fas fa-file-medical-alt"></i> Description</h4>
                        <p>${event.description}</p>
                    </div>
                    
                    <div class="event-action">
                        <h4><i class="fas fa-hand-paper"></i> Action Taken</h4>
                        <p>${event.actionTaken}</p>
                    </div>

                    <div class="event-details">
                        <div class="detail-row">
                            <div class="detail-item">
                                <i class="fas fa-user-nurse"></i>
                                <span><strong>Staff:</strong> ${event.staffMember}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-phone"></i>
                                <span><strong>Parent Notified:</strong> ${event.parentNotified ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        
                        ${event.followUpRequired ? `
                            <div class="follow-up-info">
                                <i class="fas fa-calendar-check"></i>
                                <span><strong>Follow-up Required:</strong> ${formatDate(event.followUpDate)}</span>
                            </div>
                        ` : ''}
                        
                        ${event.witnesses.length > 0 ? `
                            <div class="witnesses-info">
                                <i class="fas fa-eye"></i>
                                <span><strong>Witnesses:</strong> ${event.witnesses.join(', ')}</span>
                            </div>
                        ` : ''}
                        
                        ${event.attachments.length > 0 ? `
                            <div class="attachments-info">
                                <i class="fas fa-paperclip"></i>
                                <span><strong>Attachments:</strong> ${event.attachments.join(', ')}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="event-actions">
                    <button class="btn-sm btn-edit" onclick="editEvent(${event.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-sm btn-view" onclick="viewEventDetails(${event.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    ${event.status === 'open' ? `
                        <button class="btn-sm btn-resolve" onclick="resolveEvent(${event.id})">
                            <i class="fas fa-check"></i> Resolve
                        </button>
                    ` : ''}
                    ${event.followUpRequired && event.status !== 'resolved' ? `
                        <button class="btn-sm btn-follow-up" onclick="scheduleFollowUp(${event.id})">
                            <i class="fas fa-calendar-plus"></i> Follow-up
                        </button>
                    ` : ''}
                    <button class="btn-sm btn-print" onclick="printEvent(${event.id})">
                        <i class="fas fa-print"></i> Print
                    </button>
                </div>

                <div class="event-footer">
                    <small>Created: ${formatDate(event.createdDate)} | Last Updated: ${formatDate(event.lastUpdated)}</small>
                </div>
            </div>
        `;
    }).join('');

    updateResultsCount();
}

function getSeverityClass(severity) {
    return `severity-${severity}`;
}

function getStatusClass(status) {
    return `status-${status}`;
}

function getEventTypeDisplay(type) {
    const types = {
        'injury': 'Injury',
        'illness': 'Illness',
        'allergic_reaction': 'Allergic Reaction',
        'medication_error': 'Medication Error',
        'emergency': 'Emergency',
        'behavioral': 'Behavioral',
        'other': 'Other'
    };
    return types[type] || type;
}

function filterEvents() {
    const searchTerm = document.getElementById('search-events')?.value.toLowerCase() || '';
    const severityFilter = document.getElementById('severity-filter')?.value || '';
    const statusFilter = document.getElementById('status-filter')?.value || '';
    const typeFilter = document.getElementById('type-filter')?.value || '';
    const dateFilter = document.getElementById('date-filter')?.value || '';

    filteredEvents = medicalEventsData.filter(event => {
        const matchesSearch = event.studentName.toLowerCase().includes(searchTerm) ||
                            event.studentId.toLowerCase().includes(searchTerm) ||
                            event.description.toLowerCase().includes(searchTerm) ||
                            event.location.toLowerCase().includes(searchTerm);
        
        const matchesSeverity = !severityFilter || event.severity === severityFilter;
        const matchesStatus = !statusFilter || event.status === statusFilter;
        const matchesType = !typeFilter || event.eventType === typeFilter;
        
        let matchesDate = true;
        if (dateFilter) {
            const eventDate = new Date(event.date);
            const today = new Date();
            
            switch (dateFilter) {
                case 'today':
                    matchesDate = eventDate.toDateString() === today.toDateString();
                    break;
                case 'week':
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesDate = eventDate >= weekAgo;
                    break;
                case 'month':
                    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    matchesDate = eventDate >= monthAgo;
                    break;
            }
        }
        
        return matchesSearch && matchesSeverity && matchesStatus && matchesType && matchesDate;
    });

    updateEventsDisplay();
}

function updateResultsCount() {
    const resultCount = document.getElementById('results-count');
    if (resultCount) {
        resultCount.textContent = `Showing ${filteredEvents.length} of ${medicalEventsData.length} events`;
    }
}

function updateEventStats() {
    const totalEvents = medicalEventsData.length;
    const openEvents = medicalEventsData.filter(e => e.status === 'open').length;
    const criticalEvents = medicalEventsData.filter(e => e.severity === 'critical').length;
    const todayEvents = medicalEventsData.filter(e => e.date === new Date().toISOString().split('T')[0]).length;

    updateStatCard('total-events', totalEvents);
    updateStatCard('open-events', openEvents);
    updateStatCard('critical-events', criticalEvents);
    updateStatCard('today-events', todayEvents);
}

function updateStatCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function showAddEventModal() {
    alert('Add new medical event functionality would open a comprehensive modal dialog here.');
}

function editEvent(eventId) {
    const event = medicalEventsData.find(e => e.id === eventId);
    if (!event) return;

    alert(`Edit medical event for ${event.studentName}\nThis would open a detailed edit modal in a real application.`);
}

function viewEventDetails(eventId) {
    const event = medicalEventsData.find(e => e.id === eventId);
    if (!event) return;

    alert(`View detailed information for medical event #${eventId}\nThis would show a comprehensive detail modal.`);
}

function resolveEvent(eventId) {
    const event = medicalEventsData.find(e => e.id === eventId);
    if (!event) return;

    if (confirm(`Mark event for ${event.studentName} as resolved?`)) {
        event.status = 'resolved';
        event.lastUpdated = new Date().toISOString().split('T')[0];
        updateEventsDisplay();
        updateEventStats();
        showNotification(`Event for ${event.studentName} marked as resolved`, 'success');
    }
}

function scheduleFollowUp(eventId) {
    const event = medicalEventsData.find(e => e.id === eventId);
    if (!event) return;

    const followUpDate = prompt('Enter follow-up date (YYYY-MM-DD):', event.followUpDate);
    if (followUpDate) {
        event.followUpDate = followUpDate;
        event.lastUpdated = new Date().toISOString().split('T')[0];
        updateEventsDisplay();
        showNotification(`Follow-up scheduled for ${event.studentName}`, 'success');
    }
}

function printEvent(eventId) {
    const event = medicalEventsData.find(e => e.id === eventId);
    if (!event) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(generatePrintableEvent(event));
    printWindow.document.close();
    printWindow.print();
}

function generatePrintableEvent(event) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Medical Event Report - ${event.studentName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
                .section { margin: 20px 0; }
                .severity-critical, .severity-high { color: #dc3545; font-weight: bold; }
                .severity-moderate { color: #ffc107; font-weight: bold; }
                .severity-low { color: #28a745; font-weight: bold; }
                .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>MEDICAL EVENT REPORT</h1>
                <h2>Event #${event.id}</h2>
                <p><strong>Student:</strong> ${event.studentName} (${event.studentId})</p>
                <p><strong>Date:</strong> ${formatDateTime(event.date, event.time)}</p>
            </div>
            
            <div class="section">
                <div class="detail-grid">
                    <div><strong>Event Type:</strong> ${getEventTypeDisplay(event.eventType)}</div>
                    <div><strong>Severity:</strong> <span class="severity-${event.severity}">${capitalizeFirst(event.severity)}</span></div>
                    <div><strong>Location:</strong> ${event.location}</div>
                    <div><strong>Status:</strong> ${capitalizeFirst(event.status)}</div>
                    <div><strong>Staff Member:</strong> ${event.staffMember}</div>
                    <div><strong>Parent Notified:</strong> ${event.parentNotified ? 'Yes' : 'No'}</div>
                </div>
            </div>
            
            <div class="section">
                <h3>Description</h3>
                <p>${event.description}</p>
            </div>
            
            <div class="section">
                <h3>Action Taken</h3>
                <p>${event.actionTaken}</p>
            </div>
            
            ${event.witnesses.length > 0 ? `
                <div class="section">
                    <h3>Witnesses</h3>
                    <ul>${event.witnesses.map(w => `<li>${w}</li>`).join('')}</ul>
                </div>
            ` : ''}
            
            ${event.followUpRequired ? `
                <div class="section">
                    <h3>Follow-up Required</h3>
                    <p><strong>Date:</strong> ${formatDate(event.followUpDate)}</p>
                </div>
            ` : ''}
            
            <div class="section">
                <p><strong>Created:</strong> ${formatDate(event.createdDate)}</p>
                <p><strong>Last Updated:</strong> ${formatDate(event.lastUpdated)}</p>
            </div>
        </body>
        </html>
    `;
}

function exportEvents() {
    const csvContent = generateEventsCSV(filteredEvents);
    downloadCSV(csvContent, 'medical-events-export.csv');
    showNotification('Events exported successfully!', 'success');
}

function generateEventsCSV(data) {
    const headers = [
        'Event ID', 'Student Name', 'Student ID', 'Event Type', 'Severity', 'Date', 'Time',
        'Location', 'Description', 'Action Taken', 'Staff Member', 'Parent Notified',
        'Follow-up Required', 'Follow-up Date', 'Status', 'Created Date', 'Last Updated'
    ];
    
    const csvRows = [
        headers.join(','),
        ...data.map(event => [
            event.id,
            event.studentName,
            event.studentId,
            getEventTypeDisplay(event.eventType),
            capitalizeFirst(event.severity),
            event.date,
            event.time,
            event.location,
            `"${event.description.replace(/"/g, '""')}"`, // Escape quotes
            `"${event.actionTaken.replace(/"/g, '""')}"`,
            event.staffMember,
            event.parentNotified ? 'Yes' : 'No',
            event.followUpRequired ? 'Yes' : 'No',
            event.followUpDate || '',
            capitalizeFirst(event.status),
            event.createdDate,
            event.lastUpdated
        ].join(','))
    ];
    
    return csvRows.join('\n');
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function setupQuickActions() {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            executeQuickAction(action);
        });
    });
}

function executeQuickAction(action) {
    switch (action) {
        case 'emergency':
            alert('EMERGENCY PROTOCOL ACTIVATED\n\n1. Call 911\n2. Notify administration\n3. Contact emergency contacts\n4. Document incident');
            break;
        case 'injury-report':
            showAddEventModal();
            break;
        case 'parent-notification':
            alert('Parent notification system would be activated here.');
            break;
        case 'follow-up-reminders':
            const upcomingFollowUps = medicalEventsData.filter(e => 
                e.followUpRequired && e.status !== 'resolved'
            );
            alert(`${upcomingFollowUps.length} follow-ups scheduled`);
            break;
    }
}

function setupFilters() {
    // Initialize filter options
    const severityFilter = document.getElementById('severity-filter');
    const statusFilter = document.getElementById('status-filter');
    const typeFilter = document.getElementById('type-filter');
    const dateFilter = document.getElementById('date-filter');
    
    if (severityFilter) {
        severityFilter.innerHTML = `
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
        `;
    }
    
    if (statusFilter) {
        statusFilter.innerHTML = `
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="monitoring">Monitoring</option>
            <option value="resolved">Resolved</option>
        `;
    }
    
    if (typeFilter) {
        typeFilter.innerHTML = `
            <option value="">All Types</option>
            <option value="injury">Injury</option>
            <option value="illness">Illness</option>
            <option value="allergic_reaction">Allergic Reaction</option>
            <option value="medication_error">Medication Error</option>
            <option value="emergency">Emergency</option>
            <option value="behavioral">Behavioral</option>
            <option value="other">Other</option>
        `;
    }
    
    if (dateFilter) {
        dateFilter.innerHTML = `
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
        `;
    }
}

function setupPagination() {
    // Pagination would be implemented here for large datasets
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function formatDateTime(dateString, timeString) {
    const date = new Date(dateString + ' ' + timeString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
        ${message}
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#007bff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Export functions for external use
window.MedicalEvents = {
    loadMedicalEventsData,
    filterEvents,
    showAddEventModal,
    editEvent,
    resolveEvent,
    exportEvents
};
