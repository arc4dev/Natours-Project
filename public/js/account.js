/* eslint-disable  */

import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  //type = update-password, reset-password
  try {
    const url =
      type === 'update-password'
        ? 'http://localhost:3000/api/v1/users/updatePassword'
        : 'http://localhost:3000/api/v1/users/updateMe';

    const result = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (result.data.status === 'success') {
      showAlert('success', 'Settings saved successfully!');

      setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', 'Something went wrong');
  }
};

export const forgotPassword = async email => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/forgotPassword',
      data: { email },
    });

    if (result.data.status === 'success') {
      showAlert(
        'success',
        'Your password reset token sent successfully! Check your email.'
      );

      setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', 'Something went wrong');
  }
};
