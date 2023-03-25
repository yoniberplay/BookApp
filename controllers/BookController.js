const Category = require("../models/Category");
const Author = require("../models/Author");
const Editorial = require("../models/Editorial");
const Books = require("../models/Book");
const transporter = require("../services/EmailService");

exports.GetBooksListHome = (req, res, next) => {
  const myData = req.query.data;
  if (myData) {
    const params = JSON.parse(req.query.data);
    res.render("books/home", {
      pageTitle: "BookApp",
      books: params.books,
      hasBooks: params.books.length > 0,
      Category: params.Category,
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

exports.GetBooksList = (req, res, next) => {
  Books.findAll({ include: [{ all: true, nested: true }] })
    .then((result) => {
      let books = result.map((result) => result.dataValues);
      books = result.map((restem) => {
        let temp = { ...restem.dataValues };
        temp.Category = restem.Category.dataValues;
        temp.Author = restem.Author.dataValues;
        temp.Editorial = restem.Editorial.dataValues;
        return temp;
      });
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

exports.PostCreateBooks = (req, res, next) => {
  const title = req.body.title;
  const publicationYear = req.body.publicationYear;
  const img = req.file;
  const author = req.body.AuthorId;
  const category = req.body.CategoryId;
  const editorial = req.body.EditorialId;

  Books.create({
    title: title,
    publicationYear: publicationYear,
    img: "/" + img.path, // images/image.jpg,
    AuthorId: author,
    CategoryId: category,
    EditorialId: editorial,
  })
    .then((result) => {
      Author.findOne({ where: { id: author } }).then((result) => {
        const aut = result.dataValues;
        res.redirect("/book");
        return transporter.sendMail({
          from: "BookApp notifications",
          to: aut.email,
          subject: `Publicacion de libro`,
          html: `Saludos, ${aut.name} ha sido publicado su libro titulado ${title}.`,
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
  const img = req.file;
  const author = req.body.AuthorId;
  const category = req.body.CategoryId;
  const editorial = req.body.EditorialId;
  const bookId = req.body.bookId;

  Books.findOne({ where: { id: bookId } })
    .then((result) => {
      const bk = result.dataValues;
      if (!bk) {
        return res.redirect("/");
      }
      const imagePath = img ? "/" + img.path : bk.img; // operador ternario
      Books.update(
        {
          title: title,
          publicationYear: publicationYear,
          img: imagePath,
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
          console.log(err);
        });
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
  // console.log(bookId);

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

exports.GetDetailBooks = (req, res, next) => {
  const bookId = req.params.bookId;

  Books.findOne({
    where: { Id: bookId },
    include: [{ all: true, nested: true }],
  })
    .then((result) => {
      let book = result.dataValues;
      if (!book) {
        return res.redirect("/book");
      }
      let temp = { ...book };
      temp.Category = book.Category.dataValues;
      temp.Author = book.Author.dataValues;
      temp.Editorial = book.Editorial.dataValues;
      // console.log(temp);
      res.render("books/details-books", {
        pageTitle: "Detalles Libro",
        book: temp,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostBookbyName = (req, res, next) => {
  const title = req.body.title;
  let categoryViewModel;
  let authorViewModel;
  let editorialViewModel;
  let books;
  Books.findAll({ include: [{ all: true, nested: true }] })
    .then((result) => {
      books = result.map((result) => result.dataValues);
      books = books.filter((result) => {
        return result.title.toLowerCase() === title.toLowerCase();
      });
      Category.findAll().then((result) => {
        categoryViewModel = result.map((result) => result.dataValues);
        Author.findAll().then((result) => {
          authorViewModel = result.map((result) => result.dataValues);
          Editorial.findAll().then((result) => {
            editorialViewModel = result.map((result) => result.dataValues);
            res.redirect(
              `/?data=${JSON.stringify({
                books: books,
                Category: categoryViewModel,
                Author: authorViewModel,
                Editorial: editorialViewModel,
              })}`
            );
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

exports.Postfiltroporcategoria = (req, res, next) => {
  const keys = Object.keys(req.body);
  let categoryViewModel;
  let authorViewModel;
  let editorialViewModel;
  let books;
  Books.findAll({ include: [{ all: true, nested: true }] })
    .then((result) => {
      books = result.map((result) => result.dataValues);
      books = books.filter((result) => {
        return keys.includes(result.Category.name);
      });
      Category.findAll().then((result) => {
        categoryViewModel = result.map((result) => result.dataValues);
        Author.findAll().then((result) => {
          authorViewModel = result.map((result) => result.dataValues);
          Editorial.findAll().then((result) => {
            editorialViewModel = result.map((result) => result.dataValues);
            res.redirect(
              `/?data=${JSON.stringify({
                books: books,
                Category: categoryViewModel,
                Author: authorViewModel,
                Editorial: editorialViewModel,
              })}`
            );
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
