// routers/home.js

const express = require("express");
const router = express.Router();
const{
    get_admin_count,
  get_consumer_count,
  get_content_creator_count,
  get_category_count,
  get_tag_count,
  get_knowledge_capsule_count,
} = require("../controllers/home/home_page");

router.get("/", get_admin_count, get_consumer_count, get_content_creator_count, get_category_count, get_tag_count, get_knowledge_capsule_count);


module.exports = router;

