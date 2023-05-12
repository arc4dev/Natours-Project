const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Find wanted tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create a checkout stripe session based on that tour
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `https://www.natours.dev/img/tours/${tour.imageCover}.jpg`,
            ],
          },
        },
        quantity: 1,
      },
    ],
    client_reference_id: tour.id,
    customer_email: req.user.email,
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
  });

  // 3) Send that session to a client as a response (checkout page)
  res.status(200).json({
    status: 'success',
    session,
  });
});

const createBookingCheckout = catchAsync(async session => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total / 100;

  await Booking.create({ tour, user, price });
});

exports.webhookCheck = async (req, res, next) => {
  const signature = req.header['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_CHECKOUT_KEY
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.complete') {
    createBookingCheckout(event.data.object);
  }
};

exports.addNewBooking = factory.addOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.getBookingById = factory.getOne(Booking);
exports.addNewBooking = factory.addOne(Booking);
exports.updateBookingById = factory.updateOne(Booking);
exports.deleteBookingById = factory.deleteOne(Booking);
