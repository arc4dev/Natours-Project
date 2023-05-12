const sharp = require('sharp');
const catchAsync = require('./catchAsync');

/* eslint-disable */

module.exports = resizePhoto = catchAsync(
  async (buffer, outputPath, dimensions = [500, 500], format = 'jpeg') =>
    await sharp(buffer)
      .resize(...dimensions)
      .toFormat(format)
      .toFile(outputPath)
);
