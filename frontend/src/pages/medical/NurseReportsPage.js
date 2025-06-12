import React, { useState } from 'react';

const NurseReportsPage = () => {
  const [selectedReportType, setSelectedReportType] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { id: 'medical-events', name: 'Medical Event Summary', description: 'Summary of all medical incidents and treatments' },
    { id: 'immunization', name: 'Immunization Coverage', description: 'Vaccination status and coverage rates by grade' },
    { id: 'checkups', name: 'Periodic Checkup Summary', description: 'Health screening results and abnormal findings' },
    { id: 'inventory', name: 'Inventory Usage Report', description: 'Medical supplies consumption and stock levels' },
    { id: 'consent', name: 'Consent Status Report', description: 'Parent consent forms status for medical procedures' },
    { id: 'attendance', name: 'Health-Related Attendance', description: 'Student absences due to health issues' },
    { id: 'chronic-conditions', name: 'Chronic Conditions Report', description: 'Students with ongoing health conditions' },
    { id: 'emergency-contacts', name: 'Emergency Contacts Audit', description: 'Verification of emergency contact information' }
  ];

  const generateReport = async () => {
    if (!selectedReportType) {
      alert('Please select a report type');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockData = generateMockData(selectedReportType);
      setReportData(mockData);
      setIsGenerating(false);
    }, 1500);
  };

  const generateMockData = (reportType) => {
    switch (reportType) {
      case 'medical-events':
        return {
          title: 'Medical Event Summary Report',
          period: `${dateRange.start || '2025-01-01'} to ${dateRange.end || '2025-01-31'}`,
          summary: {
            totalEvents: 45,
            byType: {
              'Minor Injury': 18,
              'Illness': 15,
              'Medication Administration': 8,
              'Emergency': 4
            },
            bySeverity: {
              'Low': 32,
              'Medium': 10,
              'High': 3
            },
            byGrade: {
              'Grade 1': 8,
              'Grade 2': 6,
              'Grade 3': 9,
              'Grade 4': 7,
              'Grade 5': 8,
              'Grade 6': 7
            }
          },
          details: [
            { date: '2025-01-15', student: 'John Smith', grade: '5A', type: 'Minor Injury', description: 'Scraped knee during recess', severity: 'Low' },
            { date: '2025-01-18', student: 'Emma Johnson', grade: '4B', type: 'Illness', description: 'Fever and headache', severity: 'Medium' },
            { date: '2025-01-22', student: 'Michael Brown', grade: '6A', type: 'Emergency', description: 'Allergic reaction', severity: 'High' }
          ]
        };

      case 'immunization':
        return {
          title: 'Immunization Coverage Report',
          period: 'Current Academic Year 2024-2025',
          summary: {
            totalStudents: 450,
            fullyVaccinated: 398,
            partiallyVaccinated: 35,
            notVaccinated: 17,
            coverageRate: '88.4%'
          },
          byGrade: [
            { grade: 'Grade 1', total: 75, vaccinated: 68, coverage: '90.7%' },
            { grade: 'Grade 2', total: 72, vaccinated: 65, coverage: '90.3%' },
            { grade: 'Grade 3', total: 78, vaccinated: 69, coverage: '88.5%' },
            { grade: 'Grade 4', total: 76, vaccinated: 66, coverage: '86.8%' },
            { grade: 'Grade 5', total: 74, vaccinated: 65, coverage: '87.8%' },
            { grade: 'Grade 6', total: 75, vaccinated: 65, coverage: '86.7%' }
          ],
          campaigns: [
            { name: 'Flu Vaccination 2024', coverage: '92%', completed: true },
            { name: 'HPV Vaccination (Grades 5-6)', coverage: '85%', completed: true },
            { name: 'Flu Vaccination 2025', coverage: '45%', completed: false }
          ]
        };

      case 'checkups':
        return {
          title: 'Periodic Health Checkup Summary',
          period: 'Annual Checkup 2024-2025',
          summary: {
            totalStudents: 450,
            completed: 380,
            pending: 70,
            completionRate: '84.4%',
            abnormalFindings: 23
          },
          findings: {
            'Vision Problems': 12,
            'Hearing Issues': 4,
            'Growth Concerns': 3,
            'Dental Issues': 8,
            'Blood Pressure': 2,
            'Other': 4
          },
          followUpRequired: [
            { student: 'Sarah Wilson', grade: '3B', issue: 'Vision screening failed', status: 'Referred to optometrist' },
            { student: 'David Kim', grade: '4A', issue: 'Growth below 5th percentile', status: 'Referred to pediatrician' },
            { student: 'Lisa Chen', grade: '5C', issue: 'Hearing test abnormal', status: 'Awaiting specialist appointment' }
          ]
        };

      case 'inventory':
        return {
          title: 'Medical Inventory Usage Report',
          period: `${dateRange.start || '2025-01-01'} to ${dateRange.end || '2025-01-31'}`,
          summary: {
            totalItems: 45,
            lowStock: 8,
            expiring: 3,
            totalValue: '$2,450'
          },
          usage: [
            { item: 'Bandages (Assorted)', used: 125, remaining: 75, reorderLevel: 50, status: 'Reorder Soon' },
            { item: 'Antiseptic Wipes', used: 89, remaining: 211, reorderLevel: 100, status: 'Good' },
            { item: 'Thermometer Covers', used: 56, remaining: 144, reorderLevel: 50, status: 'Good' },
            { item: 'Pain Relief Tablets', used: 24, remaining: 6, reorderLevel: 20, status: 'Critical' },
            { item: 'Ice Packs', used: 15, remaining: 25, reorderLevel: 10, status: 'Good' }
          ],
          expiring: [
            { item: 'Antihistamine Tablets', expiry: '2025-03-15', quantity: 20 },
            { item: 'Cough Syrup', expiry: '2025-04-20', quantity: 3 },
            { item: 'First Aid Ointment', expiry: '2025-05-10', quantity: 5 }
          ]
        };

      default:
        return {
          title: 'Report Generated',
          message: 'This is a placeholder report. Integration with backend API required.'
        };
    }
  };

  const exportReport = (format) => {
    if (!reportData) {
      alert('Please generate a report first');
      return;
    }

    // Mock export functionality
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nurse Reports & Analytics</h1>
        <p className="text-gray-600">Generate comprehensive reports on student health data, medical events, and inventory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 shadow rounded-lg sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Report Configuration</h2>
            
            <div className="space-y-4">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  value={selectedReportType}
                  onChange={(e) => setSelectedReportType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Report Type</option>
                  {reportTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                {selectedReportType && (
                  <p className="text-sm text-gray-600 mt-1">
                    {reportTypes.find(t => t.id === selectedReportType)?.description}
                  </p>
                )}
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="p-2 border border-gray-300 rounded-md"
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="p-2 border border-gray-300 rounded-md"
                    placeholder="End Date"
                  />
                </div>
              </div>

              {/* Grade Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade Filter</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Grades</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                  <option value="5">Grade 5</option>
                  <option value="6">Grade 6</option>
                </select>
              </div>

              {/* Class Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class Filter</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Classes</option>
                  <option value="A">Class A</option>
                  <option value="B">Class B</option>
                  <option value="C">Class C</option>
                </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className={`w-full py-3 px-4 rounded-md font-medium ${
                  isGenerating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white transition-colors`}
              >
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </button>

              {/* Export Options */}
              {reportData && (
                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Export Options</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => exportReport('pdf')}
                      className="py-2 px-3 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Export PDF
                    </button>
                    <button
                      onClick={() => exportReport('excel')}
                      className="py-2 px-3 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Export Excel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Report Display */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            {!reportData ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Generated</h3>
                <p className="text-gray-600">Select report parameters and click "Generate Report" to view results</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{reportData.title}</h2>
                  {reportData.period && (
                    <p className="text-gray-600">Period: {reportData.period}</p>
                  )}
                </div>

                {/* Medical Events Report */}
                {selectedReportType === 'medical-events' && (
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{reportData.summary.totalEvents}</div>
                        <div className="text-sm text-gray-600">Total Events</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{reportData.summary.bySeverity.Low}</div>
                        <div className="text-sm text-gray-600">Low Severity</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{reportData.summary.bySeverity.Medium}</div>
                        <div className="text-sm text-gray-600">Medium Severity</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{reportData.summary.bySeverity.High}</div>
                        <div className="text-sm text-gray-600">High Severity</div>
                      </div>
                    </div>

                    {/* Events by Type */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Events by Type</h3>
                      <div className="space-y-2">
                        {Object.entries(reportData.summary.byType).map(([type, count]) => (
                          <div key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>{type}</span>
                            <span className="font-semibold">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Events */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Recent Events</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {reportData.details.map((event, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm">{event.date}</td>
                                <td className="px-4 py-2 text-sm font-medium">{event.student}</td>
                                <td className="px-4 py-2 text-sm">{event.type}</td>
                                <td className="px-4 py-2 text-sm">{event.description}</td>
                                <td className="px-4 py-2 text-sm">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    event.severity === 'High' ? 'bg-red-100 text-red-800' :
                                    event.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {event.severity}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Immunization Report */}
                {selectedReportType === 'immunization' && (
                  <div className="space-y-6">
                    {/* Overall Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{reportData.summary.totalStudents}</div>
                        <div className="text-sm text-gray-600">Total Students</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{reportData.summary.fullyVaccinated}</div>
                        <div className="text-sm text-gray-600">Fully Vaccinated</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{reportData.summary.partiallyVaccinated}</div>
                        <div className="text-sm text-gray-600">Partially Vaccinated</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{reportData.summary.coverageRate}</div>
                        <div className="text-sm text-gray-600">Coverage Rate</div>
                      </div>
                    </div>

                    {/* Coverage by Grade */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Coverage by Grade</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Students</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vaccinated</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Coverage Rate</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {reportData.byGrade.map((grade, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm font-medium">{grade.grade}</td>
                                <td className="px-4 py-2 text-sm">{grade.total}</td>
                                <td className="px-4 py-2 text-sm">{grade.vaccinated}</td>
                                <td className="px-4 py-2 text-sm">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    parseFloat(grade.coverage) >= 90 ? 'bg-green-100 text-green-800' :
                                    parseFloat(grade.coverage) >= 80 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {grade.coverage}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Checkups Report */}
                {selectedReportType === 'checkups' && (
                  <div className="space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{reportData.summary.totalStudents}</div>
                        <div className="text-sm text-gray-600">Total Students</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{reportData.summary.completed}</div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{reportData.summary.pending}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{reportData.summary.abnormalFindings}</div>
                        <div className="text-sm text-gray-600">Abnormal Findings</div>
                      </div>
                    </div>

                    {/* Findings Breakdown */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Abnormal Findings</h3>
                      <div className="space-y-2">
                        {Object.entries(reportData.findings).map(([finding, count]) => (
                          <div key={finding} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>{finding}</span>
                            <span className="font-semibold">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Follow-up Required */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Follow-up Required</h3>
                      <div className="space-y-2">
                        {reportData.followUpRequired.map((item, index) => (
                          <div key={index} className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                            <div className="font-medium">{item.student} - {item.grade}</div>
                            <div className="text-sm text-gray-600">{item.issue}</div>
                            <div className="text-sm text-blue-600 mt-1">{item.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Inventory Report */}
                {selectedReportType === 'inventory' && (
                  <div className="space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{reportData.summary.totalItems}</div>
                        <div className="text-sm text-gray-600">Total Items</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{reportData.summary.lowStock}</div>
                        <div className="text-sm text-gray-600">Low Stock</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{reportData.summary.expiring}</div>
                        <div className="text-sm text-gray-600">Expiring Soon</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{reportData.summary.totalValue}</div>
                        <div className="text-sm text-gray-600">Total Value</div>
                      </div>
                    </div>

                    {/* Usage Table */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Inventory Usage</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Used</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {reportData.usage.map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm font-medium">{item.item}</td>
                                <td className="px-4 py-2 text-sm">{item.used}</td>
                                <td className="px-4 py-2 text-sm">{item.remaining}</td>
                                <td className="px-4 py-2 text-sm">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    item.status === 'Critical' ? 'bg-red-100 text-red-800' :
                                    item.status === 'Reorder Soon' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Expiring Items */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Expiring Items</h3>
                      <div className="space-y-2">
                        {reportData.expiring.map((item, index) => (
                          <div key={index} className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                            <div className="flex justify-between">
                              <div>
                                <div className="font-medium">{item.item}</div>
                                <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-red-600">Expires: {item.expiry}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Generic Report */}
                {!['medical-events', 'immunization', 'checkups', 'inventory'].includes(selectedReportType) && (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{reportData.title}</h3>
                    <p className="text-gray-600">{reportData.message}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseReportsPage;
