/**
 * Helper function to generate authorization headers for API requests
 * Used for authenticated endpoints that require JWT token
 */
export default function authHeader() {
  console.log('[authHeader] Generating authorization header');
  
  // Try to get user from localStorage
  let user = null;
  const userJson = localStorage.getItem('user');
  
  try {
    if (userJson) {
      user = JSON.parse(userJson);
      console.log('[authHeader] User found in localStorage:', user ? 'Yes' : 'No');
      console.log('[authHeader] User roles:', user?.roles);
    } else {
      console.log('[authHeader] No user in localStorage');
    }
  } catch (e) {
    console.error('[authHeader] Error parsing user from localStorage:', e);
  }
  
  // Also get direct token from localStorage as it might be stored there
  const directToken = localStorage.getItem('token');
  console.log('[authHeader] Direct token available:', directToken ? 'Yes' : 'No');

  let headers = {};

  if (user && user.accessToken) {
    // First check if token is in the user object as accessToken
    console.log('[authHeader] Using token from user.accessToken');
    headers = { 'Authorization': 'Bearer ' + user.accessToken };
  } else if (user && user.token) {
    // Then check if token is in the user object as token
    console.log('[authHeader] Using token from user.token');
    headers = { 'Authorization': 'Bearer ' + user.token };
  } else if (directToken) {
    // Finally check if token is stored directly in localStorage
    console.log('[authHeader] Using direct token from localStorage');
    headers = { 'Authorization': 'Bearer ' + directToken };
  } else {
    console.warn('[authHeader] No authentication token found');
    return {};
  }
  
  console.log('[authHeader] Final headers:', headers);
  return headers;
}
