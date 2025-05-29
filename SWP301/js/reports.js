// Reports and Analytics JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeReports();
    loadReportsData();
    setupEventListeners();
    initializeCharts();
});

let reportsData = {};
let charts = {};

function initializeReports() {
    setupDateRangeFilter();
    setupReportTypes();
}

function setupEventListeners() {
    // Date range filter
    const dateRangeSelect = document.getElementById('date-range');
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', function() {
            updateDateRange();
            refreshAllReports();
        });
    }

    // Custom date inputs
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    
    if (startDateInput) {
        startDateInput.addEventListener('change', refreshAllReports);
    }
    if (endDateInput) {
        endDateInput.addEventListener('change', refreshAllReports);
    }

    // Export buttons
    const exportPdfBtn = document.getElementById('export-pdf');
    const exportExcelBtn = document.getElementById('export-excel');
    const exportCsvBtn = document.getElementById('export-csv');

    if (exportPdfBtn) exportPdfBtn.addEventListener('click', () => exportReport('pdf'));
    if (exportExcelBtn) exportExcelBtn.addEventListener('click', () => exportReport('excel'));
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', () => exportReport('csv'));

    // Print button
    const printBtn = document.getElementById('print-report');
    if (printBtn) {
        printBtn.addEventListener('click', printReport);
    }

    // Refresh button
    const refreshBtn = document.getElementById('refresh-data');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshAllReports);
    }

    // Chart type toggles
    document.querySelectorAll('.chart-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const chartId = this.getAttribute('data-chart');
            const chartType = this.getAttribute('data-type');
            updateChartType(chartId, chartType);
        });
    });

    // Grade filter for grade-specific reports
    const gradeFilter = document.getElementById('grade-filter');
    if (gradeFilter) {
        gradeFilter.addEventListener('change', refreshGradeSpecificReports);
    }
}

function loadReportsData() {
    // Sample data for various reports
    reportsData = {
        healthStats: {
            totalStudents: 1250,
            healthRecordsComplete: 1180,
            healthRecordsIncomplete: 70,
            activeHealthAlerts: 45,
            medicationsTracked: 180,
            appointmentsThisMonth: 120,
            vaccinationCompliance: 92.5
        },
        vaccinationData: {
            required: ['MMR', 'DtaP', 'Polio', 'Hepatitis B', 'Varicella'],
            compliance: [95.2, 93.8, 96.1, 91.5, 89.3],
            byGrade: {
                'K': [98, 96, 98, 94, 92],
                '1': [96, 95, 97, 93, 90],
                '2': [95, 94, 96, 92, 89],
                '3': [94, 93, 95, 91, 88],
                '4': [93, 92, 94, 90, 87],
                '5': [92, 91, 93, 89, 86],
                '6': [91, 90, 92, 88, 85],
                '7': [90, 89, 91, 87, 84],
                '8': [89, 88, 90, 86, 83],
                '9': [88, 87, 89, 85, 82],
                '10': [87, 86, 88, 84, 81],
                '11': [86, 85, 87, 83, 80],
                '12': [85, 84, 86, 82, 79]
            }
        },
        medicationUsage: {
            categories: ['Prescription', 'Over-the-Counter', 'Emergency', 'Chronic'],
            counts: [120, 45, 8, 35],
            trending: {
                'Prescription': { current: 120, previous: 115, change: 4.3 },
                'Over-the-Counter': { current: 45, previous: 52, change: -13.5 },
                'Emergency': { current: 8, previous: 12, change: -33.3 },
                'Chronic': { current: 35, previous: 33, change: 6.1 }
            }
        },
        appointmentTrends: {
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            appointments: [85, 92, 108, 95, 120],
            types: {
                'Health Checkups': [25, 30, 35, 28, 40],
                'Vaccinations': [20, 25, 30, 25, 35],
                'Follow-ups': [15, 18, 20, 18, 25],
                'Urgent Care': [25, 19, 23, 24, 20]
            }
        },
        healthAlerts: {
            severity: ['Critical', 'High', 'Medium', 'Low'],
            counts: [3, 12, 20, 10],
            types: ['Allergies', 'Chronic Conditions', 'Medications', 'Emergency Contacts'],
            typeCounts: [25, 15, 8, 7]
        },
        gradeAnalysis: {
            grades: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            enrollment: [95, 98, 102, 105, 100, 96, 94, 92, 90, 88, 85, 82, 80],
            healthCompliance: [98, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85],
            activeAlerts: [2, 3, 4, 3, 5, 4, 3, 4, 5, 6, 4, 3, 2]
        }
    };

    updateHealthStatistics();
    updateTrendingSummary();
}

function initializeCharts() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded. Charts will not be displayed.');
        return;
    }

    // Initialize all charts
    createVaccinationChart();
    createMedicationChart();
    createAppointmentTrendsChart();
    createHealthAlertsChart();
    createGradeAnalysisChart();
}

