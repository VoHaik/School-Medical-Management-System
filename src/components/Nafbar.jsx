import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // File CSS tùy chọn cho styling

const Navbar = ({ userRole, onLogout }) => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        {/* Liên kết cố định cho tất cả người dùng */}
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>

        {/* Liên kết dựa trên vai trò */}
        {userRole && (
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
        )}
        {['Parent', 'Student'].includes(userRole) && (
          <li className="nav-item">
            <Link to="/student-health-profile" className="nav-link">Student Health Profile</Link>
          </li>
        )}
        {['Parent', 'MedicalStaff'].includes(userRole) && (
          <li className="nav-item">
            <Link to="/medication-submission" className="nav-link">Medication Submission</Link>
          </li>
        )}
        {['MedicalStaff'].includes(userRole) && (
          <li className="nav-item">
            <Link to="/medical-events" className="nav-link">Medical Events</Link>
          </li>
        )}
        {['MedicalStaff', 'Admin'].includes(userRole) && (
          <li className="nav-item">
            <Link to="/medical-supplies" className="nav-link">Medical Supplies</Link>
          </li>
        )}
        {['MedicalStaff', 'Parent'].includes(userRole) && (
          <li className="nav-item">
            <Link to="/vaccination-campaigns" className="nav-link">Vaccination Campaigns</Link>
          </li>
        )}
        {['MedicalStaff', 'Parent'].includes(userRole) && (
          <li className="nav-item">
            <Link to="/health-check-campaigns" className="nav-link">Health Check Campaigns</Link>
          </li>
        )}
        {['MedicalStaff', 'Parent'].includes(userRole) && (
          <li className="nav-item">
            <Link to="/appointments" className="nav-link">Appointments</Link>
          </li>
        )}
        {['Admin'].includes(userRole) && (
          <li className="nav-item">
            <Link to="/user-management" className="nav-link">User Management</Link>
          </li>
        )}
        {['Admin', 'MedicalStaff'].includes(userRole) && (
          <li className="nav-item">
            <Link to="/posts" className="nav-link">Posts</Link>
          </li>
        )}

        {/* Nút logout hoặc liên kết đăng nhập */}
        {userRole ? (
          <li className="nav-item">
            <button onClick={onLogout} className="nav-link logout-btn">Logout</button>
          </li>
        ) : (
          <li className="nav-item">
            <Link to="/login" className="nav-link">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;