const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({ name: 1 }).exec();

  res.render("layout", {
    page: "genre_list",
    title: "Genre List",
    genre_list: allGenres,
  });
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  //get details of genre and all associated books (in paralell)
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  if (genre === null) {
    //no results
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("layout", {
    page: "genre_detail",
    title: "Genre Detail",
    genre: genre,
    genre_books: booksInGenre,
  });
});

// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.render("layout", { page: "genre_form", title: "Create Genre" });
});

// Handle Genre create on POST.
exports.genre_create_post = [
  //first middleware
  //Validate and sanitize the name field
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  //second and last middleware
  //Process request after validation and sanitizacion
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    //Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      //if there are errors, render the form again with sanitized  values/error messages.
      res.render("layout", {
        page: "genre_form",
        title: "Create genre",
        genre: genre,
        errors: errors.array(),
      });

      return;
    } else {
      //Data from form is valid
      //Check if Genre with same name already exists
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();

      if (genreExists) {
        //Genre exists, redirect to its detail page.
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        //new genre saved, redirect to genre detail page
        res.redirect(genre.url);
      }
    }
  }),
];

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

// Handle Genre update on POST.
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
