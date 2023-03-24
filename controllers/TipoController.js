const Tipos = require("../models/Tipo");

exports.GetTiposList = (req, res, next) => {
    Tipos.findAll()
    .then((result) => {
      const tipos = result.map((result) => result.dataValues);

      res.render("tipos/tipos-list", {
        pageTitle: "Tipos",
        tiposActive: true,
        tipos: tipos,
        hasTipos: tipos.length > 0,
      });
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.GetCreateTipos = (req, res, next) => {
  res.render("tipos/save-tipos", {
    pageTitle: "Create Tipos",
    tiposActive: true,
    editMode: false,
  });
};

exports.PostCreateTipos = (req, res, next) => {
  const name = req.body.Name;
  const description = req.body.description;

  Tipos.create({ name: name, description: description })
    .then((result) => {
      res.redirect("/tipos");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.GetEditTipos = (req, res, next) => {
  const edit = req.query.edit;
  const tipoId = req.params.tipoId;

  if (!edit) {
    return res.redirect("/tipos");
  }

  Tipos.findOne({ where: { id: tipoId } })
    .then((result) => {
      const tipo = result.dataValues;
      if (!tipo) {
        return res.redirect("/tipos");
      }
      res.render("tipos/save-tipos", {
        pageTitle: "Edit Tipos",
        tiposActive: true,
        editMode: edit,
        tipo: tipo,
      });
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.PostEditTipos = (req, res, next) => {
    const name = req.body.Name;
    const description = req.body.description;
    const tipoId = req.body.tipoId;

  Tipos.update({ name: name, description: description }, { where: { id: tipoId } })
    .then((result) => {
      return res.redirect("/tipos");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.PostConfirmDeleteTipos = (req, res, next) => {
  const tipoId = req.body.tipoId;

  Tipos.findOne({ where: { id: tipoId } })
    .then((result) => {
      const tipo = result.dataValues;
      if (!tipo) {
        return res.redirect("/tipos");
      }
    res.render("tipos/confirm-delete-tipos", {
      pageTitle: "Confirmacion",
      tipo: tipo,
    });
  })
  .catch((err) => {
      res.render("Error/ErrorInterno", {
          pageTitle: "Error Interno",
          mensaje: err,
        });
  });
};


exports.PostDeleteTipos = (req, res, next) => {
    const tipoId = req.body.tipoId;

    Tipos.destroy({ where: { id: tipoId } })
    .then((result) => {
      return res.redirect("/tipos");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};