function createVaccinationChart() {
    const ctx = document.getElementById('vaccination-chart');
    if (!ctx) return;

    const data = reportsData.vaccinationData;
    
    charts.vaccination = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.required,
            datasets: [{
                label: 'Compliance Rate (%)',
                data: data.compliance,
                backgroundColor: [
                    '#28a745',
                    '#007bff',
                    '#ffc107',
                    '#dc3545',
                    '#6f42c1'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Vaccination Compliance by Type'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function createMedicationChart() {
    const ctx = document.getElementById('medication-chart');
    if (!ctx) return;

    const data = reportsData.medicationUsage;
    
    charts.medication = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.categories,
            datasets: [{
                data: data.counts,
                backgroundColor: [
                    '#007bff',
                    '#28a745',
                    '#dc3545',
                    '#ffc107'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Medication Usage by Category'
                }
            }
        }
    });
}

function createAppointmentTrendsChart() {
    const ctx = document.getElementById('appointment-trends-chart');
    if (!ctx) return;

    const data = reportsData.appointmentTrends;
    
    const datasets = Object.keys(data.types).map((type, index) => ({
        label: type,
        data: data.types[type],
        borderColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'][index],
        backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'][index] + '20',
        tension: 0.4,
        fill: false
    }));

    charts.appointmentTrends = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.months,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Appointment Trends by Type'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createHealthAlertsChart() {
    const ctx = document.getElementById('health-alerts-chart');
    if (!ctx) return;

    const data = reportsData.healthAlerts;
    
    charts.healthAlerts = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.types,
            datasets: [{
                label: 'Number of Alerts',
                data: data.typeCounts,
                backgroundColor: '#dc3545',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Health Alerts by Type'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createGradeAnalysisChart() {
    const ctx = document.getElementById('grade-analysis-chart');
    if (!ctx) return;

    const data = reportsData.gradeAnalysis;
    
    charts.gradeAnalysis = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.grades,
            datasets: [
                {
                    label: 'Enrollment',
                    data: data.enrollment,
                    backgroundColor: '#007bff',
                    yAxisID: 'y'
                },
                {
                    label: 'Health Compliance (%)',
                    data: data.healthCompliance,
                    backgroundColor: '#28a745',
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Grade Analysis: Enrollment vs Health Compliance'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    max: 100,
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

function updateHealthStatistics() {
    const stats = reportsData.healthStats;
    
    updateStatCard('total-students-stat', stats.totalStudents);
    updateStatCard('complete-records-stat', stats.healthRecordsComplete);
    updateStatCard('incomplete-records-stat', stats.healthRecordsIncomplete);
    updateStatCard('health-alerts-stat', stats.activeHealthAlerts);
    updateStatCard('medications-stat', stats.medicationsTracked);
    updateStatCard('appointments-stat', stats.appointmentsThisMonth);
    updateStatCard('vaccination-compliance-stat', `${stats.vaccinationCompliance}%`);
}

function updateTrendingSummary() {
    const trends = reportsData.medicationUsage.trending;
    const trendsContainer = document.getElementById('trending-summary');
    
    if (!trendsContainer) return;
    
    trendsContainer.innerHTML = Object.keys(trends).map(category => {
        const trend = trends[category];
        const isPositive = trend.change > 0;
        const arrow = isPositive ? '↗' : '↘';
        const colorClass = isPositive ? 'trend-up' : 'trend-down';
        
        return `
            <div class="trend-item">
                <div class="trend-category">${category}</div>
                <div class="trend-value">${trend.current}</div>
                <div class="trend-change ${colorClass}">
                    ${arrow} ${Math.abs(trend.change).toFixed(1)}%
                </div>
            </div>
        `;
    }).join('');
}

function updateStatCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function setupDateRangeFilter() {
    const dateRangeSelect = document.getElementById('date-range');
    const customDateRange = document.getElementById('custom-date-range');
    
    if (dateRangeSelect) {
        dateRangeSelect.innerHTML = `
            <option value="7">Last 7 days</option>
            <option value="30" selected>Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
            <option value="custom">Custom range</option>
        `;
        
        dateRangeSelect.addEventListener('change', function() {
            if (customDateRange) {
                customDateRange.style.display = this.value === 'custom' ? 'block' : 'none';
            }
        });
    }
    
    // Set default dates
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    
    if (startDateInput) startDateInput.value = startDate.toISOString().split('T')[0];
    if (endDateInput) endDateInput.value = endDate.toISOString().split('T')[0];
}

function updateDateRange() {
    const dateRangeSelect = document.getElementById('date-range');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    
    if (!dateRangeSelect || !startDateInput || !endDateInput) return;
    
    const range = dateRangeSelect.value;
    
    if (range !== 'custom') {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - parseInt(range));
        
        startDateInput.value = startDate.toISOString().split('T')[0];
        endDateInput.value = endDate.toISOString().split('T')[0];
    }
}

function refreshAllReports() {
    showLoadingIndicator();
    
    // Simulate data loading
    setTimeout(() => {
        // In a real application, this would fetch fresh data from the server
        updateHealthStatistics();
        updateTrendingSummary();
        
        // Refresh charts
        Object.values(charts).forEach(chart => {
            if (chart && typeof chart.update === 'function') {
                chart.update();
            }
        });
        
        hideLoadingIndicator();
        showNotification('Reports refreshed successfully!', 'success');
    }, 1500);
}

function refreshGradeSpecificReports() {
    const gradeFilter = document.getElementById('grade-filter');
    if (!gradeFilter) return;
    
    const selectedGrade = gradeFilter.value;
    
    // Update vaccination chart for specific grade
    if (charts.vaccination && selectedGrade && reportsData.vaccinationData.byGrade[selectedGrade]) {
        charts.vaccination.data.datasets[0].data = reportsData.vaccinationData.byGrade[selectedGrade];
        charts.vaccination.options.plugins.title.text = `Vaccination Compliance - Grade ${selectedGrade}`;
        charts.vaccination.update();
    } else if (charts.vaccination) {
        // Show all grades data
        charts.vaccination.data.datasets[0].data = reportsData.vaccinationData.compliance;
        charts.vaccination.options.plugins.title.text = 'Vaccination Compliance by Type';
        charts.vaccination.update();
    }
}

function updateChartType(chartId, newType) {
    const chart = charts[chartId];
    if (!chart) return;
    
    // Update chart type
    chart.config.type = newType;
    chart.update();
    
    // Update button states
    document.querySelectorAll(`[data-chart="${chartId}"]`).forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-chart="${chartId}"][data-type="${newType}"]`)?.classList.add('active');
    
    showNotification(`Chart updated to ${newType} view`, 'info');
}

function exportReport(format) {
    showLoadingIndicator();
    
    // Simulate export process
    setTimeout(() => {
        hideLoadingIndicator();
        
        switch (format) {
            case 'pdf':
                generatePDFReport();
                break;
            case 'excel':
                generateExcelReport();
                break;
            case 'csv':
                generateCSVReport();
                break;
        }
        
        showNotification(`Report exported as ${format.toUpperCase()}`, 'success');
    }, 2000);
}

function generatePDFReport() {
    // In a real application, this would generate a PDF
    alert('PDF export functionality would generate a comprehensive PDF report here.');
}

function generateExcelReport() {
    // In a real application, this would generate an Excel file
    alert('Excel export functionality would generate a detailed Excel workbook here.');
}

function generateCSVReport() {
    const csvData = generateReportCSV();
    downloadCSV(csvData, 'health-management-report.csv');
}

function generateReportCSV() {
    const stats = reportsData.healthStats;
    const csvContent = [
        'Health Management System Report',
        `Generated: ${new Date().toLocaleDateString()}`,
        '',
        'Summary Statistics',
        `Total Students,${stats.totalStudents}`,
        `Complete Health Records,${stats.healthRecordsComplete}`,
        `Incomplete Health Records,${stats.healthRecordsIncomplete}`,
        `Active Health Alerts,${stats.activeHealthAlerts}`,
        `Medications Tracked,${stats.medicationsTracked}`,
        `Appointments This Month,${stats.appointmentsThisMonth}`,
        `Vaccination Compliance,${stats.vaccinationCompliance}%`,
        '',
        'Vaccination Data',
        'Vaccine,Compliance Rate',
        ...reportsData.vaccinationData.required.map((vaccine, index) => 
            `${vaccine},${reportsData.vaccinationData.compliance[index]}%`
        ),
        '',
        'Medication Usage',
        'Category,Count',
        ...reportsData.medicationUsage.categories.map((category, index) => 
            `${category},${reportsData.medicationUsage.counts[index]}`
        )
    ].join('\n');
    
    return csvContent;
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

function printReport() {
    window.print();
}

function showLoadingIndicator() {
    let indicator = document.getElementById('loading-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'loading-indicator';
        indicator.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Loading data...</span>
            </div>
        `;
        indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            color: white;
            font-size: 18px;
        `;
        document.body.appendChild(indicator);
    }
    indicator.style.display = 'flex';
}

function hideLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
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

function setupReportTypes() {
    // Initialize report type selector if it exists
    const reportTypeSelect = document.getElementById('report-type');
    if (reportTypeSelect) {
        reportTypeSelect.innerHTML = `
            <option value="overview">Health Overview</option>
            <option value="vaccinations">Vaccination Report</option>
            <option value="medications">Medication Report</option>
            <option value="appointments">Appointment Report</option>
            <option value="alerts">Health Alerts Report</option>
            <option value="compliance">Compliance Report</option>
        `;
        
        reportTypeSelect.addEventListener('change', function() {
            switchReportType(this.value);
        });
    }
}

function switchReportType(reportType) {
    // Hide all report sections
    document.querySelectorAll('.report-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected report section
    const targetSection = document.getElementById(`${reportType}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    showNotification(`Switched to ${reportType} report`, 'info');
}

// Export functions for external use
window.ReportsManager = {
    refreshAllReports,
    exportReport,
    printReport,
    updateChartType,
    switchReportType
};
