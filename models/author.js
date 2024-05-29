const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

//create virtual property for author full name
AuthorSchema.virtual("name").get(function () {
  //in case the author doesnt have a first name and family name, return an empty string
  let name = "";
  if (this.first_name && this.family_name) {
    name = `${this.family_name}, ${this.first_name}`;
  }

  return name;
});

//virtual property for authors url
AuthorSchema.virtual("url").get(function () {
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : "";
});

AuthorSchema.virtual("date_of_death_formatted").get(function () {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : "";
});

AuthorSchema.virtual("lifespan").get(function () {
  return `${this.date_of_birth_formatted} - ${this.date_of_death_formatted}`;
});

//export model
module.exports = mongoose.model("Author", AuthorSchema);
