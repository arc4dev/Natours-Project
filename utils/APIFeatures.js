class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // FILTERING
    const queryObj = { ...this.queryString };
    const excluded = ['page', 'sort', 'limit', 'fields'];
    excluded.forEach((el) => delete queryObj[el]);

    // ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let querySort = this.queryString.sort;
      querySort = querySort.replace(/,/g, ' ');

      this.query = this.query.sort(querySort);
    } else {
      this.query = this.query.sort('price');
    }

    return this;
  }

  select() {
    if (this.queryString.fields) {
      let queryField = this.queryString.fields;
      queryField = queryField.replace(/,/g, ' ');

      this.query = this.query.select(queryField);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
