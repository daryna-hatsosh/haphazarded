import axios from 'axios';

export const loginWithGoogle = async () => {
  // Implement Google Sign-In logic here
  // This could involve using a library like `react-google-login`
};

export const loginWithEmail = async (email, password) => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { email, password });
  return response.data;
};
