const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

const schemaOptions = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either easy, medium or hard',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating must be below 5'],
      // whenever value changes this function runs
      set: value => parseFloat(value.toFixed(1)),
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: function (value) {
        return value < this.price;
      },
      message: 'Discount must be less than the tour price',
    },
    slug: String,
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true,
    },
    description: String,
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image cover'],
    },
    images: [String],
    startDates: [Date],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      description: String,
      address: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  schemaOptions
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ startLocation: '2dsphere' });

// ----VIRTUALS
// tourSchema.virtual('durationInWeek').get(function () {
//   return this.duration / 7;
// });

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// ----DOCUMENT MIDDLEWARE
//ALWAYS POINTS TO THE CURRENT DOCUMENT
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

// IN QUERY MIDDLEWARE THIS AWLAYS POINTS TO THE CURRENT QUERY
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides', // fill the ref as a actual objs
    select: '-__v -passwordChangedAt', // exclude these
  });

  next();
});

// embedding
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));

//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);

//   next();
// });
// /^find/ - every method starts with find

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
