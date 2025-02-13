// routers/home.js

const express = require("express");
const router = express.Router();
const{get_counts} = require("../controllers/home/home_page");

router.get("/",get_counts);


module.exports = router;

