import Cookies from 'js-cookie';
import axiosInstance from '../common/axiosInstance';

// Login function
export const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  if (response.data.token) {
    // Store the token in cookies (expires in 1 day)
    Cookies.set('token', response.data.token, { expires: 1, secure: true, sameSite: 'Strict' });
  }

  return response.data;
};

export const fetchUserData = async (token) => {
  try {
    const response = await axiosInstance.get('/api/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;  // This should contain the full user data
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Register function
export const register = async (email, password) => {
  const response = await axiosInstance.post('/auth/register', { email, password });
  return response.data;
};

// Logout function (removes token from cookies)
export const logout = () => {
  // Remove JWT token from cookies
  Cookies.remove('token');

  // Optionally, navigate to login page (using a method like useNavigate())
};
