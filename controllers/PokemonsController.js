const Regions = require("../models/Region");
const Tipo = require("../models/Tipo");
const Pokemons = require("../models/Pokemon");

exports.GetPokemonsListHome = (req, res, next) => {
  const myData = req.query.data;
  if (myData) {
    const params = JSON.parse(req.query.data);
    console.log(myData)
    res.render("pokemons/home", {
      pageTitle: "Pokemons",
      pokemons: params.pokemons,
      hasPokemons: params.pokemons.length > 0,
      Regions: params.Regions,
      Tipos: params.Tipos,
    });
  } else {
    let regionsViewModel;
    let TipoViewModel;
    let pokemons;
    Pokemons.findAll({ include: [{ all: true, nested: true }] })
      .then((result) => {
        pokemons = result.map((restem) => {
          let temp = { ...restem.dataValues };
          temp.Tipo = restem.Tipo.dataValues;
          temp.Region = restem.Region.dataValues;
          return temp;
        }
        );
        Regions.findAll().then((result) => {
          regionsViewModel = result.map((result) => result.dataValues);
          Tipo.findAll().then((result) => {
            TipoViewModel = result.map((result) => result.dataValues);
            res.render("pokemons/home", {
              pageTitle: "Pokemons",
              pokemons: pokemons,
              hasPokemons: pokemons.length > 0,
              Regions: regionsViewModel,
              Tipos: TipoViewModel,
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

exports.GetCreatePokemons = (req, res, next) => {
  let regionsViewModel;
  let TipoViewModel;
  Regions.findAll()
    .then((result) => {
      regionsViewModel = result.map((result) => result.dataValues);
      Tipo.findAll().then((result) => {
        TipoViewModel = result.map((result) => result.dataValues);
        res.render("pokemons/save-pokemons", {
          pageTitle: "Create Pokemons",
          MantPoke: true,
          editMode: false,
          Regions: regionsViewModel,
          hasRegions: regionsViewModel.length > 0,
          Tipos: TipoViewModel,
          hasTipos: TipoViewModel.length > 0,
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

exports.GetPokemonsList = (req, res, next) => {
  Pokemons.findAll({ include: [{ all: true, nested: true }] })
    .then((result) => {
      const pokemons = result.map((result) => result.dataValues);
      res.render("pokemons/pokemons-list", {
        pageTitle: "Pokemons",
        MantPoke: true,
        pokemons: pokemons,
        hasPokemons: pokemons.length > 0,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostCreatePokemons = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const imgUrl = req.body.imgUrl;
  const tipo = req.body.TipoId;
  const region = req.body.RegionId;

  console.log(name);

  Pokemons.create({
    name: name,
    imgUrl: imgUrl,
    description: description,
    TipoId: tipo,
    RegionId: region,
  })
    .then((result) => {
      res.redirect("/pokemon");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.GetEditPokemons = (req, res, next) => {
  const edit = req.query.edit;
  const pokeId = req.params.pokeId;

  if (!edit) {
    return res.redirect("/pokemon");
  }

  Pokemons.findOne({ where: { id: pokeId } })
    .then((result) => {
      const poke = result.dataValues;

      if (!poke) {
        return res.redirect("/pokemon");
      }
      let regionsViewModel;
      let TipoViewModel;
      Regions.findAll().then((result) => {
        regionsViewModel = result.map((result) => result.dataValues);
        Tipo.findAll().then((result) => {
          TipoViewModel = result.map((result) => result.dataValues);
          res.render("pokemons/save-pokemons", {
            pageTitle: "Edit Pokemons",
            MantPoke: true,
            editMode: edit,
            poke: poke,
            Regions: regionsViewModel,
            hasRegions: regionsViewModel.length > 0,
            Tipos: TipoViewModel,
            hasTipos: TipoViewModel.length > 0,
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

exports.PostEditPokemons = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const imgUrl = req.body.imgUrl;
  const tipo = req.body.TipoId;
  const region = req.body.RegionId;
  const pokeId = req.body.pokeId;

  Pokemons.update(
    {
      name: name,
      description: description,
      imgUrl: imgUrl,
      TipoId: tipo,
      RegionId: region,
    },
    { where: { id: pokeId } }
  )
    .then((result) => {
      return res.redirect("/pokemon");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostConfirmDeletePokemons = (req, res, next) => {
  const pokeId = req.body.pokeId;
  console.log(pokeId);

  Pokemons.findOne({ where: { id: pokeId } })
    .then((result) => {
      const poke = result.dataValues;

      if (!poke) {
        return res.redirect("/pokemon");
      }
      res.render("pokemons/confirm-delete-pokemons", {
        pageTitle: "Confirmacion",
        MantPoke: true,
        poke: poke,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostDeletePokemons = (req, res, next) => {
  const pokeId = req.body.pokemonId;

  Pokemons.destroy({ where: { id: pokeId } })
    .then((result) => {
      return res.redirect("/pokemon");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.GetPokemonbyregion = (req, res, next) => {
  const regionId = req.params.regionId;
  let regionsViewModel;
  let TipoViewModel;
  let pokemons;
  Pokemons.findAll({ where: { regionId: regionId }, include: [{ all: true, nested: true }] })
    .then((result) => {
      pokemons = result.map((result) => result.dataValues);
      Regions.findAll().then((result) => {
        regionsViewModel = result.map((result) => result.dataValues);
        Tipo.findAll().then((result) => {
          TipoViewModel = result.map((result) => result.dataValues);
          res.redirect(
            `/?data=${JSON.stringify({
              pageTitle: "Pokemons",
              pokemons: pokemons,
              hasPokemons: pokemons.length > 0,
              Regions: regionsViewModel,
              Tipos: TipoViewModel,
            })}`
          );
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

exports.PostPokemonbyName = (req, res, next) => {
  const Name = req.body.Name;
  let regionsViewModel;
  let TipoViewModel;
  let pokemons;
  Pokemons.findAll({ include: [{ all: true, nested: true }] })
    .then((result) => {
      pokemons = result.map((result) => result.dataValues);
      pokemons = pokemons.filter((result) => {
        return result.name.toLowerCase() === Name.toLowerCase()
      }
      );
      Regions.findAll().then((result) => {
        regionsViewModel = result.map((result) => result.dataValues);
        Tipo.findAll().then((result) => {
          TipoViewModel = result.map((result) => result.dataValues);
          res.redirect(
            `/?data=${JSON.stringify({
              pageTitle: "Pokemons",
              pokemons: pokemons,
              hasPokemons: pokemons.length > 0,
              Regions: regionsViewModel,
              Tipos: TipoViewModel,
            })}`
          );
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
