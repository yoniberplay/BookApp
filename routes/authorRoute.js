const express = require('express');

const router = express.Router();

const AuthorController = require('../controllers/AuthorController');

router.get("/author",AuthorController.GetAuthorList);
router.get("/create-author", AuthorController.GetCreateAuthor);
router.post("/create-author", AuthorController.PostCreateAuthor);
router.get("/edit-author/:authorId", AuthorController.GetEditAuthor);
router.post("/edit-author", AuthorController.PostEditAuthor);
router.post("/delete-author", AuthorController.PostDeleteAuthor);
router.post("/confirm-delete-author", AuthorController.PostConfirmDeleteAuthor);

module.exports = router;