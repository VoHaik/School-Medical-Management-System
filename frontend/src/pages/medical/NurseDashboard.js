import React, { useState, useEffect } from 'react';
import { 
  FaUserMd, FaCalendarAlt, FaExclamationTriangle, FaCheckCircle, 
  FaChartLine, FaUsers, FaBell, FaClipboardList, FaHeartbeat,
  FaPills, FaStethoscope, FaFileMedicalAlt, FaPlus, FaArrowRight,
  FaUserNurse, FaTasks, FaBandAid, FaThermometerHalf
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NurseDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    todaysAppointments: 8,
    pendingMedications: 3,
    activeAlerts: 2,
    studentsScreenedToday: 12,
    totalStudentsUnderCare: 45,
    criticalCases: 1,
    followUpsRequired: 7,
    vaccinesAdministered: 15
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'medication',
      message: 'Administered insulin to James Wilson',
      time: '10:30 AM',
      status: 'completed',
      priority: 'high'
    },
    {
      id: 2,
      type: 'checkup',
      message: 'Completed vision screening for Grade 9A',
      time: '9:45 AM',
      status: 'completed',
      priority: 'normal'
    },
    {
      id: 3,
      type: 'alert',
      message: 'New allergy alert for Isabella Martinez',
      time: '9:15 AM',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 4,
      type: 'followup',
      message: 'Schedule follow-up for David Rodriguez knee injury',
      time: '8:30 AM',
      status: 'pending',
      priority: 'medium'
    }
  ]);

  const [upcomingTasks, setUpcomingTasks] = useState([
    {
      id: 1,
      task: 'Administer EpiPen training to Grade 7 teachers',
      time: '2:00 PM',
      type: 'training',
      priority: 'high'
    },
    {
      id: 2,
      task: 'Complete health records review for new students',
      time: '3:30 PM',
      type: 'paperwork',
      priority: 'medium'
    },
    {
      id: 3,
      task: 'Monthly medication inventory check',
      time: '4:00 PM',
      type: 'inventory',
      priority: 'low'
    }
  ]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'medication': return <FaPills className="text-blue-500" />;
      case 'checkup': return <FaStethoscope className="text-green-500" />;
      case 'alert': return <FaBell className="text-red-500" />;
      case 'followup': return <FaCalendarAlt className="text-yellow-500" />;
      default: return <FaClipboardList className="text-gray-500" />;
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'training': return <FaUserMd className="text-purple-500" />;
      case 'paperwork': return <FaFileMedicalAlt className="text-blue-500" />;
      case 'inventory': return <FaClipboardList className="text-green-500" />;
      default: return <FaTasks className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const quickActions = [
    {
      title: 'New Health Record',
      icon: <FaFileMedicalAlt />,
      link: '/medical/health-checkups',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Medication Request',
      icon: <FaPills />,
      link: '/medical/medication-requests',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Student Profile',
      icon: <FaUsers />,
      link: '/medical/student-management',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Emergency Log',
      icon: <FaBandAid />,
      link: '/medical/emergency-log',
      color: 'bg-red-500 hover:bg-red-600'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaUserNurse className="mr-3 text-blue-600" />
              Nurse Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening in your medical center today.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-lg font-semibold text-gray-800">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.todaysAppointments}</p>
              <p className="text-sm text-gray-600">Today's Appointments</p>
            </div>
            <FaCalendarAlt className="text-3xl text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.studentsScreenedToday}</p>
              <p className="text-sm text-gray-600">Students Screened</p>
            </div>
            <FaStethoscope className="text-3xl text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.pendingMedications}</p>
              <p className="text-sm text-gray-600">Pending Medications</p>
            </div>
            <FaPills className="text-3xl text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.activeAlerts}</p>
              <p className="text-sm text-gray-600">Active Alerts</p>
            </div>
            <FaBell className="text-3xl text-red-500" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaChartLine className="mr-2 text-blue-600" />
                Recent Activity
              </h2>
              <Link to="/medical/activity-log" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                View All <FaArrowRight className="ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivity.map(activity => (
                <div key={activity.id} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(activity.priority)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getActivityIcon(activity.type)}
                      <div>
                        <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaPlus className="mr-2 text-green-600" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={`${action.color} text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <p className="text-sm font-medium">{action.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Upcoming Tasks */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaTasks className="mr-2 text-purple-600" />
              Upcoming Tasks
            </h2>
            <div className="space-y-3">
              {upcomingTasks.map(task => (
                <div key={task.id} className={`p-3 rounded-lg border-l-4 ${getPriorityColor(task.priority)}`}>
                  <div className="flex items-start space-x-3">
                    {getTaskIcon(task.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{task.task}</p>
                      <p className="text-xs text-gray-500 mt-1">{task.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaHeartbeat className="mr-2 text-red-600" />
              Health Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Students Under Care</span>
                <span className="font-semibold text-gray-800">{dashboardData.totalStudentsUnderCare}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Follow-ups Required</span>
                <span className="font-semibold text-yellow-600">{dashboardData.followUpsRequired}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Critical Cases</span>
                <span className="font-semibold text-red-600">{dashboardData.criticalCases}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Vaccines Given (Month)</span>
                <span className="font-semibold text-green-600">{dashboardData.vaccinesAdministered}</span>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaThermometerHalf className="mr-2 text-orange-600" />
              Emergency Contacts
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nurse Supervisor</span>
                <span className="font-medium text-blue-600">555-0100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">School Principal</span>
                <span className="font-medium text-blue-600">555-0101</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Emergency Services</span>
                <span className="font-medium text-red-600">911</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Poison Control</span>
                <span className="font-medium text-green-600">1-800-222-1222</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
