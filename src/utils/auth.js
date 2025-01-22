import Cookies from 'js-cookie';

export const setUserData = data => {
  Cookies.set('authToken', data.authToken);
  Cookies.set('userId', data.userId);
  Cookies.set('userFirstname', data.firstname);
  Cookies.set('userLastname', data.lastname);
  Cookies.set('userEmail', data.email);
  Cookies.set('accountStatus', data.accountStatus || 'Private');
  Cookies.set('isAdmin', data.isAdmin || false);
};

export const clearUserData = () => {
  Cookies.remove('authToken');
  Cookies.remove('userId');
  Cookies.remove('userFirstname');
  Cookies.remove('userLastname');
  Cookies.remove('userEmail');
  Cookies.remove('accountStatus');
  Cookies.remove('isAdmin');
};

export const isUserAdmin = () => {
  return Cookies.get('isAdmin') === 'true';
};

export const isUserLoggedIn = () => {
  return !!Cookies.get('authToken');
};

export const getUserData = () => {
  return {
    userId: Cookies.get('userId'),
    firstname: Cookies.get('userFirstname'),
    lastname: Cookies.get('userLastname'),
    email: Cookies.get('userEmail'),
    accountStatus: Cookies.get('accountStatus'),
    isAdmin: isUserAdmin()
  };
};
