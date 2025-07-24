/**
 * Helper function to generate authorization headers for API requests
 * Used for authenticated endpoints that require JWT token
 */
export default function authHeader() {
  // Try to get user from localStorage
  let user = null;
  const userJson = localStorage.getItem('user');
  
  try {
    if (userJson) {
      user = JSON.parse(userJson);
      } else {
      }
  } catch (e) {
    console.error('[authHeader] Error parsing user from localStorage:', e);
  }
  
  // Also get direct token from localStorage as it might be stored there
  const directToken = localStorage.getItem('token');
  let headers = {};

  if (user && user.accessToken) {
    // First check if token is in the user object as accessToken
    headers = { 'Authorization': 'Bearer ' + user.accessToken };
  } else if (user && user.token) {
    // Then check if token is in the user object as token
    headers = { 'Authorization': 'Bearer ' + user.token };
  } else if (directToken) {
    // Finally check if token is stored directly in localStorage
    headers = { 'Authorization': 'Bearer ' + directToken };
  } else {
    return {};
  }
  
  return headers;
}
