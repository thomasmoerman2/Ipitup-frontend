import Cookies from 'js-cookie';

// Set individual cookies with proper configuration
export const setAuthCookie = token => {
  try {
    Cookies.set('authToken', token, { path: '/', sameSite: 'Lax' });
    return true;
  } catch (error) {
    console.error('Error setting auth cookie:', error);
    return false;
  }
};

export const setUserCookies = userData => {
  try {
    if (userData.userId) Cookies.set('userId', userData.userId, { path: '/', sameSite: 'Lax' });
    if (userData.firstname) Cookies.set('userFirstname', userData.firstname, { path: '/', sameSite: 'Lax' });
    if (userData.lastname) Cookies.set('userLastname', userData.lastname, { path: '/', sameSite: 'Lax' });
    if (userData.email) Cookies.set('userEmail', userData.email, { path: '/', sameSite: 'Lax' });
    if (userData.accountStatus) Cookies.set('accountStatus', userData.accountStatus, { path: '/', sameSite: 'Lax' });
    if (userData.isAdmin !== undefined) {
      Cookies.set('isAdmin', userData.isAdmin === true ? 'true' : 'false', { path: '/', sameSite: 'Lax' });
    }
    return true;
  } catch (error) {
    console.error('Error setting user cookies:', error);
    return false;
  }
};

// Get cookie values with proper error handling
export const getAuthToken = () => {
  try {
    return Cookies.get('authToken') || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const getUserData = () => {
  try {
    return {
      userId: Cookies.get('userId'),
      firstname: Cookies.get('userFirstname'),
      lastname: Cookies.get('userLastname'),
      email: Cookies.get('userEmail'),
      accountStatus: Cookies.get('accountStatus'),
      isAdmin: Cookies.get('isAdmin') === 'true'
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    return {};
  }
};

// Clear all auth related cookies
export const clearAuthCookies = () => {
  try {
    const cookies = ['authToken', 'userId', 'userFirstname', 'userLastname', 'userEmail', 'accountStatus', 'isAdmin'];
    cookies.forEach(cookie => {
      Cookies.remove(cookie, { path: '/' });
    });
    return true;
  } catch (error) {
    console.error('Error clearing auth cookies:', error);
    return false;
  }
};

// Auth state checks
export const isAuthenticated = () => {
  try {
    return !!getAuthToken();
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const isAdmin = () => {
  try {
    return Cookies.get('isAdmin') === 'true';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
