const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const isAdmin_or_CC = require("../middleware/isAdmin_or_CC");
const {
  get_all_categories,
  create_category,
  update_category,
  delete_category,
} = require("../controllers/category/category");

router.get("/get_all_categories", get_all_categories);
router.post("/create_category",isAdmin_or_CC ,create_category);
router.patch("/update_category/:id",isAdmin_or_CC ,update_category);
router.delete("/delete_category/:id",isAdmin_or_CC ,delete_category);

module.exports = router;
