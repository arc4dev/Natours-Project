const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'You must provide a name!'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'You must provide an email!'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'guide', 'lead-guide', 'admin'],
      message: 'The role must be either user, guide, lead-guide or admin',
    },
    default: 'user',
  },
  // reviews: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'Review',
  //   },
  // ],
  photo: {
    type: String,
    trim: true,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: [true, 'You must provide a password!'],
    trim: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'You must confirm your password!'],
    trim: true,
    validate: {
      validator: function (el) {
        return this.password === el;
      },
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpiration: Date,
});

userSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'user',
});

userSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'user',
});

// userSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'reviews',
//     select: 'tour review rating',
//   });

//   next();
// });

// CUSTOM VALIDATOR IN SCHEMAS WORKS ONLY
// IN MODEL.CREATE() AND SAVE()

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

// If password changes set passwordChangedAt to that moment
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.isCorrectPassword = async function (
  passwordToCheck,
  userPassword
) {
  return await bcrypt.compare(passwordToCheck, userPassword);
};

userSchema.methods.changedPasswordAfter = JWTTimestamp => {
  if (this.passwordChangedAt) {
    return JWTTimestamp < this.passwordChangedAt.getTime() / 1000;
  }

  //False means user did not change password
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // 1) Create an original reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // 2) Encrypt this token to save to the database
  //prettier-ignore
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3) Set a {min} minutes token expiration
  const min = 10;
  this.passwordResetTokenExpiration = Date.now() + min * 60 * 1000;

  // 4) return the original token
  return resetToken;
};

// userSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'reviews',
//     select: 'review rating',
//   });

//   next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
