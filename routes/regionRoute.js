const express = require('express');

const router = express.Router();

const regionController = require('../controllers/RegionController');


router.get("/regions",regionController.GetRegionsList);
router.get("/create-regions", regionController.GetCreateRegions);
router.post("/create-regions", regionController.PostCreateRegions);
router.get("/edit-regions/:regionId", regionController.GetEditRegions);
router.post("/edit-regions", regionController.PostEditRegions);
router.post("/delete-regions", regionController.PostDeleteRegions);
router.post("/confirm-delete-regions", regionController.PostConfirmDeleteRegions);


module.exports = router;