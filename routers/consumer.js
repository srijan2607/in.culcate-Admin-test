// routers/consumer.js

const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const isAdmin_or_CC = require("../middleware/isAdmin_or_CC");
const {
  get_all_consumers,
  get_consumer_by_id,
  create_consumer,
  update_consumer,
  delete_consumer,
} = require("../controllers/users/consumer");

router.get("/consumer", get_all_consumers);
router.get("/consumer/:id", get_consumer_by_id);
router.patch("/consumer_update/:id", isAdmin, update_consumer);
router.delete("/consumer_delete/:id", isAdmin, delete_consumer);
router.post("/consumer_create", isAdmin, create_consumer);

module.exports = router;
