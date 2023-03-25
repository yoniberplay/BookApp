const express = require('express');

const router = express.Router();

const BookController = require('../controllers/BookController');

router.get("/",BookController.GetBooksListHome);
router.get("/book",BookController.GetBooksList);
router.get("/create-book", BookController.GetCreateBook);
router.post("/create-book", BookController.PostCreateBooks);
router.get("/edit-book/:bookId", BookController.GetEditBooks);
router.get("/detail-book/:bookId", BookController.GetDetailBooks);
router.post("/edit-book", BookController.PostEditBooks);
router.post("/delete-book", BookController.PostDeleteBooks);
router.post("/confirm-delete-book", BookController.PostConfirmDeleteBooks);
router.post("/findbyname", BookController.PostBookbyName);
router.post("/bycategoria", BookController.Postfiltroporcategoria);

module.exports = router;
