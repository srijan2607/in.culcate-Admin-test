// routers/article_short

const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const isAdmin_or_CC = require("../middleware/isAdmin_or_CC");
const { uploadImages } = require("../middleware/upload");
const {
  get_all_knowledge_capsule,
  get_knowledge_capsule_by_id,
  create_knowledge_capsule,
  update_knowledge_capsule,
  delete_knowledge_capsule,
} = require("../controllers/article/article");

router.get("/get_all_the_Article", get_all_knowledge_capsule);
router.patch(
  "/update_article/:id",
  isAdmin_or_CC,
  uploadImages,
  update_knowledge_capsule
);
router.post(
  "/create_article",
  isAdmin_or_CC,
  uploadImages,
  create_knowledge_capsule
);
router.delete("/delete_article/:id", isAdmin_or_CC, delete_knowledge_capsule);
router.get("/get_article/:id", get_knowledge_capsule_by_id);

module.exports = router;


