const express = require('express');

const router = express.Router();

const BookController = require('../controllers/BookController');

router.get("/",BookController.GetBooksListHome);
router.get("/book",BookController.GetBooksList);
router.get("/create-book", BookController.GetCreateBook);
router.post("/create-book", BookController.PostCreateBooks);
router.get("/edit-book/:bookId", BookController.GetEditBooks);
router.post("/edit-book", BookController.PostEditBooks);
router.post("/delete-book", BookController.PostDeleteBooks);
router.post("/confirm-delete-book", BookController.PostConfirmDeleteBooks);
// router.get("/byregion/:regionId", BookController.GetPokemonbyregion);
// router.post("/findbyname", BookController.PostPokemonbyName);

module.exports = router;
