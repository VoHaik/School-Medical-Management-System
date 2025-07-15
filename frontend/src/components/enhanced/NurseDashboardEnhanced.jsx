// Enhanced Nurse Dashboard Component - Refactored Version
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaUserMd, FaCalendarAlt, FaExclamationTriangle, FaCheckCircle, 
  FaChartLine, FaUsers, FaBell, FaClipboardList, FaHeartbeat,
  FaPills, FaStethoscope, FaFileMedicalAlt, FaPlus, FaArrowRight,
  FaUserNurse, FaTasks, FaBandAid, FaThermometerHalf
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { fetchDashboardData, updateDashboardStats } from '../../store/slices/dashboardSlice';
import StatsCard from '../../components/common/StatsCard';
import ActivityCard from '../../components/common/ActivityCard';
import TaskCard from '../../components/common/TaskCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBoundary from '../../components/common/ErrorBoundary';

/**
 * Enhanced Nurse Dashboard Component
 * 
 * Refactored for:
 * - Better performance with memoization
 * - Cleaner component structure
 * - Centralized state management
 * - Error handling
 * - Accessibility improvements
 */
const NurseDashboard = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const {
    stats,
    recentActivity,
    upcomingTasks,
    healthSummary,
    loading,
    error,
    lastUpdated
  } = useSelector(state => state.dashboard);

  // Local state for real-time updates
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch dashboard data on component mount
  useEffect(() => {
    dispatch(fetchDashboardData());
    
    // Set up real-time clock
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    // Set up dashboard data refresh
    const dataRefresh = setInterval(() => {
      dispatch(updateDashboardStats());
    }, 300000); // Refresh every 5 minutes

    return () => {
      clearInterval(timer);
      clearInterval(dataRefresh);
    };
  }, [dispatch]);

  // Memoized calculations for performance
  const dashboardStats = useMemo(() => [
    {
      id: 'appointments',
      title: "Today's Appointments",
      value: stats?.todaysAppointments || 0,
      icon: FaCalendarAlt,
      color: 'blue',
      trend: '+2 from yesterday'
    },
    {
      id: 'screened',
      title: 'Students Screened',
      value: stats?.studentsScreenedToday || 0,
      icon: FaStethoscope,
      color: 'green',
      trend: '+5 from yesterday'
    },
    {
      id: 'medications',
      title: 'Pending Medications',
      value: stats?.pendingMedications || 0,
      icon: FaPills,
      color: 'yellow',
      trend: stats?.pendingMedications > 5 ? 'High priority' : 'Normal'
    },
    {
      id: 'alerts',
      title: 'Active Alerts',
      value: stats?.activeAlerts || 0,
      icon: FaBell,
      color: 'red',
      trend: stats?.activeAlerts > 0 ? 'Requires attention' : 'All clear'
    }
  ], [stats]);

  // Memoized quick actions
  const quickActions = useMemo(() => [
    {
      title: 'Record Medical Event',
      icon: FaFileMedicalAlt,
      link: '/medical/record-event',
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Document new medical incidents'
    },
    {
      title: 'Medication Management',
      icon: FaPills,
      link: '/medical/medication-management',
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Manage student medications'
    },
    {
      title: 'Student Profiles',
      icon: FaUsers,
      link: '/medical/student-management',
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'View and update student health profiles'
    },
    {
      title: 'Emergency Log',
      icon: FaBandAid,
      link: '/medical/emergency-log',
      color: 'bg-red-500 hover:bg-red-600',
      description: 'Access emergency incident records'
    }
  ], []);

  // Activity icon mapping
  const getActivityIcon = useCallback((type) => {
    const iconMap = {
      medication: FaPills,
      checkup: FaStethoscope,
      alert: FaBell,
      followup: FaCalendarAlt,
      emergency: FaBandAid
    };
    const IconComponent = iconMap[type] || FaClipboardList;
    return <IconComponent className={`text-${getActivityColor(type)}-500`} />;
  }, []);

  // Activity color mapping
  const getActivityColor = useCallback((type) => {
    const colorMap = {
      medication: 'blue',
      checkup: 'green',
      alert: 'red',
      followup: 'yellow',
      emergency: 'red'
    };
    return colorMap[type] || 'gray';
  }, []);

  // Priority color mapping
  const getPriorityColor = useCallback((priority) => {
    const colorMap = {
      high: 'border-l-red-500 bg-red-50',
      medium: 'border-l-yellow-500 bg-yellow-50',
      low: 'border-l-green-500 bg-green-50'
    };
    return colorMap[priority] || 'border-l-gray-500 bg-gray-50';
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Loading state
  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" message="Loading nurse dashboard..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">Dashboard Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="mb-6">
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
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <button
                onClick={handleRefresh}
                className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6" aria-label="Dashboard Statistics">
          {dashboardStats.map((stat) => (
            <StatsCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
              loading={loading}
            />
          ))}
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Activity & Quick Actions */}
          <main className="lg:col-span-2 space-y-6">
            
            {/* Recent Activity */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FaChartLine className="mr-2 text-blue-600" />
                  Recent Activity
                </h2>
                <Link 
                  to="/medical/activity-log" 
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  aria-label="View all recent activities"
                >
                  View All <FaArrowRight className="ml-1" />
                </Link>
              </div>
              <div className="space-y-3" role="feed" aria-label="Recent medical activities">
                {recentActivity?.length > 0 ? (
                  recentActivity.map(activity => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      icon={getActivityIcon(activity.type)}
                      priorityColor={getPriorityColor(activity.priority)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaClipboardList className="text-4xl mx-auto mb-2" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaPlus className="mr-2 text-green-600" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`${action.color} text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    title={action.description}
                    aria-label={action.description}
                  >
                    <action.icon className="text-2xl mb-2 mx-auto" />
                    <p className="text-sm font-medium">{action.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            
            {/* Upcoming Tasks */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaTasks className="mr-2 text-purple-600" />
                Upcoming Tasks
              </h2>
              <div className="space-y-3" role="list" aria-label="Upcoming tasks">
                {upcomingTasks?.length > 0 ? (
                  upcomingTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      priorityColor={getPriorityColor(task.priority)}
                    />
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <FaCheckCircle className="text-2xl mx-auto mb-2" />
                    <p className="text-sm">No upcoming tasks</p>
                  </div>
                )}
              </div>
            </section>

            {/* Health Summary */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaHeartbeat className="mr-2 text-red-600" />
                Health Summary
              </h2>
              <div className="space-y-4">
                {Object.entries(healthSummary || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`font-semibold ${
                      key.includes('critical') ? 'text-red-600' :
                      key.includes('followUp') ? 'text-yellow-600' :
                      'text-gray-800'
                    }`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Emergency Contacts */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaThermometerHalf className="mr-2 text-orange-600" />
                Emergency Contacts
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nurse Supervisor</span>
                  <a href="tel:555-0100" className="font-medium text-blue-600 hover:text-blue-800">
                    555-0100
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">School Principal</span>
                  <a href="tel:555-0101" className="font-medium text-blue-600 hover:text-blue-800">
                    555-0101
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Emergency Services</span>
                  <a href="tel:911" className="font-medium text-red-600 hover:text-red-800">
                    911
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Poison Control</span>
                  <a href="tel:1-800-222-1222" className="font-medium text-green-600 hover:text-green-800">
                    1-800-222-1222
                  </a>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(NurseDashboard);
