import type { Query } from "mongoose";

type QueryString = {
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  keyword?: string;
  offset?: string;
  [key: string]: unknown;
};

class APIFeatures<T> {
  mongooseQuery: Query<T[], T>;
  expressQueryString: QueryString;

  constructor(mongooseQuery: Query<T[], T>, expressQueryString: QueryString) {
    this.mongooseQuery = mongooseQuery;
    this.expressQueryString = expressQueryString;
  }

  filter() {
    const queryObj = { ...this.expressQueryString };

    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "keyword",
      "offset",
    ];

    excludedFields.forEach((field) => {
      delete queryObj[field];
    });

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  search() {
    if (this.expressQueryString.keyword) {
      this.mongooseQuery = this.mongooseQuery.find({
        name: {
          $regex: this.expressQueryString.keyword,
          $options: "i",
        },
      });
    }

    return this;
  }

  sort() {
    if (this.expressQueryString.sort) {
      const sortBy = this.expressQueryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.expressQueryString.fields) {
      const fields = this.expressQueryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }

    return this;
  }

  paginate() {
    const limit =
      Math.abs(Number.parseInt(this.expressQueryString.limit ?? "10", 10)) ||
      10;

    const offsetRaw = this.expressQueryString.offset;

    if (offsetRaw !== undefined) {
      const offset = Math.abs(Number.parseInt(offsetRaw, 10)) || 0;

      this.mongooseQuery = this.mongooseQuery.skip(offset).limit(limit);

      return this;
    }

    const page =
      Math.abs(Number.parseInt(this.expressQueryString.page ?? "1", 10)) || 1;

    const skip = (page - 1) * limit;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    return this;
  }
}

export { APIFeatures };
