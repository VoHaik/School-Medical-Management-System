// Emergency Contacts Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeEmergencyContacts();
    loadContactsData();
    setupEventListeners();
});

let contactsData = [];
let filteredData = [];

function initializeEmergencyContacts() {
    setupSearch();
    setupFilters();
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-contacts');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterContacts();
        });
    }

    // Grade filter
    const gradeFilter = document.getElementById('grade-filter');
    if (gradeFilter) {
        gradeFilter.addEventListener('change', function() {
            filterContacts();
        });
    }

    // Status filter
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterContacts();
        });
    }

    // Alert type filter
    const alertFilter = document.getElementById('alert-filter');
    if (alertFilter) {
        alertFilter.addEventListener('change', function() {
            filterContacts();
        });
    }

    // Add contact button
    const addContactBtn = document.getElementById('add-contact-btn');
    if (addContactBtn) {
        addContactBtn.addEventListener('click', showAddContactModal);
    }

    // Export button
    const exportBtn = document.getElementById('export-contacts');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportContacts);
    }

    // Print button
    const printBtn = document.getElementById('print-contacts');
    if (printBtn) {
        printBtn.addEventListener('click', printContacts);
    }

    // Emergency procedures buttons
    setupEmergencyProcedures();
}

function loadContactsData() {
    // Sample contact data
    contactsData = [
        {
            id: 1,
            studentName: 'Emily Johnson',
            studentId: 'STU001',
            grade: '5',
            primaryContact: {
                name: 'Jennifer Johnson',
                relationship: 'Mother',
                phone: '(555) 123-4567',
                email: 'jennifer.johnson@email.com',
                address: '123 Main St, Springfield, IL 62701'
            },
            secondaryContact: {
                name: 'David Johnson',
                relationship: 'Father',
                phone: '(555) 123-4568',
                email: 'david.johnson@email.com',
                address: '123 Main St, Springfield, IL 62701'
            },
            emergencyContact: {
                name: 'Susan Miller',
                relationship: 'Grandmother',
                phone: '(555) 234-5678',
                email: 'susan.miller@email.com',
                address: '456 Oak Ave, Springfield, IL 62702'
            },
            medicalAlerts: ['Severe peanut allergy', 'Asthma inhaler required'],
            allergies: ['Peanuts', 'Tree nuts'],
            medications: ['Albuterol inhaler (as needed)'],
            physician: 'Dr. Sarah Chen - (555) 345-6789',
            status: 'complete',
            lastUpdated: '2025-05-25'
        },
        {
            id: 2,
            studentName: 'Michael Brown',
            studentId: 'STU002',
            grade: '7',
            primaryContact: {
                name: 'Lisa Brown',
                relationship: 'Mother',
                phone: '(555) 234-5678',
                email: 'lisa.brown@email.com',
                address: '789 Elm St, Springfield, IL 62703'
            },
            secondaryContact: {
                name: 'Robert Brown',
                relationship: 'Father',
                phone: '(555) 234-5679',
                email: 'robert.brown@email.com',
                address: '789 Elm St, Springfield, IL 62703'
            },
            emergencyContact: {
                name: 'Mary Thompson',
                relationship: 'Aunt',
                phone: '(555) 345-6789',
                email: 'mary.thompson@email.com',
                address: '321 Pine St, Springfield, IL 62704'
            },
            medicalAlerts: ['Type 1 Diabetes'],
            allergies: [],
            medications: ['Insulin', 'Glucose meter'],
            physician: 'Dr. Michael Rodriguez - (555) 456-7890',
            status: 'complete',
            lastUpdated: '2025-05-24'
        },
        {
            id: 3,
            studentName: 'Sarah Miller',
            studentId: 'STU003',
            grade: '3',
            primaryContact: {
                name: 'Amanda Miller',
                relationship: 'Mother',
                phone: '(555) 345-6789',
                email: 'amanda.miller@email.com',
                address: '654 Maple Dr, Springfield, IL 62705'
            },
            secondaryContact: null,
            emergencyContact: {
                name: 'John Miller',
                relationship: 'Uncle',
                phone: '(555) 456-7890',
                email: 'john.miller@email.com',
                address: '987 Cedar Ln, Springfield, IL 62706'
            },
            medicalAlerts: [],
            allergies: ['Lactose intolerant'],
            medications: [],
            physician: 'Dr. Jennifer Lee - (555) 567-8901',
            status: 'incomplete',
            lastUpdated: '2025-05-22'
        },
        {
            id: 4,
            studentName: 'James Wilson',
            studentId: 'STU004',
            grade: '6',
            primaryContact: {
                name: 'Patricia Wilson',
                relationship: 'Mother',
                phone: '(555) 456-7890',
                email: 'patricia.wilson@email.com',
                address: '147 Birch St, Springfield, IL 62707'
            },
            secondaryContact: {
                name: 'Thomas Wilson',
                relationship: 'Father',
                phone: '(555) 456-7891',
                email: 'thomas.wilson@email.com',
                address: '147 Birch St, Springfield, IL 62707'
            },
            emergencyContact: {
                name: 'Helen Davis',
                relationship: 'Neighbor',
                phone: '(555) 567-8901',
                email: 'helen.davis@email.com',
                address: '149 Birch St, Springfield, IL 62707'
            },
            medicalAlerts: ['ADHD', 'Takes medication during school hours'],
            allergies: [],
            medications: ['Adderall 10mg - Morning dose'],
            physician: 'Dr. Robert Kim - (555) 678-9012',
            status: 'complete',
            lastUpdated: '2025-05-26'
        }
    ];

    filteredData = [...contactsData];
    updateContactsDisplay();
    updateContactStats();
}

