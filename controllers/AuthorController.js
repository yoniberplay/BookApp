const Author = require("../models/Author");

exports.GetAuthorList = (req, res, next) => {
    Author.findAll()
    .then((result) => {
      const authores = result.map((result) => result.dataValues);

      res.render("author/author-list", {
        pageTitle: "Author",
        authorActive: true,
        authores: authores,
        hasAuthores: authores.length > 0,
      });
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.GetCreateAuthor = (req, res, next) => {
  res.render("author/save-author", {
    pageTitle: "Create author",
    authorActive: true,
    editMode: false,
  });
};

exports.PostCreateAuthor = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;

  Author.create({ name: name, email: email })
    .then((result) => {
      res.redirect("/author");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error",
            mensaje: err,
          });
    });
};

exports.GetEditAuthor = (req, res, next) => {
  const edit = req.query.edit;
  const authorId = req.params.authorId;

  if (!edit) {
    return res.redirect("/author");
  }

  Author.findOne({ where: { id: authorId } })
    .then((result) => {
      const cat = result.dataValues;
      if (!cat) {
        return res.redirect("/author");
      }
      res.render("author/save-author", {
        pageTitle: "Edit author",
        authorActive: true,
        editMode: edit,
        author: cat,
      });
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.PostEditAuthor = (req, res, next) => {
  const name = req.body.mame;
  const email = req.body.email;
  const authorId = req.body.authorId;

  Author.update({ name: name, email: email }, { where: { id: authorId } })
    .then((result) => {
      return res.redirect("/author");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.PostConfirmDeleteAuthor = (req, res, next) => {
  const authorId = req.body.authorId;

  Author.findOne({ where: { id: authorId } })
    .then((result) => {
      const cat = result.dataValues;
      if (!cat) {
        return res.redirect("/author");
      }
    res.render("author/confirm-delete-author", {
      pageTitle: "Confirmacion",
      author: cat,
    });
  })
  .catch((err) => {
      res.render("Error/ErrorInterno", {
          pageTitle: "Error Interno",
          mensaje: err,
        });
  });
};


exports.PostDeleteAuthor = (req, res, next) => {
    const authorId = req.body.authorId;

    Author.destroy({ where: { id: authorId } })
    .then((result) => {
      return res.redirect("/author");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};
