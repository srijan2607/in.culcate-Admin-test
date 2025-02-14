const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const isAdmin_or_CC = require("../middleware/isAdmin_or_CC");
const {
  get_all_content_creators,
  get_content_creator_by_id,
  create_content_creator,
  update_content_creator,
  delete_content_creator,
} = require("../controllers/users/content_creator");

router.get("/content_creator", get_all_content_creators);
router.get("/content_creator/:id", get_content_creator_by_id);
router.patch("/content_creator_update/:id", isAdmin, update_content_creator);
router.delete("/content_creator_delete/:id", isAdmin, delete_content_creator);
router.post("/content_creator_create", isAdmin, create_content_creator);

module.exports = router;