function updateContactsDisplay() {
    const contactsContainer = document.getElementById('contacts-container');
    if (!contactsContainer) return;

    contactsContainer.innerHTML = filteredData.map(contact => {
        const statusClass = contact.status === 'complete' ? 'status-complete' : 'status-incomplete';
        const hasAlerts = contact.medicalAlerts.length > 0;
        
        return `
            <div class="contact-card ${statusClass}" data-contact-id="${contact.id}">
                <div class="contact-header">
                    <div class="student-info">
                        <h3>${contact.studentName}</h3>
                        <div class="student-details">
                            <span class="student-id">${contact.studentId}</span>
                            <span class="grade-badge">Grade ${contact.grade}</span>
                            ${hasAlerts ? '<span class="alert-indicator"><i class="fas fa-exclamation-triangle"></i> Medical Alert</span>' : ''}
                        </div>
                    </div>
                    <div class="contact-status">
                        <span class="status-badge ${statusClass}">
                            ${contact.status === 'complete' ? 'Complete' : 'Incomplete'}
                        </span>
                    </div>
                </div>

                ${hasAlerts ? `
                    <div class="medical-alerts">
                        <h4><i class="fas fa-exclamation-triangle"></i> Medical Alerts</h4>
                        <ul>
                            ${contact.medicalAlerts.map(alert => `<li>${alert}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                <div class="contacts-grid">
                    <div class="contact-section">
                        <h4><i class="fas fa-user"></i> Primary Contact</h4>
                        ${renderContactInfo(contact.primaryContact)}
                    </div>
                    
                    ${contact.secondaryContact ? `
                        <div class="contact-section">
                            <h4><i class="fas fa-user"></i> Secondary Contact</h4>
                            ${renderContactInfo(contact.secondaryContact)}
                        </div>
                    ` : `
                        <div class="contact-section missing">
                            <h4><i class="fas fa-user"></i> Secondary Contact</h4>
                            <p class="missing-info">No secondary contact provided</p>
                        </div>
                    `}
                    
                    <div class="contact-section">
                        <h4><i class="fas fa-ambulance"></i> Emergency Contact</h4>
                        ${renderContactInfo(contact.emergencyContact)}
                    </div>
                </div>

                <div class="medical-info">
                    <div class="medical-section">
                        <h4><i class="fas fa-pills"></i> Medications</h4>
                        ${contact.medications.length > 0 ? 
                            `<ul>${contact.medications.map(med => `<li>${med}</li>`).join('')}</ul>` : 
                            '<p class="no-info">No medications listed</p>'
                        }
                    </div>
                    
                    <div class="medical-section">
                        <h4><i class="fas fa-allergies"></i> Allergies</h4>
                        ${contact.allergies.length > 0 ? 
                            `<ul>${contact.allergies.map(allergy => `<li>${allergy}</li>`).join('')}</ul>` : 
                            '<p class="no-info">No known allergies</p>'
                        }
                    </div>
                    
                    <div class="medical-section">
                        <h4><i class="fas fa-user-md"></i> Primary Physician</h4>
                        <p>${contact.physician}</p>
                    </div>
                </div>

                <div class="contact-actions">
                    <button class="btn-sm btn-edit" onclick="editContact(${contact.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-sm btn-call" onclick="callPrimaryContact(${contact.id})">
                        <i class="fas fa-phone"></i> Call Primary
                    </button>
                    <button class="btn-sm btn-emergency" onclick="callEmergencyContact(${contact.id})">
                        <i class="fas fa-exclamation-circle"></i> Emergency Call
                    </button>
                    <button class="btn-sm btn-print" onclick="printContactCard(${contact.id})">
                        <i class="fas fa-print"></i> Print
                    </button>
                </div>

                <div class="last-updated">
                    Last updated: ${formatDate(contact.lastUpdated)}
                </div>
            </div>
        `;
    }).join('');

    updateResultsCount();
}

function renderContactInfo(contact) {
    if (!contact) return '<p class="missing-info">Contact information missing</p>';
    
    return `
        <div class="contact-details">
            <div class="contact-name">${contact.name}</div>
            <div class="contact-relationship">${contact.relationship}</div>
            <div class="contact-phone">
                <i class="fas fa-phone"></i>
                <a href="tel:${contact.phone}">${contact.phone}</a>
            </div>
            <div class="contact-email">
                <i class="fas fa-envelope"></i>
                <a href="mailto:${contact.email}">${contact.email}</a>
            </div>
            <div class="contact-address">
                <i class="fas fa-map-marker-alt"></i>
                ${contact.address}
            </div>
        </div>
    `;
}

function filterContacts() {
    const searchTerm = document.getElementById('search-contacts')?.value.toLowerCase() || '';
    const gradeFilter = document.getElementById('grade-filter')?.value || '';
    const statusFilter = document.getElementById('status-filter')?.value || '';
    const alertFilter = document.getElementById('alert-filter')?.value || '';

    filteredData = contactsData.filter(contact => {
        const matchesSearch = contact.studentName.toLowerCase().includes(searchTerm) ||
                            contact.studentId.toLowerCase().includes(searchTerm) ||
                            contact.primaryContact?.name.toLowerCase().includes(searchTerm);
        
        const matchesGrade = !gradeFilter || contact.grade === gradeFilter;
        const matchesStatus = !statusFilter || contact.status === statusFilter;
        
        let matchesAlert = true;
        if (alertFilter === 'with-alerts') {
            matchesAlert = contact.medicalAlerts.length > 0;
        } else if (alertFilter === 'no-alerts') {
            matchesAlert = contact.medicalAlerts.length === 0;
        }
        
        return matchesSearch && matchesGrade && matchesStatus && matchesAlert;
    });

    updateContactsDisplay();
}

function updateResultsCount() {
    const resultCount = document.getElementById('results-count');
    if (resultCount) {
        resultCount.textContent = `Showing ${filteredData.length} of ${contactsData.length} students`;
    }
}

function updateContactStats() {
    const totalStudents = contactsData.length;
    const completeContacts = contactsData.filter(c => c.status === 'complete').length;
    const incompleteContacts = contactsData.filter(c => c.status === 'incomplete').length;
    const medicalAlerts = contactsData.filter(c => c.medicalAlerts.length > 0).length;

    updateStatCard('total-students', totalStudents);
    updateStatCard('complete-contacts', completeContacts);
    updateStatCard('incomplete-contacts', incompleteContacts);
    updateStatCard('medical-alerts', medicalAlerts);
}

function updateStatCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function showAddContactModal() {
    alert('Add new student contact functionality would open a modal dialog here.');
}

function editContact(contactId) {
    const contact = contactsData.find(c => c.id === contactId);
    if (!contact) return;

    alert(`Edit contact for ${contact.studentName}\nThis would open an edit modal in a real application.`);
}

function callPrimaryContact(contactId) {
    const contact = contactsData.find(c => c.id === contactId);
    if (!contact || !contact.primaryContact) return;

    const phone = contact.primaryContact.phone;
    if (confirm(`Call ${contact.primaryContact.name} at ${phone}?`)) {
        // In a real application, this might integrate with a phone system
        window.open(`tel:${phone}`);
        logEmergencyAction(contactId, 'primary_call', `Called primary contact: ${contact.primaryContact.name}`);
    }
}

function callEmergencyContact(contactId) {
    const contact = contactsData.find(c => c.id === contactId);
    if (!contact || !contact.emergencyContact) return;

    const phone = contact.emergencyContact.phone;
    if (confirm(`EMERGENCY CALL to ${contact.emergencyContact.name} at ${phone}?`)) {
        window.open(`tel:${phone}`);
        logEmergencyAction(contactId, 'emergency_call', `Emergency call to: ${contact.emergencyContact.name}`);
        showEmergencyCallDialog(contact);
    }
}

function showEmergencyCallDialog(contact) {
    const alertInfo = contact.medicalAlerts.length > 0 ? 
        `\nMEDICAL ALERTS:\n${contact.medicalAlerts.join('\n')}` : '';
    
    alert(`EMERGENCY CALL INITIATED\n\nStudent: ${contact.studentName}\nGrade: ${contact.grade}${alertInfo}\n\nPlease document this emergency call in the system.`);
}

function printContactCard(contactId) {
    const contact = contactsData.find(c => c.id === contactId);
    if (!contact) return;

    // Create a print-friendly version
    const printWindow = window.open('', '_blank');
    printWindow.document.write(generatePrintableContactCard(contact));
    printWindow.document.close();
    printWindow.print();
}

function generatePrintableContactCard(contact) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Emergency Contact Card - ${contact.studentName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
                .section { margin: 15px 0; }
                .alert { background: #ffebee; border: 1px solid #f44336; padding: 10px; margin: 10px 0; }
                .contact-info { display: inline-block; width: 45%; vertical-align: top; margin: 10px; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>EMERGENCY CONTACT CARD</h1>
                <h2>${contact.studentName} (${contact.studentId})</h2>
                <p>Grade ${contact.grade}</p>
            </div>
            
            ${contact.medicalAlerts.length > 0 ? `
                <div class="alert">
                    <h3>⚠️ MEDICAL ALERTS</h3>
                    ${contact.medicalAlerts.map(alert => `<p><strong>${alert}</strong></p>`).join('')}
                </div>
            ` : ''}
            
            <div class="section">
                <div class="contact-info">
                    <h3>PRIMARY CONTACT</h3>
                    <p><strong>${contact.primaryContact.name}</strong></p>
                    <p>${contact.primaryContact.relationship}</p>
                    <p>📞 ${contact.primaryContact.phone}</p>
                    <p>📧 ${contact.primaryContact.email}</p>
                </div>
                
                <div class="contact-info">
                    <h3>EMERGENCY CONTACT</h3>
                    <p><strong>${contact.emergencyContact.name}</strong></p>
                    <p>${contact.emergencyContact.relationship}</p>
                    <p>📞 ${contact.emergencyContact.phone}</p>
                    <p>📧 ${contact.emergencyContact.email}</p>
                </div>
            </div>
            
            <div class="section">
                <h3>MEDICAL INFORMATION</h3>
                <p><strong>Physician:</strong> ${contact.physician}</p>
                <p><strong>Medications:</strong> ${contact.medications.join(', ') || 'None'}</p>
                <p><strong>Allergies:</strong> ${contact.allergies.join(', ') || 'None'}</p>
            </div>
        </body>
        </html>
    `;
}

function exportContacts() {
    const csvContent = generateContactsCSV(filteredData);
    downloadCSV(csvContent, 'emergency-contacts-export.csv');
    showNotification('Contacts exported successfully!', 'success');
}

function generateContactsCSV(data) {
    const headers = [
        'Student Name', 'Student ID', 'Grade', 'Status',
        'Primary Name', 'Primary Phone', 'Primary Email', 'Primary Relationship',
        'Emergency Name', 'Emergency Phone', 'Emergency Email', 'Emergency Relationship',
        'Medical Alerts', 'Allergies', 'Medications', 'Physician'
    ];
    
    const csvRows = [
        headers.join(','),
        ...data.map(contact => [
            contact.studentName,
            contact.studentId,
            contact.grade,
            contact.status,
            contact.primaryContact?.name || '',
            contact.primaryContact?.phone || '',
            contact.primaryContact?.email || '',
            contact.primaryContact?.relationship || '',
            contact.emergencyContact?.name || '',
            contact.emergencyContact?.phone || '',
            contact.emergencyContact?.email || '',
            contact.emergencyContact?.relationship || '',
            contact.medicalAlerts.join('; '),
            contact.allergies.join('; '),
            contact.medications.join('; '),
            contact.physician
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

function printContacts() {
    window.print();
}

function setupEmergencyProcedures() {
    const emergencyButtons = document.querySelectorAll('.emergency-procedure-btn');
    emergencyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const procedure = this.getAttribute('data-procedure');
            showEmergencyProcedure(procedure);
        });
    });
}

function showEmergencyProcedure(procedure) {
    const procedures = {
        'medical': `
            MEDICAL EMERGENCY PROCEDURE:
            1. Call 911 immediately
            2. Contact student's primary contact
            3. Contact emergency contact if primary unavailable
            4. Notify school administration
            5. Document incident in health records
            6. Follow up with parents/guardians
        `,
        'allergic': `
            ALLERGIC REACTION PROCEDURE:
            1. Administer emergency medication (EpiPen if available)
            2. Call 911
            3. Contact parents/emergency contacts
            4. Monitor student continuously
            5. Document reaction and treatment
            6. Follow up with medical provider
        `,
        'injury': `
            INJURY PROCEDURE:
            1. Assess severity of injury
            2. Provide first aid if trained
            3. Call 911 for serious injuries
            4. Contact parents/emergency contacts
            5. Document incident thoroughly
            6. Complete accident report forms
        `,
        'lockdown': `
            LOCKDOWN PROCEDURE:
            1. Secure all students in health office
            2. Lock doors and windows
            3. Turn off lights
            4. Contact emergency contacts for students in office
            5. Wait for all-clear from administration
            6. Account for all students
        `
    };

    alert(procedures[procedure] || 'Emergency procedure not found.');
}

function logEmergencyAction(contactId, action, details) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        contactId,
        action,
        details,
        timestamp,
        user: 'Current User' // In real app, get from auth system
    };
    
    // In a real application, this would be sent to the server
    console.log('Emergency action logged:', logEntry);
    
    // Store in localStorage for demo purposes
    const existingLogs = JSON.parse(localStorage.getItem('emergencyLogs') || '[]');
    existingLogs.push(logEntry);
    localStorage.setItem('emergencyLogs', JSON.stringify(existingLogs));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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

function setupSearch() {
    // Initialize search functionality
    const searchInput = document.getElementById('search-contacts');
    if (searchInput) {
        searchInput.placeholder = 'Search by student name, ID, or parent name...';
    }
}

function setupFilters() {
    // Initialize filter options
    const gradeFilter = document.getElementById('grade-filter');
    if (gradeFilter) {
        gradeFilter.innerHTML = `
            <option value="">All Grades</option>
            <option value="K">Kindergarten</option>
            <option value="1">Grade 1</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
            <option value="4">Grade 4</option>
            <option value="5">Grade 5</option>
            <option value="6">Grade 6</option>
            <option value="7">Grade 7</option>
            <option value="8">Grade 8</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
        `;
    }
}

// Export functions for external use
window.EmergencyContacts = {
    loadContactsData,
    filterContacts,
    editContact,
    callPrimaryContact,
    callEmergencyContact,
    exportContacts,
    printContacts
};
