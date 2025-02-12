// routers/article_short

const express = require("express");
const router = express.Router();
const {
  get_all_knowledge_capsule,
  get_knowledge_capsule_by_id,
  create_knowledge_capsule,
  update_knowledge_capsule,
  delete_knowledge_capsule,
} = require("../controllers/article/article");

router.get("/get_all_the_Article", get_all_knowledge_capsule);
router.patch("/update_article/:id", update_knowledge_capsule);
router.post("/create_article", create_knowledge_capsule);
router.delete("/delete_article/:id", delete_knowledge_capsule);
router.get("/get_article/:id", get_knowledge_capsule_by_id);

module.exports = router;
