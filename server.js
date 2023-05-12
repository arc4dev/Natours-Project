// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

require('dotenv').config({
  path: `./config-${process.env.NODE_ENV}.env`,
});

const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connection successfull!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}... --${process.env.NODE_ENV}`);
});

// Handling promise rejections
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
