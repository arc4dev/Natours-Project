/* eslint-disable */

import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: { email, password },
    });

    if (result.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');

      setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout',
    });

    console.log(result);

    if (result.data.status === 'success') {
      showAlert('success', 'Logged out successfully!');

      setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', 'Error! Try to log out in a while...');
  }
};
