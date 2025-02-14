// routers/admin.js

const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const isAdmin_or_CC = require("../middleware/isAdmin_or_CC");
const {
  get_all_admins,
  get_admin_by_id,
  create_admin,
  update_admin,
  delete_admin,
} = require("../controllers/users/admin");
router.get("/admin", get_all_admins);
router.get("/admin/:id", get_admin_by_id);
router.patch("/admin_update/:id", isAdmin, update_admin);
router.delete("/admin_delete/:id", isAdmin, delete_admin);
router.post("/admin_create", isAdmin, create_admin);

module.exports = router;
