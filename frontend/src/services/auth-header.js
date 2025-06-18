/**
 * Helper function to generate authorization headers for API requests
 * Used for authenticated endpoints that require JWT token
 */
export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    // For Spring Boot backend with JWT
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
}
