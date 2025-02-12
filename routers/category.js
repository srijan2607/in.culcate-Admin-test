const express = require("express");
const router = express.Router();
const {
  get_all_categories,
  create_category,
  update_category,
  delete_category,
} = require("../controllers/category/category");

router.get("/get_all_categories", get_all_categories);
router.post("/create_category", create_category);
router.patch("/update_category/:id", update_category);
router.delete("/delete_category/:id", delete_category);

module.exports = router;
