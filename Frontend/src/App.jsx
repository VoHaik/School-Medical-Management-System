import { useState } from 'react';
import './App.css';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // Tạm thời bỏ qua xác thực thật
    if (email && password && role) {
      localStorage.setItem('role', role);
      setLoggedIn(true);
      alert(`Đăng nhập thành công với vai trò: ${role}`);
    } else {
      alert('Vui lòng nhập đầy đủ thông tin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    setLoggedIn(false);
    setEmail('');
    setPassword('');
    setRole('');
  };

  return (
    <div className="login-page">
      <div className="background-image" />
      <div className="overlay" />

      {!loggedIn ? (
        <form className="login-card" onSubmit={handleLogin}>
          <h2>Đăng nhập</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">-- Chọn vai trò --</option>
            <option value="parent">Phụ huynh</option>
            <option value="student">Học sinh</option>
            <option value="nurse">Nhân viên y tế</option>
            <option value="admin">Quản trị viên</option>
          </select> */}

          <button type="submit">Đăng nhập</button>
        </form>
      ) : (
        <div className="login-card">
          <h2>Chào mừng, vai trò: {role}</h2>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      )}
    </div>
  );
};

export default App;
