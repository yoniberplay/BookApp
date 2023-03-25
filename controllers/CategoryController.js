const Category = require("../models/Category");
const Books = require("../models/Book");

exports.GetCategoryList = (req, res, next) => {
  
  Books.findAll()
  .then((result) => {
    const libros =  result.map((result) => result.dataValues);
    Category.findAll()
    .then((result) => {
      let categories = result.map((result) => result.dataValues);
      categories = categories.map((result) => {
        let temp = {...result};
        temp.quantityBooks = libros.filter((result) => {
          return result.CategoryId == temp.Id;
        }).length;
        return temp;
      });
      res.render("category/category-list", {
        pageTitle: "Category",
        categoryActive: true,
        categories: categories,
        hasCategories: categories.length > 0,
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

exports.GetCreateCategory = (req, res, next) => {
  res.render("category/save-category", {
    pageTitle: "Create Category",
    categoryActive: true,
    editMode: false,
  });
};

exports.PostCreateCategory = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;

  console.log(description);

  Category.create({ name: name, description: description })
    .then((result) => {
      res.redirect("/category");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error",
            mensaje: err,
          });
    });
};

exports.GetEditCategory = (req, res, next) => {
  const edit = req.query.edit;
  const categoryId = req.params.categoryId;

  if (!edit) {
    return res.redirect("/category");
  }

  Category.findOne({ where: { id: categoryId } })
    .then((result) => {
      const cat = result.dataValues;
      if (!cat) {
        return res.redirect("/category");
      }
      res.render("category/save-category", {
        pageTitle: "Edit category",
        categoryActive: true,
        editMode: edit,
        category: cat,
      });
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.PostEditCategory = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const categoryId = req.body.categoryId;

  Category.update({ name: name, description: description }, { where: { id: categoryId } })
    .then((result) => {
      return res.redirect("/category");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.PostConfirmDeleteCategory = (req, res, next) => {
  const categoryId = req.body.categoryId;

  Category.findOne({ where: { id: categoryId } })
    .then((result) => {
      const cat = result.dataValues;
      if (!cat) {
        return res.redirect("/category");
      }
    res.render("category/confirm-delete-category", {
      pageTitle: "Confirmacion",
      category: cat,
    });
  })
  .catch((err) => {
      res.render("Error/ErrorInterno", {
          pageTitle: "Error Interno",
          mensaje: err,
        });
  });
};

exports.PostDeleteCategory = (req, res, next) => {
    const categoryId = req.body.categoryId;

    Category.destroy({ where: { id: categoryId } })
    .then((result) => {
      return res.redirect("/category");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};
