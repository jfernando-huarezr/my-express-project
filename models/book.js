const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});

//virtual property for books URL
BookSchema.virtual("url").get(function () {
  //not using arrow function becasue we need the 'this' object
  return `/catalog/book/${this._id}`;
});

// Export model
module.exports = mongoose.model("Book", BookSchema);
