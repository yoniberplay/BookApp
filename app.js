const express = require("express");
const path = require("path");
const app = express();
const { engine } = require("express-handlebars");
const connection = require("./context/AppContext");
const compareHelpers = require('./util/helpers/hbs/compare')
const Editorial = require("./models/Editorial");
const Category = require("./models/Category");
const Books = require("./models/Book");
const Author = require("./models/Author");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");


const errorController = require("./controllers/ErrorController");
const pokemonRoute = require("./routes/pokemonRoute");
const RegionRoute = require("./routes/regionRoute");
const TipoRoute = require("./routes/tipoRoute");

//? render engine configuration
app.engine(
  "hbs",
  engine({
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs",
    helpers: {
      equalValue: compareHelpers.EqualValue,
    },
  })
);
app.set("view engine", "hbs");
app.set("views", "views");

// Convertir la data recibida por post en un json
app.use(express.urlencoded({ extended: false }));

//Hacer los datos de la dentro de la carpeta public e images publicos
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

app.use(multer({ storage: imageStorage }).single("Image"));


//? Mejor manejo de rutas
app.use(pokemonRoute);
app.use(RegionRoute);
app.use(TipoRoute);
app.use("/", errorController.Get404);

//Relacion entre tablas
Books.belongsTo(Author, { constraint: true, onDelete: "CASCADE" });
Author.hasMany(Pokemons);
Books.belongsTo(Category, { constraint: true, onDelete: "CASCADE" });
Category.hasMany(Pokemons);
Books.belongsTo(Editorial, { constraint: true, onDelete: "CASCADE" });
Editorial.hasMany(Pokemons);

connection.sync()
  .then((result) => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err)
  });







