import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({
    notifications: [],
    upcomingEvents: [],
    quickStats: {},
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${user?.fullName || user?.username}!`;
  };  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'PARENT':
        // Redirect parent users to the dedicated parent dashboard
        window.location.href = '/parent/dashboard';
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Redirecting to Parent Dashboard...</p>
          </div>
        );

      case 'MEDICAL_STAFF':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Medical Events"
              description="Record and manage medical incidents"
              icon="fas fa-ambulance"
              link="/medical-events"
              color="red"
            />
            <DashboardCard
              title="Medication Management"
              description="Manage student medications and supplies"
              icon="fas fa-capsules"
              link="/medication-management"
              color="blue"
            />
            <DashboardCard
              title="Vaccination Management"
              description="Organize vaccination campaigns"
              icon="fas fa-syringe"
              link="/vaccination-management"
              color="green"
            />
            <DashboardCard
              title="Health Checkups"
              description="Conduct routine health examinations"
              icon="fas fa-stethoscope"
              link="/health-checkups"
              color="purple"
            />
            <DashboardCard
              title="Student Management"
              description="View and manage student health profiles"
              icon="fas fa-users"
              link="/student-management"
              color="orange"
            />
            <DashboardCard
              title="Reports"
              description="Generate health reports and statistics"
              icon="fas fa-chart-bar"
              link="/reports"
              color="indigo"
            />
          </div>
        );

      case 'ADMIN':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Admin Dashboard"
              description="System overview and user management"
              icon="fas fa-tachometer-alt"
              link="/admin/dashboard"
              color="blue"
            />
            <DashboardCard
              title="User Management"
              description="Manage system users and permissions"
              icon="fas fa-users-cog"
              link="/admin/user-management"
              color="blue"
            />
            <DashboardCard
              title="Analytics & Reports"
              description="View comprehensive system analytics"
              icon="fas fa-chart-line"
              link="/admin/analytics-reports"
              color="green"
            />
            <DashboardCard
              title="Medical Events Overview"
              description="Monitor all medical events"
              icon="fas fa-ambulance"
              link="/medical-events"
              color="red"
            />
            <DashboardCard
              title="Event Management"
              description="Manage health checkup and vaccination events"
              icon="fas fa-calendar-check"
              link="/admin/health-programs"
              color="purple"
            />
            <DashboardCard
              title="System Configuration"
              description="Configure system settings"
              icon="fas fa-cogs"
              link="/admin/system-config"
              color="gray"
            />
          </div>
        );

      case 'STUDENT':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Health Profile"
              description="View your health information"
              icon="fas fa-heart"
              link="/health-profile"
              color="red"
            />
            <DashboardCard
              title="Medical History"
              description="Access your medical records"
              icon="fas fa-file-medical"
              link="/medical-history"
              color="blue"
            />
            <DashboardCard
              title="Vaccination Record"
              description="View vaccination history"
              icon="fas fa-syringe"
              link="/vaccination-record"
              color="green"
            />
            <DashboardCard
              title="Health Blog"
              description="Read health tips and articles"
              icon="fas fa-blog"
              link="/blog"
              color="purple"
            />
            <DashboardCard
              title="Upcoming Checkups"
              description="View scheduled health checkups"
              icon="fas fa-calendar"
              link="/upcoming-checkups"
              color="orange"
            />
            <DashboardCard
              title="Health Resources"
              description="Access health education materials"
              icon="fas fa-book-medical"
              link="/health-resources"
              color="indigo"
            />
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Please contact administrator for role assignment.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getWelcomeMessage()}
          </h1>
          <p className="text-gray-600">
            Welcome to the School Health Management System
          </p>
        </div>

        {/* Quick Stats */}
        {Object.keys(dashboardData.quickStats).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Object.entries(dashboardData.quickStats).map(([key, value]) => (
              <div key={key} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <i className="fas fa-chart-line text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Role-specific Content */}
        {getRoleSpecificContent()}

        {/* Recent Activities and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Activities */}
          {dashboardData.recentActivities?.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-3">
                {dashboardData.recentActivities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <i className="fas fa-clock text-gray-500 text-xs"></i>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications */}
          {dashboardData.notifications?.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Notifications</h3>
              <div className="space-y-3">
                {dashboardData.notifications.slice(0, 5).map((notification, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                        <i className="fas fa-bell text-yellow-600 text-xs"></i>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, description, icon, link, color, badge }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    red: 'text-red-600 bg-red-100',
    orange: 'text-orange-600 bg-orange-100',
    indigo: 'text-indigo-600 bg-indigo-100',
    gray: 'text-gray-600 bg-gray-100'
  };

  return (
    <Link
      to={link}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 p-6 block relative"
    >
      {badge > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
          {badge}
        </div>
      )}
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <i className={`${icon} text-xl`}></i>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  );
};

export default Dashboard;
