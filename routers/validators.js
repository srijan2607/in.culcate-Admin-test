const express = require("express");
const router = express.Router();
const {
  get_all_validator,
  get_validator_by_id,
  create_validator,
  update_validator,
  delete_validator,
} = require("../controllers/users/validator");

router.get("/validator", get_all_validator);
router.get("/validator/:id", get_validator_by_id);
router.post("/validator_create", create_validator);
router.patch("/validator_update/:id", update_validator);
router.delete("/validator_delete/:id", delete_validator);

module.exports = router;
