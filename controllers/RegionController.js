const Regions = require("../models/Region");

exports.GetRegionsList = (req, res, next) => {
  Regions.findAll()
    .then((result) => {
      const regions = result.map((result) => result.dataValues);

      res.render("regions/regions-list", {
        pageTitle: "Regions",
        regionsActive: true,
        regions: regions,
        hasRegions: regions.length > 0,
      });
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.GetCreateRegions = (req, res, next) => {
  res.render("regions/save-regions", {
    pageTitle: "Create Regions",
    regionsActive: true,
    editMode: false,
  });
};

exports.PostCreateRegions = (req, res, next) => {
  const name = req.body.Name;
  const description = req.body.description;

  Regions.create({ name: name, description: description })
    .then((result) => {
      res.redirect("/regions");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error",
            mensaje: err,
          });
    });
};

exports.GetEditRegions = (req, res, next) => {
  const edit = req.query.edit;
  const regionId = req.params.regionId;

  if (!edit) {
    return res.redirect("/regions");
  }

  Regions.findOne({ where: { id: regionId } })
    .then((result) => {
      const reg = result.dataValues;
      if (!reg) {
        return res.redirect("/regions");
      }
      res.render("regions/save-regions", {
        pageTitle: "Edit Regions",
        regionsActive: true,
        editMode: edit,
        region: reg,
      });
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.PostEditRegions = (req, res, next) => {
    const name = req.body.Name;
    const description = req.body.description;
  const regionId = req.body.regionId;

  Regions.update({ name: name, description: description }, { where: { id: regionId } })
    .then((result) => {
      return res.redirect("/regions");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.PostConfirmDeleteRegions = (req, res, next) => {
  const regionId = req.body.regionId;

  Regions.findOne({ where: { id: regionId } })
    .then((result) => {
      const region = result.dataValues;
      if (!region) {
        return res.redirect("/regions");
      }
    res.render("regions/confirm-delete-regions", {
      pageTitle: "Confirmacion",
      region: region,
    });
  })
  .catch((err) => {
      res.render("Error/ErrorInterno", {
          pageTitle: "Error Interno",
          mensaje: err,
        });
  });
};


exports.PostDeleteRegions = (req, res, next) => {
    const regionId = req.body.regionId;

    Regions.destroy({ where: { id: regionId } })
    .then((result) => {
      return res.redirect("/regions");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};
