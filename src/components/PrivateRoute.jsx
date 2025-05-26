import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  const userRole = localStorage.getItem('userRole'); // Lấy vai trò từ localStorage

  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra xem vai trò có trong danh sách allowedRoles không
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Cho phép truy cập nếu qua được các kiểm tra
  return <Outlet />;
};

export default PrivateRoute;