// Appointments Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeAppointments();
    loadAppointmentsData();
    setupEventListeners();
    initializeCalendar();
});

let appointmentsData = [];
let currentView = 'calendar';
let currentDate = new Date();

function initializeAppointments() {
    setupViewToggle();
    setupFilters();
    updateDateDisplay();
}

function setupEventListeners() {
    // View toggle buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            switchView(view);
        });
    });

    // Calendar navigation
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    const todayBtn = document.getElementById('today-btn');

    if (prevBtn) prevBtn.addEventListener('click', () => navigateMonth(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateMonth(1));
    if (todayBtn) todayBtn.addEventListener('click', goToToday);

    // Add appointment button
    const addAppointmentBtn = document.getElementById('add-appointment-btn');
    if (addAppointmentBtn) {
        addAppointmentBtn.addEventListener('click', showAddAppointmentModal);
    }

    // Filter controls
    const statusFilter = document.getElementById('status-filter');
    const typeFilter = document.getElementById('type-filter');
    const dateFilter = document.getElementById('date-filter');

    if (statusFilter) statusFilter.addEventListener('change', filterAppointments);
    if (typeFilter) typeFilter.addEventListener('change', filterAppointments);
    if (dateFilter) dateFilter.addEventListener('change', filterAppointments);

    // Search
    const searchInput = document.getElementById('search-appointments');
    if (searchInput) {
        searchInput.addEventListener('input', filterAppointments);
    }

    // Export button
    const exportBtn = document.getElementById('export-appointments');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportAppointments);
    }
}

function loadAppointmentsData() {
    // Sample appointment data
    appointmentsData = [
        {
            id: 1,
            studentName: 'Emily Johnson',
            studentId: 'STU001',
            type: 'checkup',
            date: '2025-05-30',
            time: '09:00',
            duration: 30,
            status: 'confirmed',
            provider: 'Dr. Sarah Wilson',
            notes: 'Annual health checkup',
            parentContact: '(555) 123-4567',
            createdDate: '2025-05-25'
        },
        {
            id: 2,
            studentName: 'Michael Brown',
            studentId: 'STU002',
            type: 'vaccination',
            date: '2025-05-30',
            time: '10:30',
            duration: 15,
            status: 'confirmed',
            provider: 'Nurse Mary Davis',
            notes: 'HPV vaccine - dose 2',
            parentContact: '(555) 234-5678',
            createdDate: '2025-05-26'
        },
        {
            id: 3,
            studentName: 'Sarah Miller',
            studentId: 'STU003',
            type: 'follow-up',
            date: '2025-05-31',
            time: '14:00',
            duration: 20,
            status: 'pending',
            provider: 'Dr. Sarah Wilson',
            notes: 'Follow-up for allergy medication adjustment',
            parentContact: '(555) 345-6789',
            createdDate: '2025-05-27'
        },
        {
            id: 4,
            studentName: 'James Wilson',
            studentId: 'STU004',
            type: 'urgent',
            date: '2025-05-29',
            time: '11:15',
            duration: 45,
            status: 'completed',
            provider: 'Dr. Sarah Wilson',
            notes: 'Injury assessment - playground accident',
            parentContact: '(555) 456-7890',
            createdDate: '2025-05-29'
        },
        {
            id: 5,
            studentName: 'Lisa Anderson',
            studentId: 'STU005',
            type: 'checkup',
            date: '2025-06-02',
            time: '15:30',
            duration: 30,
            status: 'cancelled',
            provider: 'Nurse Mary Davis',
            notes: 'Sports physical examination',
            parentContact: '(555) 567-8901',
            createdDate: '2025-05-28'
        }
    ];

    updateView();
    updateAppointmentStats();
}

function switchView(view) {
    currentView = view;
    
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Show/hide appropriate sections
    document.getElementById('calendar-view').style.display = view === 'calendar' ? 'block' : 'none';
    document.getElementById('list-view').style.display = view === 'list' ? 'block' : 'none';

    updateView();
}

function updateView() {
    if (currentView === 'calendar') {
        updateCalendarView();
    } else {
        updateListView();
    }
}

function initializeCalendar() {
    updateCalendarView();
}

function updateCalendarView() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Clear previous calendar
    calendarGrid.innerHTML = '';

    // Create calendar header
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // Check if it's today
        const today = new Date();
        if (dayDate.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }

        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);

        // Add appointments for this day
        const dayAppointments = getAppointmentsForDate(dayDate);
        if (dayAppointments.length > 0) {
            dayElement.classList.add('has-appointments');
            
            const appointmentsList = document.createElement('div');
            appointmentsList.className = 'day-appointments';
            
            dayAppointments.slice(0, 3).forEach(appointment => {
                const appointmentElement = document.createElement('div');
                appointmentElement.className = `appointment-item status-${appointment.status} type-${appointment.type}`;
                appointmentElement.innerHTML = `
                    <div class="appointment-time">${appointment.time}</div>
                    <div class="appointment-student">${appointment.studentName}</div>
                `;
                appointmentElement.addEventListener('click', () => showAppointmentDetails(appointment.id));
                appointmentsList.appendChild(appointmentElement);
            });

            if (dayAppointments.length > 3) {
                const moreElement = document.createElement('div');
                moreElement.className = 'more-appointments';
                moreElement.textContent = `+${dayAppointments.length - 3} more`;
                appointmentsList.appendChild(moreElement);
            }

            dayElement.appendChild(appointmentsList);
        }

        // Add click handler for adding appointments
        dayElement.addEventListener('click', function(e) {
            if (e.target === dayElement || e.target === dayNumber) {
                showAddAppointmentModal(dayDate);
            }
        });

        calendarGrid.appendChild(dayElement);
    }

    updateDateDisplay();
}

