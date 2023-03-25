const Editorial = require("../models/Editorial");
const Books = require("../models/Book");


exports.GetEditorialList = (req, res, next) => {

    Books.findAll()
    .then((result) => {
      const libros =  result.map((result) => result.dataValues);
      Editorial.findAll()
      .then((result) => {
        let editorials = result.map((result) => result.dataValues);
        editorials = editorials.map((result) => {
          let temp = {...result};
          temp.quantityBooks = libros.filter((result) => {
            return result.EditorialId == temp.Id;
          }).length;
          return temp;
        });
        res.render("editorial/editorial-list", {
        pageTitle: "Editorial",
        editorialActive: true,
        editorials: editorials,
        hasEditorials: editorials.length > 0,
        });
      })
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.GetCreateEditorial = (req, res, next) => {
  res.render("editorial/save-editorial", {
    pageTitle: "Create editorial",
    editorialActive: true,
    editMode: false,
  });
};

exports.PostCreateEditorial = (req, res, next) => {
  const name = req.body.name;
  const telefono = req.body.telefono;
  const pais = req.body.pais;

  Editorial.create({ name, telefono, pais})
    .then((result) => {
      res.redirect("/editorial");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error",
            mensaje: err,
          });
    });
};

exports.GetEditEditorial = (req, res, next) => {
  const edit = req.query.edit;
  const editorialId = req.params.editorialId;

  if (!edit) {
    return res.redirect("/editorial");
  }

  Editorial.findOne({ where: { id: editorialId } })
    .then((result) => {
      const cat = result.dataValues;
      if (!cat) {
        return res.redirect("/editorial");
      }
      res.render("editorial/save-editorial", {
        pageTitle: "Edit editorial",
        editorialActive: true,
        editMode: edit,
        editorial: cat,
      });
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.PostEditEditorial = (req, res, next) => {
  const name = req.body.name;
  const telefono = req.body.telefono;
  const pais = req.body.pais;
  const editorialId = req.body.editorialId;

  Editorial.update({ name, telefono, pais }, { where: { id: editorialId } })
    .then((result) => {
      return res.redirect("/editorial");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.PostConfirmDeleteEditorial = (req, res, next) => {
  const editorialId = req.body.editorialId;

  Editorial.findOne({ where: { id: editorialId } })
    .then((result) => {
      const cat = result.dataValues;
      if (!cat) {
        return res.redirect("/editorial");
      }
    res.render("editorial/confirm-delete-editorial", {
      pageTitle: "Confirmacion",
      editorial: cat,
    });
  })
  .catch((err) => {
      res.render("Error/ErrorInterno", {
          pageTitle: "Error Interno",
          mensaje: err,
        });
  });
};

exports.PostDeleteEditorial = (req, res, next) => {
    const editorialId = req.body.editorialId;

    Editorial.destroy({ where: { id: editorialId } })
    .then((result) => {
      return res.redirect("/editorial");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};
