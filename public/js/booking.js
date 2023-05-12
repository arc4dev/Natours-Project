/* eslint-disable */

import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51N6HIVDk98Av3NqoQ96WSALP7U5WhUpyL4KL2hXdGOjdOiZ5zZcH3mZ9oHl4zxXorShqgCUEYYBGZEK2JhP5Jggj00rX8x2LMi'
);

exports.bookTour = async id => {
  try {
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${id}`
    );

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