function updateListView() {
    const appointmentsList = document.getElementById('appointments-list');
    if (!appointmentsList) return;

    const filteredAppointments = getFilteredAppointments();
    
    appointmentsList.innerHTML = filteredAppointments.map(appointment => `
        <div class="appointment-card status-${appointment.status}" data-appointment-id="${appointment.id}">
            <div class="appointment-header">
                <div class="appointment-info">
                    <h3>${appointment.studentName}</h3>
                    <span class="student-id">${appointment.studentId}</span>
                </div>
                <div class="appointment-status">
                    <span class="status-badge status-${appointment.status}">${capitalizeFirst(appointment.status)}</span>
                </div>
            </div>
            
            <div class="appointment-details">
                <div class="detail-row">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(appointment.date)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${appointment.time} (${appointment.duration} min)</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-user-md"></i>
                        <span>${appointment.provider}</span>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-item">
                        <i class="fas fa-stethoscope"></i>
                        <span class="type-badge type-${appointment.type}">${getTypeDisplay(appointment.type)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <span>${appointment.parentContact}</span>
                    </div>
                </div>
                
                ${appointment.notes ? `
                    <div class="appointment-notes">
                        <i class="fas fa-sticky-note"></i>
                        <span>${appointment.notes}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="appointment-actions">
                <button class="btn-sm btn-edit" onclick="editAppointment(${appointment.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-sm btn-complete" onclick="completeAppointment(${appointment.id})" 
                        ${appointment.status === 'completed' ? 'disabled' : ''}>
                    <i class="fas fa-check"></i> Complete
                </button>
                <button class="btn-sm btn-cancel" onclick="cancelAppointment(${appointment.id})"
                        ${appointment.status === 'cancelled' || appointment.status === 'completed' ? 'disabled' : ''}>
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button class="btn-sm btn-delete" onclick="deleteAppointment(${appointment.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');

    updateResultsCount(filteredAppointments.length);
}

function getAppointmentsForDate(date) {
    const dateString = date.toISOString().split('T')[0];
    return appointmentsData.filter(appointment => appointment.date === dateString);
}

function getFilteredAppointments() {
    let filtered = [...appointmentsData];

    // Apply filters
    const statusFilter = document.getElementById('status-filter')?.value;
    const typeFilter = document.getElementById('type-filter')?.value;
    const dateFilter = document.getElementById('date-filter')?.value;
    const searchTerm = document.getElementById('search-appointments')?.value.toLowerCase();

    if (statusFilter) {
        filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    if (typeFilter) {
        filtered = filtered.filter(apt => apt.type === typeFilter);
    }

    if (dateFilter) {
        const today = new Date();
        const filterDate = new Date(today);
        
        switch (dateFilter) {
            case 'today':
                filterDate.setDate(today.getDate());
                break;
            case 'tomorrow':
                filterDate.setDate(today.getDate() + 1);
                break;
            case 'week':
                filterDate.setDate(today.getDate() + 7);
                break;
            case 'month':
                filterDate.setMonth(today.getMonth() + 1);
                break;
        }

        if (dateFilter !== 'all') {
            filtered = filtered.filter(apt => {
                const aptDate = new Date(apt.date);
                return dateFilter === 'today' ? 
                    aptDate.toDateString() === today.toDateString() :
                    aptDate <= filterDate;
            });
        }
    }

    if (searchTerm) {
        filtered = filtered.filter(apt => 
            apt.studentName.toLowerCase().includes(searchTerm) ||
            apt.studentId.toLowerCase().includes(searchTerm) ||
            apt.provider.toLowerCase().includes(searchTerm) ||
            apt.notes.toLowerCase().includes(searchTerm)
        );
    }

    return filtered.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
}

function filterAppointments() {
    updateView();
}

function navigateMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    updateCalendarView();
}

function goToToday() {
    currentDate = new Date();
    updateCalendarView();
}

function updateDateDisplay() {
    const monthYearElement = document.getElementById('current-month-year');
    if (monthYearElement) {
        const options = { year: 'numeric', month: 'long' };
        monthYearElement.textContent = currentDate.toLocaleDateString(undefined, options);
    }
}

function showAddAppointmentModal(selectedDate = null) {
    // In a real application, this would show a modal dialog
    const defaultDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
    
    const newAppointment = {
        studentName: prompt('Enter student name:'),
        studentId: prompt('Enter student ID:'),
        type: prompt('Enter appointment type (checkup/vaccination/follow-up/urgent):'),
        date: prompt('Enter date (YYYY-MM-DD):', defaultDate),
        time: prompt('Enter time (HH:MM):'),
        duration: parseInt(prompt('Enter duration (minutes):', '30')),
        provider: prompt('Enter provider name:'),
        notes: prompt('Enter notes (optional):') || '',
        parentContact: prompt('Enter parent contact:')
    };

    if (newAppointment.studentName && newAppointment.date && newAppointment.time) {
        newAppointment.id = appointmentsData.length + 1;
        newAppointment.status = 'pending';
        newAppointment.createdDate = new Date().toISOString().split('T')[0];
        
        appointmentsData.push(newAppointment);
        updateView();
        updateAppointmentStats();
        showNotification('Appointment created successfully!', 'success');
    }
}

function editAppointment(appointmentId) {
    const appointment = appointmentsData.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    alert(`Edit appointment for ${appointment.studentName}\nThis would open an edit modal in a real application.`);
}

function completeAppointment(appointmentId) {
    const appointment = appointmentsData.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    appointment.status = 'completed';
    updateView();
    updateAppointmentStats();
    showNotification(`Appointment for ${appointment.studentName} marked as completed`, 'success');
}

function cancelAppointment(appointmentId) {
    const appointment = appointmentsData.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    if (confirm(`Are you sure you want to cancel the appointment for ${appointment.studentName}?`)) {
        appointment.status = 'cancelled';
        updateView();
        updateAppointmentStats();
        showNotification(`Appointment for ${appointment.studentName} cancelled`, 'info');
    }
}

function deleteAppointment(appointmentId) {
    const appointment = appointmentsData.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    if (confirm(`Are you sure you want to delete the appointment for ${appointment.studentName}?`)) {
        appointmentsData = appointmentsData.filter(apt => apt.id !== appointmentId);
        updateView();
        updateAppointmentStats();
        showNotification('Appointment deleted successfully', 'success');
    }
}

function showAppointmentDetails(appointmentId) {
    const appointment = appointmentsData.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    alert(`Appointment Details for ${appointment.studentName}\nThis would show a detailed modal in a real application.`);
}

function updateAppointmentStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const todayAppointments = appointmentsData.filter(apt => apt.date === today).length;
    const pendingAppointments = appointmentsData.filter(apt => apt.status === 'pending').length;
    const completedAppointments = appointmentsData.filter(apt => apt.status === 'completed').length;
    const upcomingAppointments = appointmentsData.filter(apt => 
        new Date(apt.date) > new Date() && apt.status !== 'cancelled'
    ).length;

    updateStatCard('today-appointments', todayAppointments);
    updateStatCard('pending-appointments', pendingAppointments);
    updateStatCard('completed-appointments', completedAppointments);
    updateStatCard('upcoming-appointments', upcomingAppointments);
}

function updateStatCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function updateResultsCount(count) {
    const resultCount = document.getElementById('results-count');
    if (resultCount) {
        resultCount.textContent = `Showing ${count} appointments`;
    }
}

function exportAppointments() {
    const filtered = getFilteredAppointments();
    const csvContent = generateAppointmentCSV(filtered);
    downloadCSV(csvContent, 'appointments-export.csv');
    showNotification('Appointments exported successfully!', 'success');
}

function generateAppointmentCSV(data) {
    const headers = ['Student Name', 'Student ID', 'Type', 'Date', 'Time', 'Duration', 'Status', 'Provider', 'Notes', 'Parent Contact'];
    
    const csvRows = [
        headers.join(','),
        ...data.map(apt => [
            apt.studentName,
            apt.studentId,
            getTypeDisplay(apt.type),
            apt.date,
            apt.time,
            apt.duration,
            capitalizeFirst(apt.status),
            apt.provider,
            apt.notes.replace(/,/g, ';'), // Replace commas to avoid CSV issues
            apt.parentContact
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

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTypeDisplay(type) {
    const types = {
        'checkup': 'Health Checkup',
        'vaccination': 'Vaccination',
        'follow-up': 'Follow-up',
        'urgent': 'Urgent Care'
    };
    return types[type] || type;
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
        background: ${type === 'success' ? '#28a745' : type === 'info' ? '#007bff' : '#ffc107'};
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

function setupViewToggle() {
    // Initialize with calendar view
    switchView('calendar');
}

function setupFilters() {
    // Initialize filter options
    const statusFilter = document.getElementById('status-filter');
    const typeFilter = document.getElementById('type-filter');
    
    if (statusFilter) {
        statusFilter.innerHTML = `
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
        `;
    }
    
    if (typeFilter) {
        typeFilter.innerHTML = `
            <option value="">All Types</option>
            <option value="checkup">Health Checkup</option>
            <option value="vaccination">Vaccination</option>
            <option value="follow-up">Follow-up</option>
            <option value="urgent">Urgent Care</option>
        `;
    }
}

// Export functions for external use
window.AppointmentsManager = {
    loadAppointmentsData,
    switchView,
    showAddAppointmentModal,
    editAppointment,
    deleteAppointment,
    filterAppointments,
    exportAppointments
};
