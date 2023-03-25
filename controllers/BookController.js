const Category = require("../models/Category");
const Author = require("../models/Author");
const Editorial = require("../models/Editorial");
const Books = require("../models/Book");

exports.GetBooksListHome = (req, res, next) => {
  const myData = req.query.data;
  if (myData) {
    const params = JSON.parse(req.query.data);
    console.log(myData);
    res.render("books/home", {
      pageTitle: "BookApp",
      books: params.books,
      hasBooks: params.books.length > 0,
      Categorys: params.Regions,
      Author: params.Author,
      Editorial: params.Editorial,
    });
  } else {
    let categorysViewModel;
    let authorViewModel;
    let editorialViewModel;
    let books;
    Books.findAll({ include: [{ all: true, nested: true }] })
      .then((result) => {
        books = result.map((restem) => {
          let temp = { ...restem.dataValues };
          temp.Category = restem.Category.dataValues;
          temp.Author = restem.Author.dataValues;
          temp.Editorial = restem.Editorial.dataValues;
          return temp;
        });
        Category.findAll().then((result) => {
          categorysViewModel = result.map((result) => result.dataValues);
          Author.findAll().then((result) => {
            authorViewModel = result.map((result) => result.dataValues);
            Editorial.findAll().then((result) => {
              editorialViewModel = result.map((result) => result.dataValues);
              res.render("books/home", {
                pageTitle: "BookApp",
                books: books,
                hasBooks: books.length > 0,
                Category: categorysViewModel,
                Author: authorViewModel,
                Editorial: editorialViewModel,
              });
            });
          });
        });
      })
      .catch((err) => {
        res.render("Error/ErrorInterno", {
          pageTitle: "Error Interno",
          mensaje: err,
        });
      });
  }
};

