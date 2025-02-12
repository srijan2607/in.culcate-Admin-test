// routers/admin.js

const express = require("express");
const router = express.Router();
const {
  get_all_admins,
  get_admin_by_id,
  create_admin,
  update_admin,
  delete_admin,
} = require("../controllers/users/admin");
router.get("/admin", get_all_admins);
router.get("/admin/:id", get_admin_by_id);
router.patch("/admin_update", update_admin);
router.delete("/admin_delete", delete_admin);
router.post("/admin_create", create_admin);

module.exports = router;
