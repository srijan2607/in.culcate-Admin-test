// routers/login.js

const express = require("express");
const router = express.Router();
const login = require("../controllers/auth/login");
const logout = require("../controllers/auth/logout");
const register = require("../controllers/auth/admin_register.test");

router.post("/", login);
router.post("/logout", logout);
router.post("/register", register);

module.exports = router;