exports.GetCreateBook = (req, res, next) => {
  let categorysViewModel;
  let authorViewModel;
  let editorialViewModel;
  Category.findAll()
    .then((result) => {
      categorysViewModel = result.map((result) => result.dataValues);
      Editorial.findAll().then((result) => {
        editorialViewModel = result.map((result) => result.dataValues);
        Author.findAll().then((result) => {
          authorViewModel = result.map((result) => result.dataValues);
          res.render("books/save-books", {
            pageTitle: "Create books",
            MantBook: true,
            editMode: false,
            Category: categorysViewModel,
            hasCategory: categorysViewModel.length > 0,
            Editorial: editorialViewModel,
            hasEditorial: editorialViewModel.length > 0,
            Author: authorViewModel,
            hasAuthor: authorViewModel.length > 0,
          });
        });
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.GetBooksList = (req, res, next) => {
  Books.findAll({ include: [{ all: true, nested: true }] })
    .then((result) => {
      const books = result.map((result) => result.dataValues);
      res.render("books/books-list", {
        pageTitle: "books",
        MantBook: true,
        books: books,
        hasBooks: books.length > 0,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostCreateBooks = (req, res, next) => {
  const title = req.body.title;
  const publicationYear = req.body.publicationYear;
  const img = req.body.img;
  const author = req.body.AuthorId;
  const category = req.body.CategoryId;
  const editorial = req.body.EditorialId;

  console.log(title);

  Books.create({
    title: title,
    publicationYear: publicationYear,
    img: img,
    AuthorId: author,
    CategoryId: category,
    EditorialId: editorial,
  })
    .then((result) => {
      res.redirect("/book");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.GetEditBooks = (req, res, next) => {
  const edit = req.query.edit;
  const bookId = req.params.bookId;

  if (!edit) {
    return res.redirect("/book");
  }

  Books.findOne({ where: { id: bookId } })
    .then((result) => {
      const book = result.dataValues;

      if (!book) {
        return res.redirect("/book");
      }
      let authorViewModel;
      let editorialViewModel;
      let categorysViewModel;
      Category.findAll().then((result) => {
        categorysViewModel = result.map((result) => result.dataValues);
        Author.findAll().then((result) => {
          authorViewModel = result.map((result) => result.dataValues);
          Editorial.findAll().then((result) => {
            editorialViewModel = result.map((result) => result.dataValues);
            res.render("books/save-books", {
              pageTitle: "Edit books",
              MantBook: true,
              editMode: edit,
              book: book,
              Category: categorysViewModel,
              hasCategory: categorysViewModel.length > 0,
              Editorial: editorialViewModel,
              hasEditorial: editorialViewModel.length > 0,
              Author: authorViewModel,
              hasAuthor: authorViewModel.length > 0,
            });
          });
        });
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostEditBooks = (req, res, next) => {
  const title = req.body.title;
  const publicationYear = req.body.publicationYear;
  const img = req.body.img;
  const author = req.body.AuthorId;
  const category = req.body.CategoryId;
  const editorial = req.body.EditorialId;
  const bookId = req.body.bookId;

  Books.update(
    {
        title: title,
        publicationYear: publicationYear,
        img: img,
        AuthorId: author,
        CategoryId: category,
        EditorialId: editorial,
    },
    { where: { id: bookId } }
  )
    .then((result) => {
      return res.redirect("/book");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostConfirmDeleteBooks = (req, res, next) => {
  const bookId = req.body.bookId;
  console.log(bookId);

  Books.findOne({ where: { id: bookId } })
    .then((result) => {
      const book = result.dataValues;

      if (!book) {
        return res.redirect("/book");
      }
      res.render("books/confirm-delete-books", {
        pageTitle: "Confirmacion",
        MantBook: true,
        book: book,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostDeleteBooks = (req, res, next) => {
  const bookId = req.body.bookId;

  Books.destroy({ where: { id: bookId } })
    .then((result) => {
      return res.redirect("/book");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

// exports.GetPokemonbyregion = (req, res, next) => {
//   const regionId = req.params.regionId;
//   let regionsViewModel;
//   let TipoViewModel;
//   let pokemons;
//   Pokemons.findAll({
//     where: { regionId: regionId },
//     include: [{ all: true, nested: true }],
//   })
//     .then((result) => {
//       pokemons = result.map((result) => result.dataValues);
//       Regions.findAll().then((result) => {
//         regionsViewModel = result.map((result) => result.dataValues);
//         Tipo.findAll().then((result) => {
//           TipoViewModel = result.map((result) => result.dataValues);
//           res.redirect(
//             `/?data=${JSON.stringify({
//               pageTitle: "Pokemons",
//               pokemons: pokemons,
//               hasPokemons: pokemons.length > 0,
//               Regions: regionsViewModel,
//               Tipos: TipoViewModel,
//             })}`
//           );
//         });
//       });
//     })
//     .catch((err) => {
//       res.render("Error/ErrorInterno", {
//         pageTitle: "Error Interno",
//         mensaje: err,
//       });
//     });
// };

// exports.PostPokemonbyName = (req, res, next) => {
//   const Name = req.body.Name;
//   let regionsViewModel;
//   let TipoViewModel;
//   let pokemons;
//   Pokemons.findAll({ include: [{ all: true, nested: true }] })
//     .then((result) => {
//       pokemons = result.map((result) => result.dataValues);
//       pokemons = pokemons.filter((result) => {
//         return result.name.toLowerCase() === Name.toLowerCase();
//       });
//       Regions.findAll().then((result) => {
//         regionsViewModel = result.map((result) => result.dataValues);
//         Tipo.findAll().then((result) => {
//           TipoViewModel = result.map((result) => result.dataValues);
//           res.redirect(
//             `/?data=${JSON.stringify({
//               pageTitle: "Pokemons",
//               pokemons: pokemons,
//               hasPokemons: pokemons.length > 0,
//               Regions: regionsViewModel,
//               Tipos: TipoViewModel,
//             })}`
//           );
//         });
//       });
//     })
//     .catch((err) => {
//       res.render("Error/ErrorInterno", {
//         pageTitle: "Error Interno",
//         mensaje: err,
//       });
//     });
// };
