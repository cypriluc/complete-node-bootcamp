class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }; // create a shallow copy of req.query object - since ES6 destructuring
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // create a copy of all the fields that should be excluded
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // match word and replace - use regular expression wrap with '\b' for only the same word - not a part of a word, 'g' - use multiple times

    this.query = this.query.find(JSON.parse(queryStr));

    return this; // return entire object
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); // get array of all sorting field names and put them together as string, but separated with space
      this.query = this.query.sort(sortBy); // ascending order if sort=+price in query, descending if sort=-price
    } else {
      this.query = this.query.sort('_id');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');

      this.query = this.query.select(fields); // projecting - select fields to be sended in response
    } else {
      this.query = this.query.select('-__v'); // starting with "-" -> excluding __v field from the response
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; // convert to number and set default
    const limit = this.queryString.limit * 1 || 100; // convert to number and set default
    const skip = (page - 1) * limit; // number of results to skip coming before requesting ones

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
